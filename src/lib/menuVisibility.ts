import { useSyncExternalStore } from 'react';

/**
 * เมนูที่ซ่อนไว้เพื่อให้ใช้งานง่าย (ไม่ได้ลบ — เปิดคืนได้ที่ ตั้งค่าระบบ → การแสดงผล → "แสดงเมนูทั้งหมด")
 * เก็บค่าเป็นของแต่ละเครื่อง/ผู้ใช้ (localStorage)
 */
export const HIDDEN_MENUS = {
  /** งานอำนวยการ */
  admin: ['travel', 'units', 'smart-ops', 'logs'],
  /** งานประชาสัมพันธ์: แท็บบน + เมนูข้างในศูนย์ปฏิบัติการ PR */
  relationsTabs: ['public'],
  relationsViews: ['keywords', 'compare', 'ai-news', 'scanner', 'ocr-results', 'pending-docs', 'doc-history', 'smart-ops'],
  /** งานพัฒนาและช่วยเหลือประชาชน */
  disaster: ['stations', 'smart-ops'],
} as const;

const KEY = 'fo5.showAllMenus';
const listeners = new Set<() => void>();

const read = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

export const setShowAllMenus = (on: boolean) => {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* ใช้ค่าในหน่วยความจำไม่ได้ ก็ปล่อยตามค่าเดิม */
  }
  listeners.forEach(fn => fn());
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => e.key === KEY && fn();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
};

export const useShowAllMenus = () => useSyncExternalStore(subscribe, read, () => false);

/** กรองเมนูที่ซ่อนออก (ถ้าเปิด "แสดงเมนูทั้งหมด" จะคืนทั้งหมด) */
export function useVisible<T extends { id: string }>(items: readonly T[], hidden: readonly string[]): T[] {
  const all = useShowAllMenus();
  return all ? [...items] : items.filter(i => !hidden.includes(i.id));
}
