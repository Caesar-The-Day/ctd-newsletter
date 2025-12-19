-- Create a regions table to store dynamically created regions
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'archived')),
  locked BOOLEAN NOT NULL DEFAULT false,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  published_date DATE,
  version TEXT NOT NULL DEFAULT '0.1',
  color_scheme TEXT NOT NULL DEFAULT 'default',
  issue_number INTEGER,
  region_data JSONB,
  climate_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

-- Allow public read access (regions are public content)
CREATE POLICY "Public read access for regions" 
ON public.regions 
FOR SELECT 
USING (true);

-- Allow insert/update/delete for all (no auth required for admin)
CREATE POLICY "Allow insert for regions" 
ON public.regions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update for regions" 
ON public.regions 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete for regions" 
ON public.regions 
FOR DELETE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_regions_updated_at
BEFORE UPDATE ON public.regions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing regions from static file
INSERT INTO public.regions (slug, display_name, status, locked, created_date, published_date, version, color_scheme)
VALUES 
  ('piemonte', 'Piemonte', 'live', true, '2025-10-15', '2025-10-20', '1.0', 'piemonte-theme'),
  ('puglia', 'Puglia', 'live', true, '2025-11-01', '2025-11-10', '1.0', 'default'),
  ('lombardia', 'Lombardia', 'live', true, '2025-12-18', '2025-12-19', '1.0', 'custom')
ON CONFLICT (slug) DO NOTHING;