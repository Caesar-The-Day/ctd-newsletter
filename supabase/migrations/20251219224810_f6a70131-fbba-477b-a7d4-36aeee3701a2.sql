-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow delete for regions" ON public.regions;
DROP POLICY IF EXISTS "Allow insert for regions" ON public.regions;
DROP POLICY IF EXISTS "Allow update for regions" ON public.regions;
DROP POLICY IF EXISTS "Public read access for regions" ON public.regions;

-- Create new permissive policies
CREATE POLICY "regions_select_all" ON public.regions
  FOR SELECT USING (true);

CREATE POLICY "regions_insert_all" ON public.regions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "regions_update_all" ON public.regions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "regions_delete_all" ON public.regions
  FOR DELETE USING (true);