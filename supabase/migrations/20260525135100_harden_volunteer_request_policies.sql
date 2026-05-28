create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "Anyone can create volunteer requests" on public.volunteer_requests;
drop policy if exists "Authenticated can manage volunteer requests" on public.volunteer_requests;
drop policy if exists "Authenticated can read volunteer requests" on public.volunteer_requests;
drop policy if exists "Authenticated can update volunteer requests" on public.volunteer_requests;
drop policy if exists "Authenticated can delete volunteer requests" on public.volunteer_requests;

create policy "Anyone can create volunteer requests"
on public.volunteer_requests
for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(name) between 2 and 200
  and char_length(phone) between 5 and 40
  and char_length(coalesce(email, '')) <= 320
  and char_length(coalesce(email_error, '')) <= 2000
  and email_status in ('sent', 'failed', 'not_configured')
  and admin_notes is null
);

create policy "Authenticated can read volunteer requests"
on public.volunteer_requests
for select
to authenticated
using ((select auth.uid()) is not null);

create policy "Authenticated can update volunteer requests"
on public.volunteer_requests
for update
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated can delete volunteer requests"
on public.volunteer_requests
for delete
to authenticated
using ((select auth.uid()) is not null);
