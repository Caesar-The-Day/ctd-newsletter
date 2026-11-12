DROP POLICY IF EXISTS "regions_select_all" ON public.regions;
CREATE POLICY "Public can read live regions, admins read all" ON public.regions
FOR SELECT USING (status = 'live' OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public read access for region OG metadata" ON public.region_og_metadata;
CREATE POLICY "Public can read OG metadata for live regions" ON public.region_og_metadata
FOR SELECT USING (
  region_slug = 'home'
  OR EXISTS (SELECT 1 FROM public.regions r WHERE r.slug = region_og_metadata.region_slug AND r.status = 'live')
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Allow delete from og-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update og-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload to og-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on region-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for og-images" ON storage.objects;
CREATE POLICY "Admins can list region and og images" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id IN ('region-images','og-images') AND public.has_role(auth.uid(), 'admin'::app_role));