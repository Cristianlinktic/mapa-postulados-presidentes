"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useStore } from "@/lib/store";
import { mockTerritorialData } from "@/lib/data/mockData";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error("Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
} else {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export default function MapContainer() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const setSelectedLocationId = useStore((state) => state.setSelectedLocationId);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-74.0721, 4.7110], // Bogotá
      zoom: 5,
    });

    map.current.on('load', () => {
      if (!map.current) return;
      
      // Force the background of the entire map canvas
      const layers = map.current.getStyle().layers;
      if (layers) {
        layers.forEach((layer) => {
          if (layer.id === 'water' || layer.id === 'background') {
            map.current?.setPaintProperty(layer.id, layer.type === 'background' ? 'background-color' : 'fill-color', '#0a0c14');
          }
        });
      }

      map.current.addSource('colombia', {
        type: 'geojson',
        data: '/data/colombia.geo.json',
        generateId: true
      });

      // Join data
      const source = map.current.getSource('colombia') as mapboxgl.GeoJSONSource;
      
      // Basic choropleth color expression
      const colorExpression: any = [
        'match',
        ['get', 'shapeID'],
        ...Object.entries(mockTerritorialData).flatMap(([id, data]) => [
          id,
          data.favorabilidadCepeda > data.favorabilidadDeLaEspriella ? '#22c55e' : '#3b82f6' // Green for Cepeda, Blue for Espriella
        ]),
        '#6b7280' // Default
      ];

      map.current.addLayer({
        id: 'colombia-layer',
        type: 'fill',
        source: 'colombia',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#C9A84C', // Active State (Premium Gold)
            ['boolean', ['feature-state', 'hover'], false],
            'rgba(201, 168, 76, 0.4)', // Hover color
            colorExpression
          ],
          'fill-opacity': 0.7
        }
      });
      
      // Add a border layer for clarity
      map.current.addLayer({
        id: 'colombia-borders',
        type: 'line',
        source: 'colombia',
        paint: {
          'line-color': '#fff',
          'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2, 0.5]
        }
      });
    });

    let hoveredStateId: string | number | null = null;
    let selectedStateId: string | number | null = null;

    map.current.on('mousemove', 'colombia-layer', (e) => {
        if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            if (feature.id !== undefined) {
                if (hoveredStateId !== null && hoveredStateId !== feature.id) {
                    map.current?.setFeatureState({ source: 'colombia', id: hoveredStateId }, { hover: false });
                }
                hoveredStateId = feature.id;
                map.current?.setFeatureState({ source: 'colombia', id: hoveredStateId }, { hover: true });
            }
        }
    });

    map.current.on('mouseleave', 'colombia-layer', () => {
        if (hoveredStateId !== null) {
            map.current?.setFeatureState({ source: 'colombia', id: hoveredStateId }, { hover: false });
        }
        hoveredStateId = null;
    });

    map.current.on('click', 'colombia-layer', (e) => {
        if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const shapeID = feature.properties?.shapeID;
            const featureId = feature.id;

            if (selectedStateId !== null) {
                map.current?.setFeatureState({ source: 'colombia', id: selectedStateId }, { selected: false });
            }
            if (featureId !== undefined) {
                selectedStateId = featureId;
                map.current?.setFeatureState({ source: 'colombia', id: selectedStateId }, { selected: true });
            }

            if (shapeID) {
                setSelectedLocationId(shapeID);
                
                const data = mockTerritorialData[shapeID];
                if (data) {
                    new mapboxgl.Popup({ closeButton: false, className: 'intel-popup', maxWidth: '220px' })
                        .setLngLat(e.lngLat)
                        .setHTML(`
                          <div style="
                            background: var(--color-surface);
                            border: 1px solid var(--color-gold-glow);
                            border-radius: 12px;
                            padding: 16px;
                            backdrop-filter: blur(20px);
                            font-family: 'Satoshi', sans-serif;
                            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                            min-width: 200px;
                          ">
                            <!-- Label -->
                            <div style="
                              font-family: Satoshi, sans-serif;
                              font-size: 8px;
                              font-weight: 600;
                              letter-spacing: 0.2em;
                              text-transform: uppercase;
                              color: var(--color-gold);
                              margin-bottom: 6px;
                            ">Análisis territorial</div>

                            <!-- Region name -->
                            <div style="
                              font-family: Satoshi, sans-serif;
                              font-size: 16px;
                              font-weight: 700;
                              color: #ffffff;
                              margin-bottom: 12px;
                              line-height: 1.2;
                            ">${data.name}</div>

                            <!-- Divider -->
                            <div style="height:1px; background: rgba(201,168,76,0.2); margin-bottom: 12px;"></div>

                            <!-- Cepeda row -->
                            <div style="margin-bottom: 10px;">
                              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
                                <span style="font-family: Satoshi, sans-serif; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-cepeda);">Cepeda</span>
                                <span style="font-family: Satoshi, sans-serif; font-size: 11px; font-weight: 600; color: var(--color-cepeda);">${data.favorabilidadCepeda}%</span>
                              </div>
                              <div style="height: 4px; border-radius: 2px; background: rgba(255,255,255,0.05);">
                                <div style="height: 100%; width: ${data.favorabilidadCepeda}%; border-radius: 2px; background: var(--color-cepeda);"></div>
                              </div>
                            </div>

                            <!-- Espriella row -->
                            <div>
                              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
                                <span style="font-family: Satoshi, sans-serif; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-espriella);">Espriella</span>
                                <span style="font-family: Satoshi, sans-serif; font-size: 11px; font-weight: 600; color: var(--color-espriella);">${data.favorabilidadDeLaEspriella}%</span>
                              </div>
                              <div style="height: 4px; border-radius: 2px; background: rgba(255,255,255,0.05);">
                                <div style="height: 100%; width: ${data.favorabilidadDeLaEspriella}%; border-radius: 2px; background: var(--color-espriella);"></div>
                              </div>
                            </div>

                            <!-- Winner badge -->
                            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 6px;">
                              <div style="width: 6px; height: 6px; border-radius: 50%; background: ${data.favorabilidadCepeda > data.favorabilidadDeLaEspriella ? 'var(--color-cepeda)' : 'var(--color-espriella)'};"></div>
                              <span style="font-family: Satoshi, sans-serif; font-size: 8px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.4);">${data.favorabilidadCepeda > data.favorabilidadDeLaEspriella ? 'Cepeda lidera' : 'Espriella lidera'}</span>
                            </div>
                          </div>
                        `)
                        .addTo(map.current!);
                }
            }
        }
    });
  }, [setSelectedLocationId]);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/[0.05] bg-black">
      <div ref={mapContainer} className="h-full w-full" />
      {/* Subtle overlay to integrate base map with dark theme */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/40 to-transparent" />
    </div>
  );
}
