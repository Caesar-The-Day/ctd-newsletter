
-- Add permissive storage policies for region-images bucket
-- Matches the existing og-images bucket pattern

CREATE POLICY "Allow public read access on region-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'region-images');

CREATE POLICY "Allow public upload to region-images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'region-images');

CREATE POLICY "Allow public update on region-images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'region-images');

CREATE POLICY "Allow public delete on region-images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'region-images');
