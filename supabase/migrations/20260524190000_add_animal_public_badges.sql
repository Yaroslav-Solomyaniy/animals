alter table public.animals
  add column if not exists public_badges text[] not null default '{}';
