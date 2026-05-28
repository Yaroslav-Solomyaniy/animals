create table if not exists public.volunteer_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new',
  name text not null,
  phone text not null,
  email text,
  email_status text not null default 'not_configured',
  email_error text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint volunteer_requests_status_check check (
    status in ('new', 'contacted', 'approved', 'rejected', 'closed')
  ),
  constraint volunteer_requests_email_status_check check (
    email_status in ('sent', 'failed', 'not_configured')
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_volunteer_requests_updated_at on public.volunteer_requests;
create trigger set_volunteer_requests_updated_at
before update on public.volunteer_requests
for each row
execute function public.set_updated_at();

create index if not exists volunteer_requests_created_at_idx
on public.volunteer_requests(created_at desc);

alter table public.volunteer_requests enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.volunteer_requests to anon, authenticated;
grant select, update, delete on public.volunteer_requests to authenticated;

drop policy if exists "Anyone can create volunteer requests" on public.volunteer_requests;
create policy "Anyone can create volunteer requests"
on public.volunteer_requests
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can manage volunteer requests" on public.volunteer_requests;
create policy "Authenticated can manage volunteer requests"
on public.volunteer_requests
for all
to authenticated
using (true)
with check (true);
