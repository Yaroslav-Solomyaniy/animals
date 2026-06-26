-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  topic text NOT NULL,
  animal_id text,
  animal_name text,
  message text,
  attachment_urls text[] DEFAULT '{}',
  email_status text NOT NULL DEFAULT 'pending',
  email_error text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Service order requests
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  phone text NOT NULL,
  weight text,
  desired_date text,
  comment text,
  email_status text NOT NULL DEFAULT 'pending',
  email_error text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS: admin only (adjust to your auth pattern)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests    ENABLE ROW LEVEL SECURITY;

-- Allow inserts from server (service role bypasses RLS)
-- Allow reads only for authenticated admin users:
CREATE POLICY "admin read contact_submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "admin read service_requests"
  ON service_requests FOR SELECT
  USING (auth.role() = 'authenticated');
