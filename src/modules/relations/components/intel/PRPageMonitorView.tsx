import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Eye, Users, MousePointerClick, UserPlus, Clock, TrendingUp, Image as ImageIcon, ExternalLink, Info } from 'lucide-react';
import { useCollection } from '../../../../lib/collections';
import { usePRIntel } from '../../context/PRIntelContext';
import { PostItem } from '../../types/bppTypes';

interface InsightDay {
  id: string;
  pageId: string;
  day: string;
  metrics: Record<string, number>;
}

// จัดหมวดเนื้อหาจากคำในโพสต์ (กติกาง่าย ๆ ไม่ใช้ AI) เพื่อดูว่าคนสนใจเรื่องไหน
const TOPICS: { label: string; words: string[] }[] = [
  { label: 'จิตอาสา/ช่วยเหลือประชาชน', words: ['จิตอาสา', 'ช่วยเหลือ', 'มอบ', 'บริจาค', 'ถุงยังชีพ'] },
  { label: 'ภัยพิบัติ', words: ['น้ำท่วม', 'อุทกภัย', 'ดินโคลน', 'ภัยพิบัติ', 'วาตภัย', 'ไฟป่า'] },
  { label: 'ยาเสพติด', words: ['ยาเสพติด', 'ยาบ้า', 'ไอซ์', 'กัญชา', 'สกัดกั้น'] },
  { label: 'ความมั่นคงชายแดน', words: ['ชายแดน', 'ลาดตระเวน', 'ตรวจค้น', 'จับกุม', 'แนวชายแดน'] },
  { label: 'การศึกษา/รร.ตชด.', words: ['โรงเรียน', 'นักเรียน', 'ครู', 'รร.ตชด', 'การศึกษา'] },
  { label: 'พิธี/กิจกรรมองค์กร', words: ['พิธี', 'ตรวจเยี่ยม', 'ประชุม', 'มอบนโยบาย', 'วันสำคัญ', 'เฉลิมพระเกียรติ'] },
];
const topicOf = (text: string) => TOPICS.find(t => t.words.some(w => text.includes(w)))?.label || 'อื่น ๆ';
const eng = (p: PostItem) => p.engagement.likes + p.engagement.comments + p.engagement.shares;
const fmt = (n: number) => n.toLocaleString('th-TH');

const Kpi: React.FC<{ icon: React.ElementType; label: string; value?: number; prev?: number; hint: string }> = ({ icon: Icon, label, value, prev, hint }) => {
  const diff = value !== undefined && prev ? Math.round(((value - prev) / prev) * 100) : null;
  return (
    <div className="rounded-2xl bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-white/10 p-4">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
        <Icon className="w-4 h-4 text-blue-600" /> {label}
      </div>
      <div className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">{value === undefined ? '—' : fmt(value)}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">
        {diff !== null && (
          <span className={diff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
            {diff >= 0 ? '▲' : '▼'} {Math.abs(diff)}%{' '}
          </span>
        )}
        {hint}
      </div>
    </div>
  );
};

/** มอนิเตอร์เพจของหน่วย: คนดูเพจ การเข้าถึง การโต้ตอบ ผู้ติดตาม เนื้อหาที่คนสนใจ และเวลาที่ควรโพสต์ */
export const PRPageMonitorView: React.FC = () => {
  const { posts, pages } = usePRIntel();
  const [insights] = useCollection<InsightDay>('pr.fb_insights');
  const fbPages = pages.filter(p => p.id.startsWith('fb_'));
  const [pageId, setPageId] = useState<string>('');
  const current = pageId || fbPages[0]?.id || '';

  const days = useMemo(
    () => insights.filter(d => d.pageId === current).sort((a, b) => a.day.localeCompare(b.day)),
    [insights, current]
  );
  const pagePosts = useMemo(() => posts.filter(p => p.pageId === current), [posts, current]);

  const last = days[days.length - 1];
  const prev = days[days.length - 2];
  const m = (d: InsightDay | undefined, k: string) => (d ? d.metrics[k] : undefined);

  const chart = days.slice(-14).map(d => ({
    day: new Date(`${d.day}T12:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
    เข้าชมเพจ: d.metrics.page_views_total ?? 0,
    คนที่เห็นเนื้อหา: d.metrics.page_total_media_view_unique ?? 0,
    การโต้ตอบ: d.metrics.page_post_engagements ?? 0,
  }));

  const byTopic = useMemo(() => {
    const g: Record<string, { n: number; total: number }> = {};
    for (const p of pagePosts) {
      const t = topicOf(p.content);
      g[t] = g[t] || { n: 0, total: 0 };
      g[t].n++;
      g[t].total += eng(p);
    }
    return Object.entries(g)
      .map(([label, v]) => ({ label, posts: v.n, avg: Math.round(v.total / v.n) }))
      .sort((a, b) => b.avg - a.avg);
  }, [pagePosts]);

  const byFormat = useMemo(() => {
    const withImg = pagePosts.filter(p => p.imageUrl);
    const noImg = pagePosts.filter(p => !p.imageUrl);
    const avg = (a: PostItem[]) => (a.length ? Math.round(a.reduce((s, p) => s + eng(p), 0) / a.length) : 0);
    return { img: avg(withImg), imgN: withImg.length, text: avg(noImg), textN: noImg.length };
  }, [pagePosts]);

  const bestHours = useMemo(() => {
    const g: Record<number, { n: number; total: number }> = {};
    for (const p of pagePosts) {
      const h = Number(new Date(p.timestamp).toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' }));
      g[h] = g[h] || { n: 0, total: 0 };
      g[h].n++;
      g[h].total += eng(p);
    }
    return Object.entries(g)
      .map(([h, v]) => ({ hour: Number(h), avg: Math.round(v.total / v.n), n: v.n }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);
  }, [pagePosts]);

  const topPosts = useMemo(() => [...pagePosts].sort((a, b) => eng(b) - eng(a)).slice(0, 5), [pagePosts]);
  const maxTopic = Math.max(1, ...byTopic.map(t => t.avg));

  if (!fbPages.length) {
    return (
      <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 dark:bg-white/5 p-6 text-center space-y-2">
        <Info className="w-6 h-6 text-blue-600 mx-auto" />
        <p className="font-bold text-slate-800 dark:text-slate-100">ยังไม่ได้เชื่อมต่อเพจ Facebook</p>
        <p className="text-sm text-slate-500">
          ไปที่เมนู "เพจ Facebook ของหน่วย" แล้วกดเชื่อมต่อเพจตำรวจตระเวนชายแดน ข้อมูลจะขึ้นที่หน้านี้อัตโนมัติ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[12rem]">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">มอนิเตอร์เพจ</h2>
          <p className="text-xs text-slate-500">
            ข้อมูลจาก Facebook อัปเดตทุก 15 นาที ตัวเลขรายวันของ Facebook ช้ากว่าจริงประมาณ 1 วัน
            {last && ` (ล่าสุด: ${new Date(`${last.day}T12:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })})`}
          </p>
        </div>
        {fbPages.length > 1 && (
          <select
            value={current}
            onChange={e => setPageId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-[#151A22] dark:border-white/10 text-sm font-semibold"
            aria-label="เลือกเพจ"
          >
            {fbPages.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={Eye} label="การเข้าชมหน้าเพจ" value={m(last, 'page_views_total')} prev={m(prev, 'page_views_total')} hint="ครั้ง เทียบวันก่อน" />
        <Kpi icon={Users} label="คนที่เห็นเนื้อหา" value={m(last, 'page_total_media_view_unique')} prev={m(prev, 'page_total_media_view_unique')} hint="คน (Reach)" />
        <Kpi icon={MousePointerClick} label="การโต้ตอบ" value={m(last, 'page_post_engagements')} prev={m(prev, 'page_post_engagements')} hint="ถูกใจ คอมเมนต์ แชร์ คลิก" />
        <Kpi
          icon={UserPlus}
          label="ผู้ติดตามใหม่"
          value={m(last, 'page_daily_follows_unique')}
          hint={`เลิกติดตาม ${m(last, 'page_daily_unfollows_unique') ?? '—'} · ทั้งหมด ${fmt(fbPages.find(p => p.id === current)?.followers ?? 0)}`}
        />
      </div>

      <section className="rounded-2xl bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-white/10 p-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">แนวโน้ม 14 วัน</h3>
        {chart.length ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="คนที่เห็นเนื้อหา" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} />
                <Area type="monotone" dataKey="เข้าชมเพจ" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.12} />
                <Area type="monotone" dataKey="การโต้ตอบ" stroke="#F97316" fill="#F97316" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-500">ยังไม่มีสถิติรายวัน (ต้องอนุญาตสิทธิ์อ่านสถิติเพจตอนเชื่อมต่อ)</p>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-white/10 p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" /> คนสนใจเนื้อหาเรื่องไหน
          </h3>
          <p className="text-[11px] text-slate-500">เฉลี่ยการโต้ตอบต่อโพสต์ แยกตามหัวข้อ (จาก {pagePosts.length} โพสต์ล่าสุด)</p>
          {byTopic.length ? (
            <ul className="space-y-2">
              {byTopic.map(t => (
                <li key={t.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{t.label}</span>
                    <span className="text-slate-500">{fmt(t.avg)} / โพสต์ · {t.posts} โพสต์</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${(t.avg / maxTopic) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">ยังไม่มีโพสต์</p>
          )}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            โพสต์มีรูป เฉลี่ย {fmt(byFormat.img)} ({byFormat.imgN} โพสต์) · ข้อความล้วน เฉลี่ย {fmt(byFormat.text)} ({byFormat.textN} โพสต์)
          </div>
        </section>

        <section className="rounded-2xl bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-white/10 p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" /> ช่วงเวลาที่โพสต์แล้วได้ผลดี
          </h3>
          {bestHours.length ? (
            <ol className="space-y-2">
              {bestHours.map((h, i) => (
                <li key={h.hour} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {String(h.hour).padStart(2, '0')}.00–{String((h.hour + 1) % 24).padStart(2, '0')}.00 น.
                  </span>
                  <span className="text-xs text-slate-500">เฉลี่ย {fmt(h.avg)} · {h.n} โพสต์</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-500">ยังไม่มีโพสต์พอให้วิเคราะห์</p>
          )}
          <p className="text-[11px] text-slate-400">คำนวณจากเวลาโพสต์จริงกับยอดโต้ตอบ ยิ่งมีโพสต์มากยิ่งแม่นขึ้น</p>
        </section>
      </div>

      <section className="rounded-2xl bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-white/10 p-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">โพสต์ที่ได้รับความสนใจสูงสุด</h3>
        {topPosts.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {topPosts.map(p => (
              <li key={p.id} className="py-2.5 flex items-start gap-3">
                {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" /> : <div className="w-14 h-14 rounded-lg bg-slate-100 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-100 line-clamp-2">{p.content || '(ไม่มีข้อความ)'}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {new Date(p.timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} · ถูกใจ {fmt(p.engagement.likes)} · คอมเมนต์ {fmt(p.engagement.comments)} · แชร์ {fmt(p.engagement.shares)}
                  </p>
                </div>
                <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-blue-600" aria-label="เปิดโพสต์บน Facebook">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">ยังไม่มีโพสต์</p>
        )}
      </section>
    </div>
  );
};
