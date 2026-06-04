-- =============================================
-- TrendTracker ID - Migration 005
-- Atomic caption usage increment RPC.
-- =============================================

CREATE OR REPLACE FUNCTION increment_caption_usage(
  p_user_id uuid,
  p_date date
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count int;
BEGIN
  INSERT INTO caption_usage (user_id, usage_date, count)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET count = caption_usage.count + 1
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION increment_caption_usage(uuid, date) TO authenticated;