-- โครงสร้าง ฝอ.5: รายชื่ออยู่ใน app_records collection 'org.staff', รูปอยู่ใน bucket private 'staff-photos'
-- บุคลากรทุกคนดูได้ แต่แก้ไขได้เฉพาะผู้ดูแล (SUPER_ADMIN / ADMIN / ADMIN_DEPARTMENT)

create or replace function private.is_org_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff
    where user_id = (select auth.uid()) and active and role in ('SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT')
  );
$$;
revoke all on function private.is_org_editor() from public, anon;
grant execute on function private.is_org_editor() to authenticated;

create or replace function private.can_write_collection(c text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.can_use_collection(c) and (c <> 'org.staff' or private.is_org_editor());
$$;
revoke all on function private.can_write_collection(text) from public, anon;
grant execute on function private.can_write_collection(text) to authenticated;

drop policy "staff insert records" on public.app_records;
drop policy "staff update records" on public.app_records;
drop policy "staff delete records" on public.app_records;

create policy "staff insert records" on public.app_records
  for insert to authenticated with check (private.can_write_collection(collection));
create policy "staff update records" on public.app_records
  for update to authenticated using (private.can_write_collection(collection)) with check (private.can_write_collection(collection));
create policy "staff delete records" on public.app_records
  for delete to authenticated using (private.can_write_collection(collection));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('staff-photos', 'staff-photos', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "staff read staff photos" on storage.objects
  for select to authenticated using (bucket_id = 'staff-photos' and (select private.is_staff()));
create policy "editors upload staff photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'staff-photos' and (select private.is_org_editor()));
create policy "editors update staff photos" on storage.objects
  for update to authenticated using (bucket_id = 'staff-photos' and (select private.is_org_editor()))
  with check (bucket_id = 'staff-photos' and (select private.is_org_editor()));
create policy "editors delete staff photos" on storage.objects
  for delete to authenticated using (bucket_id = 'staff-photos' and (select private.is_org_editor()));
