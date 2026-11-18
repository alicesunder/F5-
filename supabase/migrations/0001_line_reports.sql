-- FO5: LINE reports. Inserts come only from the bot (service_role). The web (authenticated) can read
-- and change only status / note / dept / matched_keyword. anon has no access.

create table public.line_groups (
  group_id text primary key,
  name text,
  dept text check (dept in ('admin','relations','disaster','volunteer')),
  created_at timestamptz not null default now()
);

create table public.line_reports (
  id uuid primary key default gen_random_uuid(),
  line_message_id text not null unique,
  group_id text not null,
  group_name text,
  sender_user_id text,
  sender_name text not null default 'สมาชิก LINE',
  unit text,
  message_type text not null default 'text',
  text text not null default '',
  media_paths text[] not null default '{}',
  dept text not null default 'unassigned'
    check (dept in ('admin','relations','disaster','volunteer','unassigned')),
  matched_keyword text,
  status text not null default 'new'
    check (status in ('new','acknowledged','in_progress','done')),
  note text,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index line_reports_received_at_idx on public.line_reports (received_at desc);
create index line_reports_dept_idx on public.line_reports (dept);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger line_reports_touch_updated_at
before update on public.line_reports
for each row execute function public.touch_updated_at();

alter table public.line_groups enable row level security;
alter table public.line_reports enable row level security;

revoke all on public.line_groups from anon, authenticated;
revoke all on public.line_reports from anon, authenticated;
grant select on public.line_groups to authenticated;
grant select on public.line_reports to authenticated;
grant update (status, note, dept, matched_keyword) on public.line_reports to authenticated;

create policy "authenticated can read groups" on public.line_groups
  for select to authenticated using (true);
create policy "authenticated can read reports" on public.line_reports
  for select to authenticated using (true);
create policy "authenticated can triage reports" on public.line_reports
  for update to authenticated using (true) with check (true);

-- Private bucket for images the bot downloads from LINE
insert into storage.buckets (id, name, public) values ('line-media', 'line-media', false)
on conflict (id) do nothing;

create policy "authenticated can read line media" on storage.objects
  for select to authenticated using (bucket_id = 'line-media');

alter publication supabase_realtime add table public.line_reports;
