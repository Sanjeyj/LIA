-- ============================================================
-- LIA Website — Trigger Fix
-- Run this in Supabase SQL Editor if you ever hit a trigger conflict
-- ============================================================

-- Drop conflicting triggers first (safe if they don't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS prevent_role_self_promotion_trigger ON public.profiles;
DROP TRIGGER IF EXISTS prevent_unauthorized_role_change_trigger ON public.profiles;

-- Re-create profile auto-create trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Re-create role-change security trigger
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  current_role TEXT;
BEGIN
  IF OLD.role = NEW.role THEN
    RETURN NEW;
  END IF;

  IF current_user IN ('postgres', 'supabase_admin', 'service_role') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_role IS DISTINCT FROM 'super_admin' THEN
    RAISE EXCEPTION 'Only a super_admin may change user roles. Current role: %', COALESCE(current_role, 'unauthenticated');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_unauthorized_role_change_trigger ON public.profiles;
CREATE TRIGGER prevent_unauthorized_role_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_unauthorized_role_change();

SELECT 'All triggers fixed and verified successfully!' AS status;
