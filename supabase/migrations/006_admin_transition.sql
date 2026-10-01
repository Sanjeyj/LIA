-- ============================================================
-- Rotaract Club of Lead India Ahead — MAAYON 2026–27
-- Migration 006: Administrator Transition & Access Control
-- Target: Promote racleadindiaahead2021@gmail.com to super_admin
-- Set password to LiaAdmin@2026! and confirm email
-- ============================================================

-- 1. Ensure email is confirmed and password is set to LiaAdmin@2026!
DO $$
BEGIN
  UPDATE auth.users
  SET 
    encrypted_password = extensions.crypt('LiaAdmin@2026!', extensions.gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
  WHERE email = 'racleadindiaahead2021@gmail.com';
EXCEPTION WHEN OTHERS THEN
  -- Fallback if extensions schema is not explicit
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
  WHERE email = 'racleadindiaahead2021@gmail.com';
END $$;

-- 2. Update role change trigger function to permit database admin / migration runs
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  current_role TEXT;
BEGIN
  -- Only run if the role is actually being changed
  IF OLD.role = NEW.role THEN
    RETURN NEW;
  END IF;

  -- Allow DB administrators / migrations / backend scripts (postgres, supabase_admin, service_role)
  IF current_user IN ('postgres', 'supabase_admin', 'service_role') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the role of the currently authenticated user
  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Only super_admin may change any role
  IF current_role IS DISTINCT FROM 'super_admin' THEN
    RAISE EXCEPTION 'Only a super_admin may change user roles. Current role: %', COALESCE(current_role, 'unauthenticated');
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Ensure role constraint allows 'super_admin'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer'));

-- 4. Demote any other administrators / super administrators to 'viewer'
UPDATE public.profiles
SET role = 'viewer',
    updated_at = NOW()
WHERE email != 'racleadindiaahead2021@gmail.com'
  AND role IN ('admin', 'super_admin');

-- 5. Ensure profile row exists and is designated as super_admin
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
SELECT 
  id, 
  email, 
  'super_admin', 
  'LIA Administrator', 
  NOW(), 
  NOW()
FROM auth.users
WHERE email = 'racleadindiaahead2021@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    email = 'racleadindiaahead2021@gmail.com',
    updated_at = NOW();

-- 6. Verification Query: Confirm the active administrator and profile
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.full_name,
  p.updated_at
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'racleadindiaahead2021@gmail.com';
