alter table public.animals
  add column if not exists adoption_status text;

alter table public.animals
  drop constraint if exists animals_adoption_status_check;

alter table public.animals
  add constraint animals_adoption_status_check
  check (
    adoption_status is null
    or adoption_status in ('ready', 'needs_care')
  );

update public.animals
set adoption_status = case
  when exists (
    select 1
    from unnest(public_badges) as badge
    where lower(badge) in (
      'готовий до адопції',
      'готова до адопції',
      'готовий до дому',
      'готова до дому'
    )
  ) then 'ready'
  when exists (
    select 1
    from unnest(public_badges) as badge
    where lower(badge) in (
      'потребує турботи',
      'потребують турботи'
    )
  ) then 'needs_care'
  else adoption_status
end
where adoption_status is null;
