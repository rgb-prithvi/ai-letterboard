-- Add last_active column to session table
ALTER TABLE session ADD COLUMN last_active TIMESTAMP WITH TIME ZONE;

-- Set a default value for existing rows (optional)
UPDATE session
SET
    last_active = start_time
WHERE
    last_active IS NULL;

-- Add a comment to the column (optional, but recommended for documentation)
COMMENT ON COLUMN session.last_active IS 'Timestamp of the last activity in this session';