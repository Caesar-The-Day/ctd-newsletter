'use client';
import { useEffect, useRef } from 'react';

// Quick data paths
const OUTLINE_URL = '/data/piemonte-outline.geojson';
const PINS_URL = '/data/piemonte-pins.geojson';
const WINE_URL = '/data/piemonte-winezones.geojson';

// Turin + Piemonte view settings
const ITALY_VIEW = { center: [12.4964, 41.9028], zoom: 4.2 };      // start over Italy
const TURIN_VIEW = { center: [7.6869, 45.0703], zoom: 8.2 };       // fly to Turin
const PIEMONTE_VIEW = { center: [7.9, 45.1], zoom: 7.2, pitch: 0 }; // settle on region

export default function PiemonteMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      // Load MapLibre + MapTiler GL style at runtime to keep bundle clean
      const [{ Map, NavigationControl, Popup }, maplibregl] = await Promise.all([
        import('@maptiler/sdk'),
        import('@maplibre/maplibre-gl-style-spec') // placeholder import to ensure ESM tree-shaking; not strictly required
      ]);
      // @ts-ignore - MapTiler SDK adds default export
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mt = await import('@maptiler/sdk');
      // @ts-ignore
      mt.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY as string;

      const map = new mt.Map({
        container: mapRef.current!,
        style: mt.MapStyle.DATAVIZ, // or your custom style ID
        center: [ITALY_VIEW.center[0], ITALY_VIEW.center[1]],
        zoom: ITALY_VIEW.zoom,
        hash: false,
        antialias: true
      });

      map.addControl(new mt.NavigationControl({ visualizePitch: false }), 'top-right');

      map.on('load', async () => {
        // ----- Add data sources -----
        map.addSource('piemonte-outline', {
          type: 'geojson',
          data: OUTLINE_URL
        });
        map.addSource('piemonte-pins', {
          type: 'geojson',
          data: PINS_URL
        });
        map.addSource('piemonte-wine', {
          type: 'geojson',
          data: WINE_URL
        });

        // ----- Region outline glow (two-line technique) -----
        map.addLayer({
          id: 'piemonte-outline-glow',
          type: 'line',
          source: 'piemonte-outline',
          paint: {
            'line-color': '#3BA3FF',
            'line-width': 12,
            'line-opacity': 0.25
          }
        });
        map.addLayer({
          id: 'piemonte-outline-core',
          type: 'line',
          source: 'piemonte-outline',
          paint: {
            'line-color': '#5EC8FF',
            'line-width': 2.5,
            'line-opacity': 0.9
          }
        });

        // ----- Wine zones (polygons or points) -----
        map.addLayer({
          id: 'wine-fill',
          type: 'fill',
          source: 'piemonte-wine',
          paint: {
            'fill-color': '#AA336A',
            'fill-opacity': 0.18
          }
        });
        map.addLayer({
          id: 'wine-outline',
          type: 'line',
          source: 'piemonte-wine',
          paint: {
            'line-color': '#AA336A',
            'line-width': 1
          }
        });

        // ----- City / Nature pins -----
        map.addLayer({
          id: 'city-pins',
          type: 'symbol',
          source: 'piemonte-pins',
          filter: ['==', ['get', 'category'], 'city'],
          layout: {
            'icon-image': 'marker', // default sprite in MapTiler styles
            'icon-size': 0.9,
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-offset': [0, 1.2],
            'text-anchor': 'top'
          },
          paint: {
            'text-halo-color': '#ffffff',
            'text-halo-width': 1
          }
        });

        map.addLayer({
          id: 'nature-pins',
          type: 'symbol',
          source: 'piemonte-pins',
          filter: ['==', ['get', 'category'], 'nature'],
          layout: {
            'icon-image': 'mountain', // or 'park', depending on style sprite
            'icon-size': 0.9,
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-offset': [0, 1.2],
            'text-anchor': 'top'
          },
          paint: {
            'text-halo-color': '#ffffff',
            'text-halo-width': 1
          }
        });

        // ----- 2-line popup on click (any pin layer) -----
        const popup = new mt.Popup({ closeButton: true, closeOnClick: true });
        function bindPopup(layerId: string) {
          map.on('click', layerId, (e: any) => {
            const f = e.features?.[0];
            if (!f) return;
            const { name, teaser } = f.properties;
            const [lng, lat] = e.lngLat ? [e.lngLat.lng, e.lngLat.lat] : f.geometry.coordinates;
            popup
              .setLngLat([lng, lat])
              .setHTML(
                `<div style="font-weight:600;margin-bottom:2px">${name}</div>
                 <div style="font-size:12px;opacity:.8;line-height:1.2">${teaser}</div>`
              )
              .addTo(map);
          });
          map.on('mouseenter', layerId, () => (map.getCanvas().style.cursor = 'pointer'));
          map.on('mouseleave', layerId, () => (map.getCanvas().style.cursor = ''));
        }
        bindPopup('city-pins');
        bindPopup('nature-pins');

        // ----- Layer toggles -----
        function setVisible(id: string, visible: boolean) {
          map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
        }
        const toggles: Record<string, string[]> = {
          Cities: ['city-pins'],
          'Wine zones': ['wine-fill', 'wine-outline'],
          Nature: ['nature-pins']
        };
        const panel = document.getElementById('layer-toggles')!;
        Object.entries(toggles).forEach(([label, ids]) => {
          const row = document.createElement('label');
          row.style.display = 'flex';
          row.style.gap = '6px';
          row.style.alignItems = 'center';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = true;
          cb.onchange = () => ids.forEach(id => setVisible(id, cb.checked));
          row.appendChild(cb);
          row.appendChild(document.createTextNode(label));
          panel.appendChild(row);
        });

        // ----- Fade-in zoom sequence: Italy → Turin → Piemonte -----
        // 1) small fade on outline
        map.setPaintProperty('piemonte-outline-glow', 'line-opacity', 0.0);
        map.setPaintProperty('piemonte-outline-core', 'line-opacity', 0.0);

        // 2) fly to Turin
        setTimeout(() => {
          map.flyTo({ center: TURIN_VIEW.center as any, zoom: TURIN_VIEW.zoom, speed: 0.6, curve: 1.4, essential: true });
        }, 700);

        // 3) settle on Piemonte, fade outline in
        setTimeout(() => {
          map.flyTo({ center: PIEMONTE_VIEW.center as any, zoom: PIEMONTE_VIEW.zoom, speed: 0.5, curve: 1.2, essential: true });
          // fade up the glow/core
          let t = 0;
          const iv = setInterval(() => {
            t += 0.08;
            const v = Math.min(0.9 * t, 0.9);
            const g = Math.min(0.25 * t, 0.25);
            map.setPaintProperty('piemonte-outline-core', 'line-opacity', v);
            map.setPaintProperty('piemonte-outline-glow', 'line-opacity', g);
            if (t >= 1.0) clearInterval(iv);
          }, 60);
        }, 2700);
      });

      return () => {
        map?.remove?.();
      };
    })();
  }, []);

  return (
    <div className="w-full h-[100dvh] relative">
      <div ref={mapRef} className="w-full h-full" />
      <div id="layer-toggles"
           className="absolute top-3 left-3 bg-white/90 rounded-xl p-3 text-sm shadow">
        <div style={{fontWeight:600, marginBottom:6}}>Layers</div>
      </div>
    </div>
  );
}
