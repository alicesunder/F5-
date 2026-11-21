import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { isDemo, onDemoChange, setDemoMode } from './demoMode';

/**
 * ที่เก็บข้อมูลถาวรของทุกโมดูล (ตาราง public.app_records, เฉพาะบุคลากร)
 * แต่ละ collection คือรายการ object ที่มีคีย์ไม่ซ้ำ ใช้แทน useState ได้ตรง ๆ:
 *   const [items, setItems, status] = useCollection<BudgetItem>('admin.budgets', 'budget_id');
 * setItems หาความต่างตามคีย์ แล้วบันทึก/ลบเฉพาะแถวที่เปลี่ยน และซิงก์ข้ามเครื่องผ่าน Realtime
 * ข้อมูลเริ่มต้นว่างเสมอ
 */

export type CollectionStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface CollectionState {
  status: CollectionStatus;
  error: string | null;
  saving: boolean;
}

/** ชื่อ field ที่เป็นคีย์ หรือฟังก์ชันคืนคีย์ (ค่าเริ่มต้น 'id') */
export type KeySpec<T> = keyof T | ((item: T) => unknown);

type Listener = () => void;
type Updater<T> = T[] | ((prev: T[]) => T[]);

const PAGE = 1000;

class CollectionStore<T extends object> {
  items: T[] = [];
  state: CollectionState = { status: 'idle', error: null, saving: false };
  private listeners = new Set<Listener>();
  private pending = 0;
  private loadToken = 0;
  private keyOf: (item: T) => string;

  constructor(readonly name: string, key: KeySpec<T>) {
    this.keyOf = (item: T) => {
      const v = typeof key === 'function' ? key(item) : (item as Record<PropertyKey, unknown>)[key as PropertyKey];
      return v === undefined || v === null ? '' : String(v);
    };
  }

  get watched() {
    return this.listeners.size > 0;
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getItems = () => this.items;
  getState = () => this.state;

  private emit() {
    for (const fn of this.listeners) fn();
  }

  private setState(patch: Partial<CollectionState>) {
    this.state = { ...this.state, ...patch };
    this.emit();
  }

  reset() {
    this.loadToken++;
    this.items = [];
    this.state = { status: 'idle', error: null, saving: false };
    this.emit();
  }

  /** โหมดจำลอง: ตัวอย่างของ collection นี้ (ถ้ามี) — undefined = ไม่มีตัวอย่าง ใช้ข้อมูลจริงอ่านอย่างเดียว */
  private demoSeed: object[] | undefined;
  hasDemo = false;

  async load() {
    if (!isSupabaseConfigured || !hasSession) return;
    const token = ++this.loadToken;
    this.setState({ status: 'loading', error: null });
    this.hasDemo = false;
    if (isDemo()) {
      try {
        const mod = await import('../data/demoData');
        if (token !== this.loadToken) return;
        const make = mod.DEMO[this.name];
        if (make) {
          this.hasDemo = true;
          this.demoSeed ??= make();
          this.items = this.demoSeed.map(x => structuredClone(x)) as T[];
          this.setState({ status: 'ready', error: null });
          return;
        }
      } catch {
        /* โหลดตัวอย่างไม่ได้: ใช้ข้อมูลจริงอ่านอย่างเดียวต่อ */
      }
    }
    const rows: T[] = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from('app_records')
        .select('id, data')
        .eq('collection', this.name)
        .order('created_at', { ascending: false })
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1);
      if (token !== this.loadToken) return;
      if (error) {
        this.setState({ status: 'error', error: error.message });
        return;
      }
      for (const r of data ?? []) rows.push(r.data as T);
      if (!data || data.length < PAGE) break;
    }
    this.items = rows;
    this.setState({ status: 'ready', error: null });
  }

  /** เปลี่ยนโหมดจำลอง: ทิ้งข้อมูลในหน่วยความจำ แล้วโหลดใหม่ถ้ามีคนใช้อยู่ */
  demoReset() {
    this.demoSeed = undefined;
    const used = this.state.status !== 'idle' || this.watched;
    this.reset();
    if (used) void this.load();
  }

  ensureLoaded() {
    if (this.state.status === 'idle') void this.load();
  }

  /** รับการเปลี่ยนแปลงจากเครื่องอื่น */
  applyRemote(kind: 'INSERT' | 'UPDATE' | 'DELETE', id: string, data?: unknown) {
    if (this.state.status === 'idle') return;
    if (isDemo()) return; // โหมดจำลอง: ไม่รับการเปลี่ยนแปลงจากเครื่องอื่นมาปน
    const idx = this.items.findIndex(x => this.keyOf(x) === id);
    if (kind === 'DELETE') {
      if (idx === -1) return;
      this.items = this.items.filter((_, i) => i !== idx);
    } else {
      const item = data as T;
      if (idx === -1) this.items = [item, ...this.items];
      else if (JSON.stringify(this.items[idx]) === JSON.stringify(item)) return;
      else this.items = this.items.map((x, i) => (i === idx ? item : x));
    }
    this.emit();
  }

  set(updater: Updater<T>): Promise<boolean> {
    const prev = this.items;
    const next = typeof updater === 'function' ? (updater as (p: T[]) => T[])(prev) : updater;
    if (next === prev) return Promise.resolve(true);

    const prevByKey = new Map(prev.map(x => [this.keyOf(x), x]));
    const nextKeys = new Set<string>();
    const upserts: { collection: string; id: string; data: T }[] = [];
    for (const item of next) {
      const id = item ? this.keyOf(item) : '';
      if (!id) {
        console.warn(`[collections] ${this.name}: ข้ามรายการที่ไม่มีคีย์`, item);
        continue;
      }
      if (nextKeys.has(id)) continue;
      nextKeys.add(id);
      const old = prevByKey.get(id);
      if (!old || (old !== item && JSON.stringify(old) !== JSON.stringify(item))) {
        upserts.push({ collection: this.name, id, data: toJson(item) });
      }
    }
    const deletes = [...prevByKey.keys()].filter(k => k && !nextKeys.has(k));

    this.items = next;
    this.emit();
    if (!upserts.length && !deletes.length) return Promise.resolve(true);
    // โหมดจำลอง: เก็บเฉพาะในหน่วยความจำ ไม่ส่งไปฐานข้อมูลจริงเด็ดขาด
    if (isDemo()) return Promise.resolve(true);
    if (!isSupabaseConfigured || !hasSession) {
      this.items = prev;
      this.setState({ error: 'ยังไม่ได้เข้าสู่ระบบ บันทึกไม่ได้' });
      notifyError(this.name, 'ยังไม่ได้เข้าสู่ระบบ');
      return Promise.resolve(false);
    }

    this.pending++;
    this.setState({ saving: true });
    return (async () => {
      try {
        for (let i = 0; i < upserts.length; i += 500) {
          const { error } = await supabase.from('app_records').upsert(upserts.slice(i, i + 500));
          if (error) throw error;
        }
        for (let i = 0; i < deletes.length; i += 200) {
          const { error } = await supabase
            .from('app_records')
            .delete()
            .eq('collection', this.name)
            .in('id', deletes.slice(i, i + 200));
          if (error) throw error;
        }
        this.setState({ error: null });
        return true;
      } catch (e) {
        // คืนค่าเดิมถ้าไม่มีใครแก้ต่อระหว่างนั้น ไม่อย่างนั้นโหลดใหม่จากฐานข้อมูล
        if (this.items === next) this.items = prev;
        else void this.load();
        const message = (e as { message?: string })?.message ?? String(e);
        this.setState({ error: `บันทึกไม่สำเร็จ: ${message}` });
        notifyError(this.name, message);
        return false;
      } finally {
        this.pending--;
        this.setState({ saving: this.pending > 0 });
      }
    })();
  }
}

function toJson<T>(item: T): T {
  return JSON.parse(JSON.stringify(item)) as T;
}

const stores = new Map<string, CollectionStore<object>>();
let hasSession = false;
let currentUid = '';
const uidListeners = new Set<() => void>();
let channel: RealtimeChannel | null = null;
const errorListeners = new Set<(collection: string, message: string) => void>();

function notifyError(collection: string, message: string) {
  for (const fn of errorListeners) fn(collection, message);
}

/** ให้ส่วนกลาง (เช่น toast) รู้เมื่อบันทึกไม่สำเร็จ */
export function onCollectionError(fn: (collection: string, message: string) => void) {
  errorListeners.add(fn);
  return () => {
    errorListeners.delete(fn);
  };
}

export function getCollectionStore<T extends object>(name: string, key: KeySpec<T> = 'id' as KeySpec<T>) {
  let s = stores.get(name);
  if (!s) {
    s = new CollectionStore<T>(name, key) as unknown as CollectionStore<object>;
    stores.set(name, s);
  }
  return s as unknown as CollectionStore<T>;
}

function startRealtime() {
  if (channel) return;
  channel = supabase
    .channel('app_records_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_records' }, payload => {
      const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as {
        collection?: string;
        id?: string;
        data?: unknown;
      };
      if (!row?.id) return;
      if (row.collection) {
        stores.get(row.collection)?.applyRemote(payload.eventType, row.id, row.data);
      } else if (payload.eventType === 'DELETE') {
        for (const s of stores.values()) s.applyRemote('DELETE', row.id);
      }
    })
    .subscribe();
}

function stopRealtime() {
  if (channel) void supabase.removeChannel(channel);
  channel = null;
}

// เปิด/ปิดโหมดจำลอง: ล้างทุก collection แล้วให้โหลดใหม่ (จำลอง หรือ ข้อมูลจริง)
onDemoChange(() => {
  for (const s of stores.values()) {
    s.demoReset();
  }
});

if (isSupabaseConfigured) {
  supabase.auth.onAuthStateChange((event, session) => {
    const had = hasSession;
    hasSession = !!session;
    const uid = session?.user?.id ?? '';
    if (uid !== currentUid) {
      currentUid = uid;
      for (const fn of uidListeners) fn();
    }
    if (!session) {
      setDemoMode(false); // ออกจากระบบ = ปิดโหมดจำลองเสมอ
      stopRealtime();
      for (const s of stores.values()) s.reset();
      return;
    }
    if (!had || event === 'SIGNED_IN') {
      startRealtime();
      // โหลดหลัง callback ของ auth จบ (supabase-js ห้ามเรียก API ซ้อนใน callback)
      setTimeout(() => {
        for (const s of stores.values()) if (s.state.status !== 'idle' || s.watched) void s.load();
      }, 0);
    }
  });
}

/** ใช้แทน useState<T[]>(...) — ข้อมูลเริ่มต้นว่าง และบันทึกถาวร */
export function useCollection<T extends object>(name: string, key?: KeySpec<T>) {
  const store = getCollectionStore<T>(name, key);
  const items = useSyncExternalStore(store.subscribe, store.getItems);
  const state = useSyncExternalStore(store.subscribe, store.getState);
  useEffect(() => {
    store.ensureLoaded();
  }, [store, state.status]);
  const setItems = useCallback((u: Updater<T>) => store.set(u), [store]);
  return [items, setItems, state] as const;
}

const subscribeUid = (fn: () => void) => {
  uidListeners.add(fn);
  return () => {
    uidListeners.delete(fn);
  };
};
const getUid = () => currentUid;

/** ข้อมูลส่วนตัว: เห็นได้เฉพาะเจ้าของบัญชี (collection me.<uid>.<name>, บังคับโดย RLS) */
export function useMyCollection<T extends object>(name: string, key?: KeySpec<T>) {
  const uid = useSyncExternalStore(subscribeUid, getUid);
  return useCollection<T>(uid ? `me.${uid}.${name}` : `me.none.${name}`, key);
}

/** สำหรับ service ที่ไม่ใช่ React: โหลดข้อมูลและรับการเปลี่ยนแปลง */
export function watchCollection<T extends object>(name: string, key: KeySpec<T>, fn: (items: T[]) => void) {
  const store = getCollectionStore<T>(name, key);
  store.ensureLoaded();
  fn(store.items);
  return store.subscribe(() => fn(store.items));
}
