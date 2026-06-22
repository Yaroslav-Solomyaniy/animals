-- Extended animal fields migration
-- Adds: animal_number, color, vaccination_count, character_traits

-- Unique animal number (e.g. '0932187')
alter table public.animals
  add column if not exists animal_number text;

alter table public.animals
  drop constraint if exists animals_animal_number_key;

alter table public.animals
  add constraint animals_animal_number_key unique (animal_number);

-- Color from predefined list
alter table public.animals
  add column if not exists color text;

-- Vaccination count (0 = not vaccinated, >0 = vaccinated with this many shots)
alter table public.animals
  add column if not exists vaccination_count smallint not null default 0;

alter table public.animals
  drop constraint if exists animals_vaccination_count_check;

alter table public.animals
  add constraint animals_vaccination_count_check
  check (vaccination_count >= 0 and vaccination_count <= 20);

-- Backfill vaccination_count from is_vaccinated
update public.animals
set vaccination_count = case when is_vaccinated = true then 1 else 0 end
where vaccination_count = 0 and is_vaccinated is not null;

-- Character traits (predefined, max 5)
alter table public.animals
  add column if not exists character_traits text[] not null default '{}';
