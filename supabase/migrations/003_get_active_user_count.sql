-- =============================================
-- TrendTracker ID - Migration 003
-- Add a SECURITY DEFINER RPC that returns the
-- total count of registered users from auth.users.
--
-- Used by the dashboard "Akun Aktif" stat card.
--
-- Notes:
--  - SECURITY DEFINER so the function runs with the
--    privileges of the function owner (postgres), allowing
--    it to read auth.users even when called by an
--    authenticated role.
--  - STABLE because count(*) over auth.users is
--    deterministic within a single transaction.
--  - Revoked from PUBLIC, granted only to authenticated
--    and service_role.
-- =============================================

CREATE OR REPLACE FUNCTION public.get_active_user_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT count(*)::integer FROM auth.users;
$$;

REVOKE ALL ON FUNCTION public.get_active_user_count() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_active_user_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_user_count() TO service_role;

COMMENT ON FUNCTION public.get_active_user_count() IS
  'Returns the total count of registered users from auth.users. '
  'SECURITY DEFINER; callable by authenticated and service_role.';