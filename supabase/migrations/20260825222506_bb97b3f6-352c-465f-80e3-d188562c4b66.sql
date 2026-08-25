DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'region_og_metadata_region_slug_key'
      AND conrelid = 'public.region_og_metadata'::regclass
  ) THEN
    ALTER TABLE public.region_og_metadata
      ADD CONSTRAINT region_og_metadata_region_slug_key UNIQUE (region_slug);
  END IF;
END $$;