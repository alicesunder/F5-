-- Only people listed in public.staff may read or triage reports. A stranger who signs up through the
-- public auth endpoint becomes "authenticated" but is not staff, so RLS still returns nothing.

create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;
revoke all on public.staff from anon, authenticated;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()));
$$;
revoke all on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated;

drop policy "authenticated can read groups" on public.line_groups;
drop policy "authenticated can read reports" on public.line_reports;
drop policy "authenticated can triage reports" on public.line_reports;
drop policy "authenticated can read line media" on storage.objects;

create policy "staff can read groups" on public.line_groups
  for select to authenticated using ((select private.is_staff()));
create policy "staff can read reports" on public.line_reports
  for select to authenticated using ((select private.is_staff()));
create policy "staff can triage reports" on public.line_reports
  for update to authenticated
  using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff can read line media" on storage.objects
  for select to authenticated using (bucket_id = 'line-media' and (select private.is_staff()));
