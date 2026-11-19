-- เพจ Facebook ที่เชื่อมต่อแล้ว (token เก็บฝั่งเซิร์ฟเวอร์เท่านั้น ไม่มีสิทธิ์อ่านจากเว็บ)
create table public.fb_pages (
  page_id text primary key,
  name text,
  access_token text not null,
  picture text,
  connected_by uuid references auth.users (id) on delete set null,
  connected_at timestamptz not null default now(),
  last_sync_at timestamptz,
  last_error text
);
alter table public.fb_pages enable row level security;
revoke all on public.fb_pages from anon, authenticated;

-- ดึงโพสต์อัตโนมัติทุก 15 นาที
create extension if not exists pg_cron;
create extension if not exists pg_net;

insert into public.app_secrets (key, value)
values ('fb_cron_secret', encode(extensions.gen_random_bytes(24), 'hex'))
on conflict (key) do nothing;

select cron.schedule(
  'facebook-sync',
  '*/15 * * * *',
  $job$
  select net.http_post(
    url := 'https://ufjovnlbotptbvjchtmt.supabase.co/functions/v1/facebook?action=sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select value from public.app_secrets where key = 'fb_cron_secret')
    ),
    body := '{}'::jsonb
  )
  where exists (select 1 from public.fb_pages);
  $job$
);
