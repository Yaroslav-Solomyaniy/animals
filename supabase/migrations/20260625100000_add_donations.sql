-- ─────────────────────────────────────────────
-- site_settings  (singleton, id = 1)
-- ─────────────────────────────────────────────
create table if not exists public.site_settings (
  id                   integer primary key default 1,
  donations_enabled    boolean  not null default false,
  donation_description text,
  donation_amounts     integer[] not null default '{100,200,500,1000}',

  constraint site_settings_singleton check (id = 1)
);

-- Seed the singleton row so it always exists
insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- RLS: anyone can read; only authenticated admin users can update
alter table public.site_settings enable row level security;

create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_update"
  on public.site_settings for update
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- donations
-- ─────────────────────────────────────────────
create table if not exists public.donations (
  id             uuid        primary key default gen_random_uuid(),
  invoice_id     text        unique not null,
  amount         integer     not null,          -- UAH
  animal_id      uuid        references public.animals (id) on delete set null,
  donor_name     text,
  donor_comment  text,
  status         text        not null default 'created',  -- created|processing|success|failure|reversed
  page_url       text,
  created_at     timestamptz not null default now(),
  paid_at        timestamptz,

  constraint donations_status_check check (
    status in ('created', 'processing', 'success', 'failure', 'reversed')
  ),
  constraint donations_amount_positive check (amount > 0)
);

-- Index for webhook lookups by invoice_id
create index if not exists donations_invoice_id_idx on public.donations (invoice_id);
-- Index for admin list sorted by created_at
create index if not exists donations_created_at_idx on public.donations (created_at desc);

-- RLS: public can insert (server action uses service role anyway); authenticated can read
alter table public.donations enable row level security;

create policy "donations_admin_all"
  on public.donations for all
  using (auth.role() = 'authenticated');

-- Allow service-role inserts from server actions (anon is blocked; service role bypasses RLS)
