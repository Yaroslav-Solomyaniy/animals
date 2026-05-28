drop policy if exists "Anyone can read published news posts" on public.news_posts;
drop policy if exists "Authenticated can manage news posts" on public.news_posts;

create policy "Anyone can read published news posts"
on public.news_posts
for select
using (
  is_published = true
  and published_at is not null
  and published_at <= now()
);

create policy "Authenticated can manage news posts"
on public.news_posts
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
