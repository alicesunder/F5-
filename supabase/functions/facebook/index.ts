// เชื่อมเพจ Facebook ของหน่วย (เพจที่ผู้ใช้เป็นแอดมิน) แล้วดึงโพสต์เข้าเว็บ ฝอ 5
// POST ?action=config   {app_id, app_secret}  (ผู้ดูแลระบบ)  บันทึกรหัสแอป
// GET  ?action=status                          (บุคลากร)       สถานะการเชื่อมต่อและรายชื่อเพจ
// POST ?action=auth-url                        (ผู้ดูแลระบบ)  ลิงก์ไปหน้าอนุญาตของ Facebook
// GET  ?code=...&state=...                     (Facebook ส่งกลับ) เก็บ token ของเพจ แล้วพากลับเว็บ
// POST ?action=sync                            (ตัวตั้งเวลา หรือบุคลากร) ดึงโพสต์ล่าสุดของทุกเพจ
// POST ?action=disconnect {page_id}            (ผู้ดูแลระบบ)  ยกเลิกเพจ
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const GRAPH = 'https://graph.facebook.com/v23.0';
const SITE = 'https://administrationcenter.vercel.app';
const SELF = `${Deno.env.get('SUPABASE_URL')}/functions/v1/facebook`;
const SCOPES = 'pages_show_list,pages_read_engagement,pages_read_user_content,read_insights';

// ตัวเลขสถิติเพจรายวัน (ดึงทีละตัว ตัวไหน Facebook ไม่รองรับก็ข้ามได้ ไม่ทำให้ทั้งหมดล้ม)
const INSIGHT_METRICS = [
  'page_views_total', // การเข้าชมหน้าเพจ (ครั้ง)
  'page_total_media_view_unique', // คนที่เห็นเนื้อหาของเพจ (Reach)
  'page_media_view', // จำนวนครั้งที่เนื้อหาถูกดู
  'page_post_engagements', // การโต้ตอบกับโพสต์
  'page_daily_follows_unique', // ผู้ติดตามใหม่
  'page_daily_unfollows_unique', // เลิกติดตาม
];

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const back = (q: string) => Response.redirect(`${SITE}/relations?fb=${encodeURIComponent(q)}`, 302);

async function secret(key: string) {
  const { data } = await db.from('app_secrets').select('value').eq('key', key).maybeSingle();
  return data?.value as string | undefined;
}
async function setSecret(key: string, value: string) {
  await db.from('app_secrets').upsert({ key, value }, { onConflict: 'key' });
}

/** คืน {id, role} ของบุคลากรที่ยังใช้งานอยู่ หรือ null */
async function staffFrom(req: Request) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  if (!data?.user) return null;
  const { data: s } = await db.from('staff').select('role, active').eq('user_id', data.user.id).maybeSingle();
  return s?.active ? { id: data.user.id, role: s.role as string } : null;
}
const isAdmin = (s: { role: string } | null) => !!s && ['SUPER_ADMIN', 'ADMIN', 'RELATIONS'].includes(s.role);

async function graph(path: string, params: Record<string, string>) {
  const u = new URL(`${GRAPH}/${path}`);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const r = await fetch(u);
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error?.message || `graph ${r.status}`);
  return j;
}

async function syncAll() {
  const { data: pages } = await db.from('fb_pages').select('page_id, name, access_token, picture');
  const { data: kwRows } = await db.from('app_records').select('data').eq('collection', 'pr.keywords');
  const keywords = (kwRows ?? []).map(r => String((r.data as { keyword?: string })?.keyword || '')).filter(Boolean);
  const now = Date.now();
  const results: Record<string, string> = {};

  for (const p of pages ?? []) {
    try {
      const info = await graph(p.page_id, { fields: 'name,fan_count,followers_count,picture{url},category,verification_status', access_token: p.access_token });
      const feed = await graph(`${p.page_id}/posts`, {
        fields: 'id,message,created_time,permalink_url,full_picture,shares,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0)',
        limit: '50',
        access_token: p.access_token,
      });
      const avatar = info.picture?.data?.url || p.picture || '';
      const posts = (feed.data ?? []).map((x: Record<string, any>) => {
        const text = String(x.message || '');
        const matched = keywords.filter(k => text.includes(k));
        const likes = x.reactions?.summary?.total_count ?? 0;
        const comments = x.comments?.summary?.total_count ?? 0;
        const shares = x.shares?.count ?? 0;
        return {
          id: `fb_${x.id}`,
          pageId: `fb_${p.page_id}`,
          pageName: info.name || p.name,
          pageAvatar: avatar,
          isVerified: info.verification_status === 'blue_verified',
          timestamp: x.created_time,
          minutesAgo: Math.max(0, Math.round((now - Date.parse(x.created_time)) / 60000)),
          content: text,
          imageUrl: x.full_picture || undefined,
          keywords: matched,
          matchedKeywords: matched,
          category: 'ทั่วไป',
          sentiment: 'neutral',
          engagement: { likes, comments, shares },
          isImportant: matched.length > 0,
          bppRelated: /ตชด|ตำรวจตระเวนชายแดน/.test(text),
          sourceUrl: x.permalink_url || `https://www.facebook.com/${x.id}`,
        };
      });
      if (posts.length) {
        const { error } = await db
          .from('app_records')
          .upsert(posts.map((d: { id: string }) => ({ collection: 'pr.posts', id: d.id, data: d })), { onConflict: 'collection,id' });
        if (error) throw error;
      }
      const dayKey = new Date().toISOString().slice(0, 10);
      const today = posts.filter((x: { timestamp: string }) => x.timestamp.startsWith(dayKey));
      const eng = (x: { engagement: { likes: number; comments: number; shares: number } }) => x.engagement.likes + x.engagement.comments + x.engagement.shares;
      const page = {
        id: `fb_${p.page_id}`,
        name: info.name || p.name,
        handle: p.page_id,
        category: info.category || 'เพจ Facebook',
        avatar,
        followers: info.followers_count ?? info.fan_count ?? 0,
        postsToday: today.length,
        bppPostsToday: today.filter((x: { bppRelated: boolean }) => x.bppRelated).length,
        latestPostMinutesAgo: posts[0]?.minutesAgo ?? 0,
        engagement: today.reduce((a: number, x: any) => a + eng(x), 0),
        averageEngagement: posts.length ? Math.round(posts.reduce((a: number, x: any) => a + eng(x), 0) / posts.length) : 0,
        status: 'monitoring',
        verified: info.verification_status === 'blue_verified',
        history7Days: [],
        sentimentBreakdown: { positive: 0, neutral: posts.length, negative: 0 },
      };
      await db.from('app_records').upsert({ collection: 'pr.pages', id: page.id, data: page }, { onConflict: 'collection,id' });
      // สถิติเพจรายวัน 30 วัน
      const since = Math.floor(now / 1000) - 30 * 86400;
      const until = Math.floor(now / 1000) + 86400;
      const byDay: Record<string, Record<string, number>> = {};
      const missing: string[] = [];
      for (const m of INSIGHT_METRICS) {
        try {
          const r = await graph(`${p.page_id}/insights`, { metric: m, period: 'day', since: String(since), until: String(until), access_token: p.access_token });
          for (const v of r.data?.[0]?.values ?? []) {
            // end_time คือเที่ยงคืนของวันถัดไป (เวลา Pacific) ใช้วันก่อนหน้าเป็นวันของข้อมูล
            const day = new Date(Date.parse(v.end_time) - 86400000).toISOString().slice(0, 10);
            (byDay[day] ||= {})[m] = typeof v.value === 'number' ? v.value : 0;
          }
        } catch {
          missing.push(m);
        }
      }
      const insightRows = Object.entries(byDay).map(([day, metrics]) => ({
        collection: 'pr.fb_insights',
        id: `${p.page_id}:${day}`,
        data: { id: `${p.page_id}:${day}`, pageId: `fb_${p.page_id}`, day, metrics },
      }));
      if (insightRows.length) await db.from('app_records').upsert(insightRows, { onConflict: 'collection,id' });
      await db.from('fb_pages').update({ name: page.name, picture: avatar, last_sync_at: new Date().toISOString(), last_error: missing.length === INSIGHT_METRICS.length ? 'อ่านสถิติเพจไม่ได้: ต้องกดเชื่อมต่อเพจใหม่เพื่ออนุญาตสิทธิ์ read_insights' : null }).eq('page_id', p.page_id);
      results[p.page_id] = `ok ${posts.length} posts, ${insightRows.length} days`;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await db.from('fb_pages').update({ last_error: msg.slice(0, 500) }).eq('page_id', p.page_id);
      results[p.page_id] = `error: ${msg}`;
    }
  }
  return results;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    // Facebook ส่งผู้ใช้กลับมาหลังกดอนุญาต
    if (req.method === 'GET' && (url.searchParams.has('code') || url.searchParams.has('error'))) {
      if (url.searchParams.has('error')) return back('cancelled');
      const state = url.searchParams.get('state') || '';
      const who = await secret(`fb_state:${state}`);
      await db.from('app_secrets').delete().eq('key', `fb_state:${state}`);
      if (!who) return back('expired');
      const [uid, ts] = who.split('|');
      if (Date.now() - Number(ts) > 15 * 60_000) return back('expired');
      const appId = await secret('fb_app_id');
      const appSecret = await secret('fb_app_secret');
      if (!appId || !appSecret) return back('not-configured');

      const short = await graph('oauth/access_token', { client_id: appId, client_secret: appSecret, redirect_uri: SELF, code: url.searchParams.get('code')! });
      const long = await graph('oauth/access_token', { grant_type: 'fb_exchange_token', client_id: appId, client_secret: appSecret, fb_exchange_token: short.access_token });
      const accounts = await graph('me/accounts', { fields: 'id,name,access_token,picture{url}', limit: '100', access_token: long.access_token });
      const rows = (accounts.data ?? []).map((a: Record<string, any>) => ({
        page_id: a.id,
        name: a.name,
        access_token: a.access_token,
        picture: a.picture?.data?.url ?? null,
        connected_by: uid,
        connected_at: new Date().toISOString(),
      }));
      if (!rows.length) return back('no-pages');
      await db.from('fb_pages').upsert(rows, { onConflict: 'page_id' });
      await syncAll();
      return back(`connected-${rows.length}`);
    }

    if (action === 'sync' && req.method === 'POST') {
      const cron = req.headers.get('x-cron-secret');
      const ok = (cron && cron === (await secret('fb_cron_secret'))) || (await staffFrom(req));
      if (!ok) return json({ error: 'unauthorized' }, 401);
      return json({ ok: true, results: await syncAll() });
    }

    const me = await staffFrom(req);
    if (!me) return json({ error: 'ยังไม่ได้เข้าสู่ระบบ' }, 401);

    if (action === 'status') {
      const { data } = await db.from('fb_pages').select('page_id, name, picture, connected_at, last_sync_at, last_error').order('name');
      return json({ configured: !!(await secret('fb_app_id')) && !!(await secret('fb_app_secret')), redirectUri: SELF, pages: data ?? [] });
    }

    if (!isAdmin(me)) return json({ error: 'เฉพาะผู้ดูแลระบบหรืองานประชาสัมพันธ์' }, 403);

    if (action === 'config' && req.method === 'POST') {
      const b = await req.json();
      const appId = String(b.app_id || '').trim();
      const appSecret = String(b.app_secret || '').trim();
      if (!/^\d{5,25}$/.test(appId)) return json({ error: 'App ID ต้องเป็นตัวเลข' }, 400);
      if (!/^[a-f0-9]{32}$/i.test(appSecret)) return json({ error: 'App Secret ต้องเป็นตัวอักษร 32 ตัว (0-9, a-f)' }, 400);
      // ตรวจว่ารหัสถูกต้องจริงกับ Facebook ก่อนบันทึก
      try {
        await graph('oauth/access_token', { client_id: appId, client_secret: appSecret, grant_type: 'client_credentials' });
      } catch {
        return json({ error: 'Facebook ไม่ยอมรับ App ID / App Secret นี้' }, 400);
      }
      await setSecret('fb_app_id', appId);
      await setSecret('fb_app_secret', appSecret);
      return json({ ok: true });
    }

    if (action === 'auth-url' && req.method === 'POST') {
      const appId = await secret('fb_app_id');
      if (!appId) return json({ error: 'ยังไม่ได้ใส่รหัสแอป Facebook' }, 400);
      const state = crypto.randomUUID();
      await setSecret(`fb_state:${state}`, `${me.id}|${Date.now()}`);
      const u = new URL('https://www.facebook.com/v23.0/dialog/oauth');
      u.searchParams.set('client_id', appId);
      u.searchParams.set('redirect_uri', SELF);
      u.searchParams.set('state', state);
      u.searchParams.set('scope', SCOPES);
      return json({ url: u.toString() });
    }

    if (action === 'disconnect' && req.method === 'POST') {
      const b = await req.json();
      const id = String(b.page_id || '');
      await db.from('fb_pages').delete().eq('page_id', id);
      await db.from('app_records').delete().eq('collection', 'pr.pages').eq('id', `fb_${id}`);
      return json({ ok: true });
    }

    return json({ error: 'action' }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (req.method === 'GET' && url.searchParams.has('code')) return back('error');
    return json({ error: msg }, 500);
  }
});
