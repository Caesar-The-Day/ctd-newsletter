UPDATE regions
SET region_data = jsonb_set(
  region_data,
  '{where,map,overlays}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN overlay->>'id' = 'national-parks' THEN
          jsonb_set(overlay, '{features}', (
            SELECT jsonb_agg(
              CASE
                WHEN feat->>'name' = 'Pollino National Park' THEN jsonb_set(feat, '{photo}', '"/images/calabria/pollino-park.jpg"')
                WHEN feat->>'name' = 'Sila National Park' THEN jsonb_set(feat, '{photo}', '"/images/calabria/sila-park.jpg"')
                WHEN feat->>'name' = 'Aspromonte National Park' THEN jsonb_set(feat, '{photo}', '"/images/calabria/aspromonte-park.jpg"')
                ELSE feat
              END
            )
            FROM jsonb_array_elements(overlay->'features') feat
          ))
        WHEN overlay->>'id' = 'cultural-sites' THEN
          jsonb_set(overlay, '{features}', (
            SELECT jsonb_agg(
              CASE
                WHEN feat->>'name' = 'Codex Purpureus Rossanensis' THEN
                  jsonb_set(feat, '{website}', '"https://www.unesco.org/en/memory-world/codex-purpureus-rossanensis"')
                WHEN feat->>'name' = 'Cathedral of Gerace' THEN
                  jsonb_set(feat, '{photo}', '"/images/calabria/cathedral-gerace.jpg"')
                ELSE feat
              END
            )
            FROM jsonb_array_elements(overlay->'features') feat
          ))
        ELSE overlay
      END
    )
    FROM jsonb_array_elements(region_data->'where'->'map'->'overlays') overlay
  )
)
WHERE slug = 'calabria';