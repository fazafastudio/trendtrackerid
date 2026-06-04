-- =============================================
-- TrendTracker ID - Migration 002
-- Fix scrape_logs RLS policies.
--
-- The previous policies used `current_setting('role')`
-- which is unreliable in Supabase (returns the
-- connection role, not the JWT role).
--
-- Per request, RLS stays ENABLED. The table is now
-- service-role-only: with no policies, anon and
-- authenticated roles are denied, while the service
-- role key bypasses RLS entirely.
-- =============================================

-- Drop the three existing policies from 001_initial_schema.sql
DROP POLICY IF EXISTS "Only service_role can insert scrape logs"
  ON scrape_logs;
DROP POLICY IF EXISTS "Only service_role can update scrape logs"
  ON scrape_logs;
DROP POLICY IF EXISTS "Scrape logs are viewable by everyone"
  ON scrape_logs;

-- Update the table comment to reflect the new security model
COMMENT ON TABLE scrape_logs IS
  'Scrape job logs. Service-role-only — RLS enabled with no policies. '
  'Reads/writes from anon or authenticated roles will be denied; '
  'use the service role key (via createServiceRoleClient) to access.';

-- Verify: ensure no policies remain and RLS is still enabled
DO $$
DECLARE
  policy_count integer;
  rls_enabled boolean;
BEGIN
  SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'scrape_logs';

  SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'scrape_logs'
      AND relnamespace = 'public'::regnamespace;

  RAISE NOTICE 'scrape_logs policies remaining: % (expected 0)', policy_count;
  RAISE NOTICE 'scrape_logs RLS enabled: % (expected true)', rls_enabled;
END
$$;