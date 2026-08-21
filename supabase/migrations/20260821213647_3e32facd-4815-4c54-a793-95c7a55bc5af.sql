-- 1. Admin role infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. regions table: public read, admin-only writes
DROP POLICY IF EXISTS "regions_insert_all" ON public.regions;
DROP POLICY IF EXISTS "regions_update_all" ON public.regions;
DROP POLICY IF EXISTS "regions_delete_all" ON public.regions;

DROP POLICY IF EXISTS "Admins can insert regions" ON public.regions;
CREATE POLICY "Admins can insert regions" ON public.regions
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update regions" ON public.regions;
CREATE POLICY "Admins can update regions" ON public.regions
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete regions" ON public.regions;
CREATE POLICY "Admins can delete regions" ON public.regions
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. region_og_metadata: public read, admin-only writes
DROP POLICY IF EXISTS "Allow insert for region OG metadata" ON public.region_og_metadata;
DROP POLICY IF EXISTS "Allow update for region OG metadata" ON public.region_og_metadata;
DROP POLICY IF EXISTS "Allow delete for region OG metadata" ON public.region_og_metadata;

DROP POLICY IF EXISTS "Admins can insert region OG metadata" ON public.region_og_metadata;
CREATE POLICY "Admins can insert region OG metadata" ON public.region_og_metadata
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update region OG metadata" ON public.region_og_metadata;
CREATE POLICY "Admins can update region OG metadata" ON public.region_og_metadata
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete region OG metadata" ON public.region_og_metadata;
CREATE POLICY "Admins can delete region OG metadata" ON public.region_og_metadata
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Storage: public read stays, writes admin-only
DROP POLICY IF EXISTS "Allow public upload to region-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on region-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on region-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to og-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on og-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on og-images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload og-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update og-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete og-images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload region and og images" ON storage.objects;
CREATE POLICY "Admins can upload region and og images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('region-images','og-images') AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update region and og images" ON storage.objects;
CREATE POLICY "Admins can update region and og images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('region-images','og-images') AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id IN ('region-images','og-images') AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete region and og images" ON storage.objects;
CREATE POLICY "Admins can delete region and og images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('region-images','og-images') AND public.has_role(auth.uid(), 'admin'));