-- Allow anonymous inserts for public form submissions
-- The service_requests table uses the anon/publishable key on the server,
-- so we need an explicit INSERT policy (RLS is already enabled on this table).

CREATE POLICY "anon insert service_requests"
  ON service_requests FOR INSERT
  WITH CHECK (true);
