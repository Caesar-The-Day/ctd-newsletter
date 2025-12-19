-- Create the updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for region OG metadata
CREATE TABLE IF NOT EXISTS public.region_og_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.region_og_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for the edge function)
CREATE POLICY "Public read access for region OG metadata"
ON public.region_og_metadata FOR SELECT
USING (true);

-- Allow all operations for now (admin functionality)
CREATE POLICY "Allow insert for region OG metadata"
ON public.region_og_metadata FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update for region OG metadata"
ON public.region_og_metadata FOR UPDATE
USING (true);

CREATE POLICY "Allow delete for region OG metadata"
ON public.region_og_metadata FOR DELETE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_region_og_metadata_updated_at
BEFORE UPDATE ON public.region_og_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing regions
INSERT INTO public.region_og_metadata (region_slug, title, description, image_url)
VALUES 
  ('piemonte', 'Retiring in Piemonte | Veni. Vidi. Vici. Region Guide', 'Explore Piemonte like a local — from walkable towns and cost-of-living insights to healthcare, wine culture, and interactive planning tools. A smart retiree''s guide to Northern Italy.', 'https://news.caesartheday.com/images/piemonte-og.jpg'),
  ('lombardia', 'Retiring in Lombardia | Veni. Vidi. Vici. Region Guide', 'Northern sophistication with mountain soul. Your guide to retiring in Lombardia — lakes, culture, cost of living, and the best towns to call home.', 'https://news.caesartheday.com/images/lombardia-og.jpg'),
  ('puglia', 'Retiring in Puglia | Veni. Vidi. Vici. Region Guide', 'Sun-drenched coasts, ancient towns, and la dolce vita. Your complete guide to retiring in Puglia — from trulli to trattorias.', 'https://news.caesartheday.com/images/puglia-og.jpg')
ON CONFLICT (region_slug) DO NOTHING;