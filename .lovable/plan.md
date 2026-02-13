

## Replace Nature Map Markers for Veneto

### Problem

The "Access to Nature & Recreation" section renders `<LombardiaNatureMap />` with no props for every region that has infrastructure data. This means Veneto shows Lombardia's lakes (Como, Iseo, Maggiore), Lombardia's ski areas (Bormio, Livigno), and Milan as the hub -- all wrong for Veneto.

### Solution

Pass Veneto-specific nature features to the existing `LombardiaNatureMap` component. The component already supports a `features` prop -- it just needs the right data. Additionally, add a `beach` feature type for the Adriatic coast.

### Changes

**1. `src/components/sections/HealthcareInfrastructure.tsx`**

- Where `<LombardiaNatureMap />` is rendered (line 540), make it region-aware by passing Veneto features when the region slug is `veneto`
- Define a `venetoNatureFeatures` array with geographically accurate coordinates for Veneto's nature assets

**2. `src/components/sections/LombardiaNatureMap.tsx`**

- Add `beach` to the feature type union (`'lake' | 'park' | 'ski' | 'hub' | 'beach'`)
- Add a beach marker style (using the existing `Waves` icon in a sandy/amber color scheme)
- Add beach icon to the legend
- Rename the component export to something generic (e.g., `NatureRecreationMap`) or keep the name but it works for any region via props

### Veneto Nature Features

**Hub:** Padova (geographic center of Veneto's livability corridor)

**Parks (green tree markers):**
- Dolomiti Bellunesi National Park [46.20, 12.05] -- Alpine wilderness, UNESCO World Heritage
- Parco Regionale dei Colli Euganei [45.30, 11.72] -- Thermal hills, gentle hiking, spa culture
- Parco Regionale del Delta del Po [44.95, 12.30] -- Wetlands, birdwatching, cycling paths
- Parco Naturale della Lessinia [45.60, 11.05] -- Pre-Alpine plateau, truffle country

**Ski Areas (blue snowflake markers):**
- Cortina d'Ampezzo [46.54, 12.14] -- 2026 Olympics, world-class skiing
- Arabba / Marmolada [46.50, 11.87] -- Highest Dolomite peak, glacier skiing
- Alleghe / Civetta [46.41, 12.02] -- Family-friendly, dramatic cliff scenery
- Falcade / San Pellegrino [46.35, 11.87] -- Quieter, excellent snow record
- Asiago Plateau [45.88, 11.51] -- Accessible from Vicenza, cross-country skiing

**Lakes (blue polygon markers):**
- Lake Garda (western shore) [45.58, 10.65] -- Italy's largest lake, shared with Lombardia
- Lake Santa Croce [46.10, 12.33] -- Windsurfing and pre-Alpine setting
- Lake Misurina [46.58, 12.25] -- High-altitude Dolomite lake

**Beaches (amber/sand markers - NEW type):**
- Lido di Venezia [45.38, 12.36] -- Venice's beach island, film festival
- Jesolo [45.50, 12.64] -- Family resort strip, 15km of sand
- Caorle [45.60, 12.88] -- Fishing village charm with long beach
- Sottomarina / Chioggia [45.22, 12.30] -- Wide sandy beaches, less touristic

**Map center:** [45.7, 11.8] at zoom 8 (to capture Dolomites to Adriatic)

### No new dependencies or files needed

The `LombardiaNatureMap` component already has the Leaflet + MapTiler setup, legend, and interaction patterns. Adding `beach` is one new marker style and one legend entry.

