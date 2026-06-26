ALTER TABLE public.volunteer_requests
  ADD COLUMN IF NOT EXISTS animal_id text,
  ADD COLUMN IF NOT EXISTS animal_name text;
