UPDATE public.regions
SET region_data = jsonb_set(
  region_data,
  '{region,hero,bannerImage}',
  to_jsonb('https://jolbywwrnehhwodlgytt.supabase.co/storage/v1/object/public/region-images/calabria/hero.png'::text),
  true
)
WHERE slug = 'calabria';