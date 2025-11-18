-- ============================================
-- FIX SECURITY WARNINGS
-- Set explicit search_path for functions
-- ============================================

-- ============================================
-- 1. FIX handle_updated_at() function
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$;

-- ============================================
-- 2. FIX handle_new_user() function
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- ============================================
-- 3. Verify the fix
-- ============================================
SELECT
  routine_name,
  routine_type,
  security_type,
  external_language
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_updated_at', 'handle_new_user');

-- Check if search_path is set
SELECT
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  CASE
    WHEN p.proconfig IS NOT NULL THEN 'search_path is SET ✅'
    ELSE 'search_path NOT SET ⚠️'
  END AS security_status,
  p.proconfig AS config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('handle_updated_at', 'handle_new_user');
