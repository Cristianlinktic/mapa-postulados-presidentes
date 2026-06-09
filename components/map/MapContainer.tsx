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
            ['boolean', ['feature-state', 'hover'], false],
            '#fef08a', // Hover color (yellowish)
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
          'line-width': 0.5
        }
      });
    });

    let hoveredStateId: string | number | null = null;

    map.current.on('mousemove', 'colombia-layer', (e) => {
        if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            
            // Use the feature's generated id
            if (feature.id !== undefined) {
                if (hoveredStateId !== null && hoveredStateId !== feature.id) {
                    map.current?.setFeatureState(
                        { source: 'colombia', id: hoveredStateId },
                        { hover: false }
                    );
                }
                hoveredStateId = feature.id as string | number;
                map.current?.setFeatureState(
                    { source: 'colombia', id: hoveredStateId },
                    { hover: true }
                );
            }
        }
    });

    map.current.on('mouseleave', 'colombia-layer', () => {
        if (hoveredStateId !== null) {
            map.current?.setFeatureState(
                { source: 'colombia', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;
    });

    map.current.on('click', 'colombia-layer', (e) => {
        if (e.features && e.features.length > 0) {
            const id = e.features[0].properties?.shapeID;
            if (id) {
                setSelectedLocationId(id);
            }
        }
    });
  }, [setSelectedLocationId]);

  return <div ref={mapContainer} className="h-full w-full rounded-lg" />;
}
