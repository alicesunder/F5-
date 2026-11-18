-- Collections named me.<user id>.<name> belong to one person (personal expenses, workload, schedule).
create or replace function private.can_use_collection(c text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_staff()
    and (c not like 'me.%' or c like 'me.' || (select auth.uid())::text || '.%');
$$;
revoke all on function private.can_use_collection(text) from public, anon;
grant execute on function private.can_use_collection(text) to authenticated;

drop policy "staff read records" on public.app_records;
drop policy "staff insert records" on public.app_records;
drop policy "staff update records" on public.app_records;
drop policy "staff delete records" on public.app_records;

create policy "staff read records" on public.app_records
  for select to authenticated using (private.can_use_collection(collection));
create policy "staff insert records" on public.app_records
  for insert to authenticated with check (private.can_use_collection(collection));
create policy "staff update records" on public.app_records
  for update to authenticated using (private.can_use_collection(collection)) with check (private.can_use_collection(collection));
create policy "staff delete records" on public.app_records
  for delete to authenticated using (private.can_use_collection(collection));
