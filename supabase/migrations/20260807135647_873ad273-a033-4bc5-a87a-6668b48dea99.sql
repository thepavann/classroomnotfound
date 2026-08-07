-- Move has_role into a private (non-API) schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

GRANT USAGE ON SCHEMA private TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Rebuild policies on the private helper
DROP POLICY IF EXISTS "Professors manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Roles readable by authenticated" ON public.user_roles;
DROP POLICY IF EXISTS "Profiles readable by authenticated" ON public.profiles;

CREATE POLICY "Professors manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'professor'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'professor'::public.app_role));

CREATE POLICY "Users read own role"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR private.has_role(auth.uid(), 'professor'::public.app_role));

-- Remove the API-exposed SECURITY DEFINER function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);