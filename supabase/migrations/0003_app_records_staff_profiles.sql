-- Generic persistent store for every module (budgets, documents, missions, ...). Each row is one item of a
-- collection, stored as jsonb in the shape the web app already uses. Staff only.
create table public.app_records (
  collection text not null check (collection ~ '^[a-z0-9_.-]{1,64}$'),
  id text not null check (length(id) between 1 and 200),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid(),
  primary key (collection, id)
);
create index app_records_collection_updated on public.app_records (collection, updated_at desc);
create trigger app_records_touch before update on public.app_records
  for each row execute function public.touch_updated_at();

alter table public.app_records enable row level security;
revoke all on public.app_records from anon, authenticated;
grant select, insert, update, delete on public.app_records to authenticated;

create policy "staff read records" on public.app_records
  for select to authenticated using ((select private.is_staff()));
create policy "staff insert records" on public.app_records
  for insert to authenticated with check ((select private.is_staff()));
create policy "staff update records" on public.app_records
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete records" on public.app_records
  for delete to authenticated using ((select private.is_staff()));

alter publication supabase_realtime add table public.app_records;

-- Staff profiles (shown in the header/profile). Rows are written only by the staff-admin edge function.
alter table public.staff
  add column email text,
  add column name text,
  add column rank text not null default '',
  add column position text not null default '',
  add column department text not null default '',
  add column phone text not null default '',
  add column role text not null default 'VIEWER'
    check (role in ('SUPER_ADMIN','ADMIN','ADMIN_DEPARTMENT','RELATIONS','DISASTER','VOLUNTEER','VIEWER')),
  add column active boolean not null default true;

grant select on public.staff to authenticated;
create policy "staff read staff" on public.staff
  for select to authenticated using ((select private.is_staff()));

-- Deactivated staff lose access immediately.
create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()) and active);
$$;

update public.staff s set
  email = u.email,
  name = 'ชัยโรจน์ สหัสภูริพัฒน์',
  rank = 'ส.ต.อ.',
  position = 'ผบ.หมู่-รอง สว. กก.ตชด.31 ปฏิบัติหน้าที่งานประชาสัมพันธ์ ฝอ.๕ บช.ตชด.',
  department = 'ฝ่ายอำนวยการ ๕ บช.ตชด. (งานประชาสัมพันธ์)',
  phone = '02-282-8111',
  role = 'SUPER_ADMIN'
from auth.users u
where u.id = s.user_id and u.email = 'chairot.s@royalthaipolice.go.th';

-- Staff may name LINE groups and map them to a department.
grant update (name, dept) on public.line_groups to authenticated;
create policy "staff map groups" on public.line_groups
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));

-- Server-only settings (read by edge functions with the service role; nobody else).
create table public.app_secrets (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now()
);
alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;
