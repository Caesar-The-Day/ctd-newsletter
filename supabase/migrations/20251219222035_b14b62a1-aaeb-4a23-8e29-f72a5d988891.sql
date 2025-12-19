-- Create the og-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('og-images', 'og-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Allow public read access to og-images bucket
CREATE POLICY "Public read access for og-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');

-- Allow authenticated users to upload to og-images bucket
CREATE POLICY "Allow upload to og-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'og-images');

-- Allow authenticated users to update og-images
CREATE POLICY "Allow update og-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'og-images');

-- Allow authenticated users to delete from og-images bucket
CREATE POLICY "Allow delete from og-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'og-images');