# Supabase schema

Документ описывает таблицы, которые создаем в схеме `public` Supabase.

Правило простое: одна сущность приложения = одна таблица Supabase. Детали, которые могут повторяться или иметь много записей, выносим в отдельные таблицы. Например, животное хранится в `animals`, его фотографии в `animal_photos`, новость в `news_posts`, медиа новости в `news_media`, отчеты в `reports`.

Supabase Auth не создаем вручную. Пользователи и сессии живут в служебной схеме `auth`, а наши данные живут в `public`.

## Минимальный набор для текущего кода

Базовая схема для админки:

1. `public.animals`
2. `public.animal_photos`
3. `public.news_posts`
4. `public.news_media`
5. `public.reports`

Этого достаточно, чтобы работали текущие страницы админки:

- `/admin/animals`
- `/admin/news`
- `/admin/reports`

## Таблица `animals`

Хранит карточки животных: имя, тип, пол, размер, статус, описание, историю, даты и флаги публикации.

| Поле | Тип | Зачем нужно |
| --- | --- | --- |
| `id` | `uuid` | Уникальный ID животного |
| `slug` | `text` | Человекочитаемый URL, например `baks` |
| `name` | `text` | Имя животного |
| `gender` | `text` | Пол: `male` или `female` |
| `size` | `text` | Размер: `small`, `medium`, `large` |
| `status` | `text` | Состояние записи: `draft`, `available`, `reserved`, `adopted`, `hidden` |
| `short_description` | `text` | Короткое описание для карточек |
| `full_story` | `text` | Полная история для страницы животного |
| `birth_date` | `date` | Дата рождения, если известна |
| `approximate_age_label` | `text` | Возраст текстом, например `2 роки` |
| `shelter_arrival_date` | `date` | Дата прибытия в приют |
| `is_vaccinated` | `boolean` | Вакцинировано |
| `is_neutered` | `boolean` | Стерилизовано/кастрировано |
| `is_featured` | `boolean` | Показывать на главной или в избранном |
| `published_at` | `timestamptz` | Дата публикации |
| `created_at` | `timestamptz` | Дата создания |
| `updated_at` | `timestamptz` | Дата последнего обновления |

SQL:

```sql
create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  gender text not null default 'male',
  size text not null default 'medium',
  status text not null default 'draft',
  short_description text,
  full_story text,
  birth_date date,
  approximate_age_label text,
  shelter_arrival_date date,
  is_vaccinated boolean not null default false,
  is_neutered boolean not null default false,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint animals_gender_check check (gender in ('male', 'female')),
  constraint animals_size_check check (size in ('small', 'medium', 'large')),
  constraint animals_status_check check (status in ('draft', 'available', 'reserved', 'adopted', 'hidden'))
);
```

## Таблица `animal_photos`

Хранит фотографии животного. У одного животного может быть несколько фото, а в админке можно выбрать главное фото через `is_main = true`.

Файл не храним в Supabase. В таблице лежит только публичный URL или ключ файла в Cloudflare R2.

| Поле | Тип | Зачем нужно |
| --- | --- | --- |
| `id` | `uuid` | Уникальный ID фото |
| `animal_id` | `uuid` | К какому животному относится фото |
| `r2_key` | `text` | Ключ файла в Cloudflare R2 |
| `public_url` | `text` | Публичный URL фото |
| `alt` | `text` | Alt-текст для доступности |
| `sort_order` | `integer` | Порядок фото в галерее |
| `is_main` | `boolean` | Главное фото животного |
| `created_at` | `timestamptz` | Дата создания |
| `updated_at` | `timestamptz` | Дата последнего обновления |

SQL:

```sql
create table if not exists public.animal_photos (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals(id) on delete cascade,
  r2_key text,
  public_url text,
  alt text,
  sort_order integer not null default 0,
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint animal_photos_has_source_check check (
    r2_key is not null
    or public_url is not null
  )
);
```

Чтобы у одного животного было только одно главное фото:

```sql
create unique index if not exists animal_photos_one_main_per_animal_idx
on public.animal_photos(animal_id)
where is_main = true;
```

## Таблица `news_posts`

Хранит новости и статьи. В самой таблице лежит основная информация и заглавное фото новости.

Дополнительные фото и видео лучше хранить отдельно в `news_media`. А поле `content_blocks` оставляем для конструктора страницы: текстовые блоки, порядок секций, кнопки, таблицы и ссылки на медиа.

| Поле | Тип | Зачем нужно |
| --- | --- | --- |
| `id` | `uuid` | Уникальный ID новости |
| `slug` | `text` | URL новости |
| `title` | `text` | Заголовок |
| `excerpt` | `text` | Короткое описание |
| `content_blocks` | `jsonb` | Блоки контента новости |
| `cover_url` | `text` | Публичный URL заглавного фото |
| `cover_r2_key` | `text` | Ключ заглавного фото в Cloudflare R2 |
| `related_animal_id` | `uuid` | Связанное животное, если новость про него |
| `is_published` | `boolean` | Опубликована ли новость |
| `published_at` | `timestamptz` | Дата публикации |
| `created_at` | `timestamptz` | Дата создания |
| `updated_at` | `timestamptz` | Дата последнего обновления |

SQL:

```sql
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_blocks jsonb not null default '[]'::jsonb,
  cover_url text,
  cover_r2_key text,
  related_animal_id uuid references public.animals(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Пример `content_blocks`:

```json
[
  {
    "type": "paragraph",
    "width": "narrow",
    "text": "Текст абзаца..."
  },
  {
    "type": "image",
    "width": "medium",
    "height": "medium",
    "src": "https://example.com/photo.webp",
    "alt": "Описание фото",
    "caption": "Подпись"
  },
  {
    "type": "buttons",
    "width": "medium",
    "buttons": [
      {
        "label": "Підтримати",
        "href": "/help-for-us",
        "variant": "primary"
      }
    ]
  }
]
```

## Таблица `news_media`

Хранит дополнительные фото и видео для новости. У одной новости может быть два, три, пять или больше медиа-файлов.

Заглавное фото новости остается в `news_posts.cover_url` / `news_posts.cover_r2_key`, потому что это часть самой карточки новости. Все остальные фото и видео идут сюда.

| Поле | Тип | Зачем нужно |
| --- | --- | --- |
| `id` | `uuid` | Уникальный ID медиа |
| `news_post_id` | `uuid` | К какой новости относится медиа |
| `media_type` | `text` | Тип: `image` или `video` |
| `r2_key` | `text` | Ключ файла в Cloudflare R2 |
| `public_url` | `text` | Публичный URL фото или видео |
| `embed_url` | `text` | Ссылка на внешнее видео, например YouTube |
| `alt` | `text` | Alt-текст для фото |
| `caption` | `text` | Подпись |
| `sort_order` | `integer` | Порядок внутри новости |
| `created_at` | `timestamptz` | Дата создания |
| `updated_at` | `timestamptz` | Дата последнего обновления |

SQL:

```sql
create table if not exists public.news_media (
  id uuid primary key default gen_random_uuid(),
  news_post_id uuid not null references public.news_posts(id) on delete cascade,
  media_type text not null,
  r2_key text,
  public_url text,
  embed_url text,
  alt text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint news_media_type_check check (media_type in ('image', 'video')),
  constraint news_media_has_source_check check (
    r2_key is not null
    or public_url is not null
    or embed_url is not null
  )
);
```

## Таблица `reports`

Хранит отчеты: название, месяц, год, описание и ссылку на файл.

| Поле | Тип | Зачем нужно |
| --- | --- | --- |
| `id` | `uuid` | Уникальный ID отчета |
| `title` | `text` | Название отчета |
| `month` | `text` | Месяц текстом |
| `year` | `text` | Год |
| `summary` | `text` | Короткое описание |
| `file_url` | `text` | Публичный URL файла |
| `file_r2_key` | `text` | Ключ файла в Cloudflare R2, если используем R2 |
| `is_published` | `boolean` | Опубликован ли отчет |
| `published_at` | `timestamptz` | Дата публикации |
| `created_at` | `timestamptz` | Дата создания |
| `updated_at` | `timestamptz` | Дата последнего обновления |

SQL:

```sql
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  month text,
  year text,
  summary text,
  file_url text,
  file_r2_key text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## View `animal_cards`

Это не отдельная таблица, а готовое представление для публичного каталога животных.

Зачем оно нужно: чтобы на фронте не делать отдельный запрос за главным фото. Каталог может читать одну сущность:

```ts
const { data } = await supabase
  .from('animal_cards')
  .select('*')
  .order('published_at', { ascending: false })
```

View берет данные из `animals` и подмешивает главное фото из `animal_photos`, где `is_main = true`.

SQL:

```sql
create or replace view public.animal_cards
with (security_invoker = on) as
select
  animals.id,
  animals.slug,
  animals.name,
  animals.gender,
  animals.size,
  animals.status,
  animals.short_description,
  animals.birth_date,
  animals.approximate_age_label,
  animals.shelter_arrival_date,
  animals.is_vaccinated,
  animals.is_neutered,
  animals.is_featured,
  animals.published_at,
  main_photo.id as main_photo_id,
  main_photo.public_url as main_photo_url,
  main_photo.r2_key as main_photo_r2_key,
  main_photo.alt as main_photo_alt
from public.animals
left join public.animal_photos as main_photo
  on main_photo.animal_id = animals.id
  and main_photo.is_main = true
where
  animals.status in ('available', 'reserved', 'adopted')
  and animals.published_at is not null;
```

Использование:

- публичный каталог: читать `animal_cards`;
- публичная детальная страница животного: читать `animals` + `animal_photos`;
- админка: работать с `animals` и `animal_photos` напрямую, потому что там нужно редактировать все фото и выбирать главное.

## Обновление `updated_at`

Чтобы `updated_at` обновлялся автоматически при изменении строки, создаем одну функцию и три триггера.

SQL:

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_animals_updated_at on public.animals;
create trigger set_animals_updated_at
before update on public.animals
for each row
execute function public.set_updated_at();

drop trigger if exists set_animal_photos_updated_at on public.animal_photos;
create trigger set_animal_photos_updated_at
before update on public.animal_photos
for each row
execute function public.set_updated_at();

drop trigger if exists set_news_posts_updated_at on public.news_posts;
create trigger set_news_posts_updated_at
before update on public.news_posts
for each row
execute function public.set_updated_at();

drop trigger if exists set_news_media_updated_at on public.news_media;
create trigger set_news_media_updated_at
before update on public.news_media
for each row
execute function public.set_updated_at();

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at
before update on public.reports
for each row
execute function public.set_updated_at();
```

## Индексы

Индексы нужны для быстрых списков, фильтров и сортировки.

SQL:

```sql
create index if not exists animals_status_idx on public.animals(status);
create index if not exists animals_published_at_idx on public.animals(published_at desc);
create index if not exists animals_updated_at_idx on public.animals(updated_at desc);

create index if not exists animal_photos_animal_id_idx on public.animal_photos(animal_id);
create index if not exists animal_photos_sort_order_idx on public.animal_photos(animal_id, sort_order);
create unique index if not exists animal_photos_one_main_per_animal_idx
on public.animal_photos(animal_id)
where is_main = true;

create index if not exists news_posts_is_published_idx on public.news_posts(is_published);
create index if not exists news_posts_published_at_idx on public.news_posts(published_at desc);
create index if not exists news_posts_related_animal_id_idx on public.news_posts(related_animal_id);

create index if not exists news_media_news_post_id_idx on public.news_media(news_post_id);
create index if not exists news_media_sort_order_idx on public.news_media(news_post_id, sort_order);

create index if not exists reports_is_published_idx on public.reports(is_published);
create index if not exists reports_year_idx on public.reports(year desc);
create index if not exists reports_published_at_idx on public.reports(published_at desc);
```

## RLS и доступы

Включаем Row Level Security. Публичный сайт может читать только опубликованные данные. Авторизованный пользователь может читать, создавать, редактировать и удалять записи в админке.

Это простой стартовый вариант. Позже можно ужесточить доступ через таблицу `admin_profiles`, чтобы не любой авторизованный пользователь был админом.

SQL:

```sql
alter table public.animals enable row level security;
alter table public.animal_photos enable row level security;
alter table public.news_posts enable row level security;
alter table public.news_media enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Public can read published animals" on public.animals;
create policy "Public can read published animals"
on public.animals
for select
to anon
using (
  status in ('available', 'reserved', 'adopted')
  and published_at is not null
);

drop policy if exists "Authenticated can manage animals" on public.animals;
create policy "Authenticated can manage animals"
on public.animals
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published animal photos" on public.animal_photos;
create policy "Public can read published animal photos"
on public.animal_photos
for select
to anon
using (
  exists (
    select 1
    from public.animals
    where animals.id = animal_photos.animal_id
      and animals.status in ('available', 'reserved', 'adopted')
      and animals.published_at is not null
  )
);

drop policy if exists "Authenticated can manage animal photos" on public.animal_photos;
create policy "Authenticated can manage animal photos"
on public.animal_photos
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news"
on public.news_posts
for select
to anon
using (
  is_published = true
  and published_at is not null
);

drop policy if exists "Authenticated can manage news" on public.news_posts;
create policy "Authenticated can manage news"
on public.news_posts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published news media" on public.news_media;
create policy "Public can read published news media"
on public.news_media
for select
to anon
using (
  exists (
    select 1
    from public.news_posts
    where news_posts.id = news_media.news_post_id
      and news_posts.is_published = true
      and news_posts.published_at is not null
  )
);

drop policy if exists "Authenticated can manage news media" on public.news_media;
create policy "Authenticated can manage news media"
on public.news_media
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published reports" on public.reports;
create policy "Public can read published reports"
on public.reports
for select
to anon
using (
  is_published = true
  and published_at is not null
);

drop policy if exists "Authenticated can manage reports" on public.reports;
create policy "Authenticated can manage reports"
on public.reports
for all
to authenticated
using (true)
with check (true);
```

## Полный SQL для первого запуска

Этот блок можно вставить в Supabase SQL Editor одним куском.

```sql
create extension if not exists pgcrypto;

create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  gender text not null default 'male',
  size text not null default 'medium',
  status text not null default 'draft',
  short_description text,
  full_story text,
  birth_date date,
  approximate_age_label text,
  shelter_arrival_date date,
  is_vaccinated boolean not null default false,
  is_neutered boolean not null default false,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint animals_gender_check check (gender in ('male', 'female')),
  constraint animals_size_check check (size in ('small', 'medium', 'large')),
  constraint animals_status_check check (status in ('draft', 'available', 'reserved', 'adopted', 'hidden'))
);

create table if not exists public.animal_photos (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals(id) on delete cascade,
  r2_key text,
  public_url text,
  alt text,
  sort_order integer not null default 0,
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint animal_photos_has_source_check check (
    r2_key is not null
    or public_url is not null
  )
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_blocks jsonb not null default '[]'::jsonb,
  cover_url text,
  cover_r2_key text,
  related_animal_id uuid references public.animals(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_media (
  id uuid primary key default gen_random_uuid(),
  news_post_id uuid not null references public.news_posts(id) on delete cascade,
  media_type text not null,
  r2_key text,
  public_url text,
  embed_url text,
  alt text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint news_media_type_check check (media_type in ('image', 'video')),
  constraint news_media_has_source_check check (
    r2_key is not null
    or public_url is not null
    or embed_url is not null
  )
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  month text,
  year text,
  summary text,
  file_url text,
  file_r2_key text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view public.animal_cards
with (security_invoker = on) as
select
  animals.id,
  animals.slug,
  animals.name,
  animals.gender,
  animals.size,
  animals.status,
  animals.short_description,
  animals.birth_date,
  animals.approximate_age_label,
  animals.shelter_arrival_date,
  animals.is_vaccinated,
  animals.is_neutered,
  animals.is_featured,
  animals.published_at,
  main_photo.id as main_photo_id,
  main_photo.public_url as main_photo_url,
  main_photo.r2_key as main_photo_r2_key,
  main_photo.alt as main_photo_alt
from public.animals
left join public.animal_photos as main_photo
  on main_photo.animal_id = animals.id
  and main_photo.is_main = true
where
  animals.status in ('available', 'reserved', 'adopted')
  and animals.published_at is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_animals_updated_at on public.animals;
create trigger set_animals_updated_at
before update on public.animals
for each row
execute function public.set_updated_at();

drop trigger if exists set_animal_photos_updated_at on public.animal_photos;
create trigger set_animal_photos_updated_at
before update on public.animal_photos
for each row
execute function public.set_updated_at();

drop trigger if exists set_news_posts_updated_at on public.news_posts;
create trigger set_news_posts_updated_at
before update on public.news_posts
for each row
execute function public.set_updated_at();

drop trigger if exists set_news_media_updated_at on public.news_media;
create trigger set_news_media_updated_at
before update on public.news_media
for each row
execute function public.set_updated_at();

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at
before update on public.reports
for each row
execute function public.set_updated_at();

create index if not exists animals_status_idx on public.animals(status);
create index if not exists animals_published_at_idx on public.animals(published_at desc);
create index if not exists animals_updated_at_idx on public.animals(updated_at desc);

create index if not exists animal_photos_animal_id_idx on public.animal_photos(animal_id);
create index if not exists animal_photos_sort_order_idx on public.animal_photos(animal_id, sort_order);
create unique index if not exists animal_photos_one_main_per_animal_idx
on public.animal_photos(animal_id)
where is_main = true;

create index if not exists news_posts_is_published_idx on public.news_posts(is_published);
create index if not exists news_posts_published_at_idx on public.news_posts(published_at desc);
create index if not exists news_posts_related_animal_id_idx on public.news_posts(related_animal_id);

create index if not exists news_media_news_post_id_idx on public.news_media(news_post_id);
create index if not exists news_media_sort_order_idx on public.news_media(news_post_id, sort_order);

create index if not exists reports_is_published_idx on public.reports(is_published);
create index if not exists reports_year_idx on public.reports(year desc);
create index if not exists reports_published_at_idx on public.reports(published_at desc);

alter table public.animals enable row level security;
alter table public.animal_photos enable row level security;
alter table public.news_posts enable row level security;
alter table public.news_media enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Public can read published animals" on public.animals;
create policy "Public can read published animals"
on public.animals
for select
to anon
using (
  status in ('available', 'reserved', 'adopted')
  and published_at is not null
);

drop policy if exists "Authenticated can manage animals" on public.animals;
create policy "Authenticated can manage animals"
on public.animals
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published animal photos" on public.animal_photos;
create policy "Public can read published animal photos"
on public.animal_photos
for select
to anon
using (
  exists (
    select 1
    from public.animals
    where animals.id = animal_photos.animal_id
      and animals.status in ('available', 'reserved', 'adopted')
      and animals.published_at is not null
  )
);

drop policy if exists "Authenticated can manage animal photos" on public.animal_photos;
create policy "Authenticated can manage animal photos"
on public.animal_photos
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news"
on public.news_posts
for select
to anon
using (
  is_published = true
  and published_at is not null
);

drop policy if exists "Authenticated can manage news" on public.news_posts;
create policy "Authenticated can manage news"
on public.news_posts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published news media" on public.news_media;
create policy "Public can read published news media"
on public.news_media
for select
to anon
using (
  exists (
    select 1
    from public.news_posts
    where news_posts.id = news_media.news_post_id
      and news_posts.is_published = true
      and news_posts.published_at is not null
  )
);

drop policy if exists "Authenticated can manage news media" on public.news_media;
create policy "Authenticated can manage news media"
on public.news_media
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published reports" on public.reports;
create policy "Public can read published reports"
on public.reports
for select
to anon
using (
  is_published = true
  and published_at is not null
);

drop policy if exists "Authenticated can manage reports" on public.reports;
create policy "Authenticated can manage reports"
on public.reports
for all
to authenticated
using (true)
with check (true);
```

## Таблицы на следующий этап

Эти таблицы не обязательны для текущего кода, но их стоит добавить, когда появятся соответствующие экраны.

### `adoption_applications`

Заявки на адопцию.

```sql
create table if not exists public.adoption_applications (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid references public.animals(id) on delete set null,
  status text not null default 'new',
  applicant_name text not null,
  applicant_phone text,
  applicant_email text,
  city text,
  message text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint adoption_applications_status_check check (status in ('new', 'in_review', 'approved', 'rejected', 'closed'))
);
```

### `admin_profiles`

Профили админов поверх Supabase Auth. `id` должен совпадать с `auth.users.id`.

```sql
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  constraint admin_profiles_role_check check (role in ('admin', 'editor'))
);
```

После добавления `admin_profiles` RLS можно усилить: разрешать управление контентом только пользователям, которые есть в `admin_profiles`.
