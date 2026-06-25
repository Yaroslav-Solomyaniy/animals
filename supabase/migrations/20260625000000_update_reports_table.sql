-- Update reports table: replace month/year/file_url/file_r2_key with period/description/files

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS period       TEXT,
  ADD COLUMN IF NOT EXISTS description  TEXT,
  ADD COLUMN IF NOT EXISTS files        JSONB NOT NULL DEFAULT '[]';

-- Drop old columns if they exist
ALTER TABLE reports
  DROP COLUMN IF EXISTS month,
  DROP COLUMN IF EXISTS year,
  DROP COLUMN IF EXISTS file_url,
  DROP COLUMN IF EXISTS file_r2_key;
