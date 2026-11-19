import React, { useCallback, useEffect, useState } from 'react';
import { Facebook, RefreshCw, Loader2, CheckCircle2, AlertTriangle, Link2, Copy, Unplug } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useAdmin } from '../../../../contexts/AdminContext';

interface FbPage {
  page_id: string;
  name: string | null;
  picture: string | null;
  connected_at: string;
  last_sync_at: string | null;
  last_error: string | null;
}
interface Status {
  configured: boolean;
  redirectUri: string;
  pages: FbPage[];
}

const MESSAGES: Record<string, string> = {
  cancelled: 'ยกเลิกการเชื่อมต่อ Facebook',
  expired: 'ลิงก์หมดอายุ กรุณากดเชื่อมต่ออีกครั้ง',
  'not-configured': 'ยังไม่ได้ใส่รหัสแอป Facebook',
  'no-pages': 'บัญชีนี้ไม่ได้เป็นแอดมินของเพจใด',
  error: 'เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่',
};

async function call(action: string, body?: unknown) {
  const { data, error } = await supabase.functions.invoke(`facebook?action=${action}`, {
    method: body === undefined && action === 'status' ? 'GET' : 'POST',
    body: body as Record<string, unknown> | undefined,
  });
  if (error) {
    const ctx = (error as { context?: Response }).context;
    const msg = ctx ? ((await ctx.json().catch(() => null)) as { error?: string } | null)?.error : null;
    throw new Error(msg || error.message);
  }
  return data;
}

const input =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151A22] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30';

/** เชื่อมเพจ Facebook ของหน่วย: ใส่รหัสแอปครั้งเดียว แล้วกดอนุญาตเพจ ระบบดึงโพสต์ทุก 15 นาที */
export const FacebookConnectCard: React.FC = () => {
  const { showToast, currentRole } = useAdmin();
  const canManage = ['SUPER_ADMIN', 'ADMIN', 'RELATIONS'].includes(String(currentRole));
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');

  const load = useCallback(async () => {
    try {
      setStatus((await call('status')) as Status);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void load();
    // ผลจากหน้าอนุญาตของ Facebook (?fb=...)
    const q = new URLSearchParams(window.location.search).get('fb');
    if (q) {
      if (q.startsWith('connected-')) showToast(`เชื่อมต่อ ${q.split('-')[1]} เพจแล้ว กำลังดึงโพสต์`, 'success');
      else showToast(MESSAGES[q] || q, 'error');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [load, showToast]);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      showToast(e instanceof Error ? e.message : String(e), 'error');
    } finally {
      setBusy('');
    }
  };

  const saveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    void run('config', async () => {
      await call('config', { app_id: appId, app_secret: appSecret });
      setAppSecret('');
      showToast('บันทึกรหัสแอปแล้ว', 'success');
      await load();
    });
  };

  const connect = () =>
    run('connect', async () => {
      const { url } = (await call('auth-url', {})) as { url: string };
      window.location.href = url;
    });

  const sync = () =>
    run('sync', async () => {
      const r = (await call('sync', {})) as { results: Record<string, string> };
      const bad = Object.values(r.results).filter(v => v.startsWith('error'));
      showToast(bad.length ? `ดึงไม่สำเร็จ ${bad.length} เพจ` : 'ดึงโพสต์ล่าสุดแล้ว', bad.length ? 'error' : 'success');
      await load();
    });

  const disconnect = (p: FbPage) => {
    if (!window.confirm(`ยกเลิกการเชื่อมต่อเพจ ${p.name}?`)) return;
    void run(`d-${p.page_id}`, async () => {
      await call('disconnect', { page_id: p.page_id });
      await load();
    });
  };

  return (
    <section className="rounded-2xl border border-blue-200/70 dark:border-white/10 bg-white dark:bg-[#151A24] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center">
          <Facebook className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-[12rem]">
          <h2 className="text-base font-black text-slate-900 dark:text-white">เพจ Facebook ของหน่วย</h2>
          <p className="text-xs text-slate-500">ดึงโพสต์ ยอดถูกใจ คอมเมนต์ และแชร์ อัตโนมัติทุก 15 นาที</p>
        </div>
        {status?.pages.length ? (
          <button
            type="button"
            onClick={sync}
            disabled={!!busy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-[13px] font-bold disabled:opacity-50 cursor-pointer"
          >
            {busy === 'sync' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} ดึงตอนนี้
          </button>
        ) : null}
      </div>

      {!status && !error && (
        <p className="text-xs text-slate-500 flex items-center gap-1" role="status">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังตรวจสถานะ...
        </p>
      )}
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}

      {status && !status.configured && (
        canManage ? (
          <form onSubmit={saveConfig} className="space-y-3 rounded-xl bg-slate-50 dark:bg-white/5 p-4">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">ขั้นที่ 1: ใส่รหัสแอป Facebook (ทำครั้งเดียว)</p>
            <p className="text-xs text-slate-500">
              ได้จาก developers.facebook.com &gt; แอปของคุณ &gt; การตั้งค่า &gt; ข้อมูลพื้นฐาน และต้องใส่ลิงก์ด้านล่างในช่อง "Valid OAuth Redirect URIs" ของ Facebook Login
            </p>
            <div className="flex items-center gap-2 text-xs bg-white dark:bg-[#151A22] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2">
              <code className="flex-1 break-all">{status.redirectUri}</code>
              <button
                type="button"
                className="p-1 rounded hover:bg-slate-100 cursor-pointer"
                aria-label="คัดลอกลิงก์"
                onClick={() => {
                  void navigator.clipboard.writeText(status.redirectUri);
                  showToast('คัดลอกแล้ว', 'success');
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                App ID
                <input className={input} inputMode="numeric" value={appId} onChange={e => setAppId(e.target.value)} required />
              </label>
              <label className="space-y-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                App Secret
                <input className={input} type="password" autoComplete="off" value={appSecret} onChange={e => setAppSecret(e.target.value)} required />
              </label>
            </div>
            <button type="submit" disabled={busy === 'config'} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-bold disabled:opacity-50 cursor-pointer">
              {busy === 'config' && <Loader2 className="w-4 h-4 animate-spin" />} บันทึกรหัสแอป
            </button>
          </form>
        ) : (
          <p className="text-sm text-slate-500">ยังไม่ได้ตั้งค่า กรุณาให้ผู้ดูแลระบบหรืองานประชาสัมพันธ์เชื่อมต่อเพจ</p>
        )
      )}

      {status?.configured && (
        <div className="space-y-3">
          {status.pages.length === 0 ? (
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-4 space-y-2">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">ขั้นที่ 2: อนุญาตให้เว็บอ่านเพจ</p>
              <p className="text-xs text-slate-500">ต้องกดด้วยบัญชี Facebook ที่เป็นแอดมินของเพจ แล้วเลือกเพจที่ต้องการ</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {status.pages.map(p => (
                <li key={p.page_id} className="py-2.5 flex items-center gap-3">
                  {p.picture ? <img src={p.picture} alt="" className="w-9 h-9 rounded-full" /> : <span className="w-9 h-9 rounded-full bg-slate-200" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      {p.last_error ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {p.last_error}
                        </>
                      ) : p.last_sync_at ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ดึงล่าสุด {new Date(p.last_sync_at).toLocaleString('th-TH')}
                        </>
                      ) : (
                        'รอดึงข้อมูลครั้งแรก'
                      )}
                    </div>
                  </div>
                  {canManage && (
                    <button type="button" onClick={() => disconnect(p)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer" aria-label={`ยกเลิกเพจ ${p.name}`}>
                      <Unplug className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {canManage && (
            <button
              type="button"
              onClick={connect}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-[13px] font-bold disabled:opacity-50 cursor-pointer"
            >
              {busy === 'connect' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              {status.pages.length ? 'เพิ่ม/อัปเดตเพจ' : 'เชื่อมต่อเพจ Facebook'}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
