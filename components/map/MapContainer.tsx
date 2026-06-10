"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error("Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
} else {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export default function MapContainer() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const layersAdded = useRef(false);
  const setSelectedLocationId = useStore((state) => state.setSelectedLocationId);
  const setMapInstance = useStore((state) => state.setMapInstance);
  const setActivePopup = useStore((state) => state.setActivePopup);
  const activePopup = useStore((state) => state.activePopup);
  const currentData = useStore((state) => state.currentData);

  const [territorialData, setTerritorialData] = useState<any[]>([]);

  const updateMapColors = (data: any[]) => {
    if (!map.current || !layersAdded.current || !map.current.getLayer('colombia-layer')) {
      return;
    }

    if (data.length === 0) return;

    console.log("MapContainer: updateMapColors executing with", data.length, "items");
    let colorExpression: any;

    colorExpression = [
      'match',
      ['get', 'shapeID'],
      ...data.flatMap((d) => [
        d.shape_id,
        d.favorabilidad_cepeda > d.favorabilidad_espriella ? '#c084fc' : '#f97316'
      ]),
      '#e2e8f0'
    ];

    map.current.setPaintProperty('colombia-layer', 'fill-color', [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      '#3b82f6',
      ['boolean', ['feature-state', 'hover'], false],
      'rgba(59, 130, 246, 0.4)',
      colorExpression
    ]);
  };

  useEffect(() => {
    // Definir función interna para poder llamar a fetch y luego actualizar colores
    const initData = async () => {
      console.log("MapContainer: Initializing data fetch...");
      const { data, error } = await supabase.from('territories').select('*');
      if (error) {
        console.error("MapContainer: Error fetching territorial data:", error);
        return;
      }
      console.log("MapContainer: Territorial data fetched:", data);
      if (data && data.length > 0) {
        setTerritorialData(data);
        // Intentar actualizar colores inmediatamente después de obtener datos
        updateMapColors(data);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    console.log("MapContainer: Initializing map instance");

    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/felipe2507/cmq8n6tvk003601s340eecepo",
        center: [-74.0721, 4.7110],
        zoom: 5,
      });

      map.current = mapInstance;

      setMapInstance(mapInstance);

      mapInstance.on("error", (e) => {
        console.error("Mapbox Error:", e);
      });

      const addMapLayers = () => {
        if (!map.current) return;

        if (map.current.getSource("colombia")) {
          return;
        }

        console.log("MapContainer: Adding GeoJSON sources and layers");

        try {
          map.current.addSource("colombia", {
            type: "geojson",
            data: "/data/colombia.geo.json",
            generateId: true,
          });

          map.current.addLayer({
            id: "colombia-layer",
            type: "fill",
            source: "colombia",
            paint: {
              "fill-color": "#e2e8f0",
              "fill-opacity": 0.8,
            },
          });

          map.current.addLayer({
            id: "colombia-borders",
            type: "line",
            source: "colombia",
            paint: {
              "line-color": "#94a3b8",
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                2,
                0.5,
              ],
            },
          });

          let hoveredStateId: string | number | null = null;
          let selectedStateId: string | number | null = null;

          map.current.on("mousemove", "colombia-layer", (e) => {
            if (!e.features?.length) return;

            const feature = e.features[0];

            if (feature.id !== undefined) {
              if (
                hoveredStateId !== null &&
                hoveredStateId !== feature.id
              ) {
                map.current?.setFeatureState(
                  {
                    source: "colombia",
                    id: hoveredStateId,
                  },
                  {
                    hover: false,
                  }
                );
              }

              hoveredStateId = feature.id;

              map.current?.setFeatureState(
                {
                  source: "colombia",
                  id: hoveredStateId,
                },
                {
                  hover: true,
                }
              );
            }
          });

          map.current.on("mouseleave", "colombia-layer", () => {
            if (hoveredStateId !== null) {
              map.current?.setFeatureState(
                {
                  source: "colombia",
                  id: hoveredStateId,
                },
                {
                  hover: false,
                }
              );
            }

            hoveredStateId = null;
          });

          map.current.on("click", "colombia-layer", async (e) => {
            if (!e.features?.length) return;

            const feature = e.features[0];

            const shapeID = feature.properties?.shapeID;
            const featureId = feature.id;

            if (selectedStateId !== null) {
              map.current?.setFeatureState(
                {
                  source: "colombia",
                  id: selectedStateId,
                },
                {
                  selected: false,
                }
              );
            }

            if (featureId !== undefined) {
              selectedStateId = featureId;

              map.current?.setFeatureState(
                {
                  source: "colombia",
                  id: selectedStateId,
                },
                {
                  selected: true,
                }
              );
            }

            if (!shapeID) return;

            setSelectedLocationId(shapeID);

            const { data: fetchedData } = await supabase
              .from("territories")
              .select("*")
              .eq("shape_id", shapeID);

            const territory =
              fetchedData && fetchedData.length > 0
                ? fetchedData[0]
                : null;

            const popup = new mapboxgl.Popup({
              closeButton: false,
              className: "intel-popup",
              maxWidth: "220px",
            })
              .setLngLat(e.lngLat)
              .setHTML(createPopupHTML(territory))
              .addTo(map.current!);

            setActivePopup(popup);

            popup.on("close", () => {
              setActivePopup(null);
            });
          });

          layersAdded.current = true;

          console.log("MapContainer: Layers added successfully");

          updateMapColors(territorialData);
        } catch (error) {
          console.error("Error creating source/layers:", error);
        }
      };

      mapInstance.on("load", () => {
        console.log("MapContainer: load event");
        addMapLayers();
      });

      mapInstance.on("idle", () => {
        console.log("MapContainer: idle event");
      });

      setTimeout(() => {
        map.current?.resize();
      }, 300);
    } catch (err) {
      console.error("Failed to construct mapboxgl.Map:", err);
    }

    return () => {
      layersAdded.current = false;

      map.current?.remove();

      map.current = null;

      setMapInstance(null);
      setActivePopup(null);
    };
  }, []);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-[--color-panel-border] bg-[--color-surface]">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}

export function createPopupHTML(data: any) {
  const popupContent = data ? `
        <div style="font-size: 8px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 6px;">Análisis territorial</div>
        <div style="font-size: 16px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 12px; line-height: 1.2;">${data.name}</div>
        <div style="height:1px; background: var(--color-panel-border); margin-bottom: 12px;"></div>
        <div style="margin-bottom: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
                <span style="font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-cepeda);">Cepeda</span>
                <span style="font-size: 11px; font-weight: 600; color: var(--color-text-primary);">${data.favorabilidad_cepeda}%</span>
            </div>
            <div style="height: 4px; border-radius: 2px; background: var(--color-panel-border);">
                <div style="height: 100%; width: ${data.favorabilidad_cepeda}%; border-radius: 2px; background: var(--color-cepeda);"></div>
            </div>
        </div>
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
                <span style="font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-espriella);">Espriella</span>
                <span style="font-size: 11px; font-weight: 600; color: var(--color-text-primary);">${data.favorabilidad_espriella}%</span>
            </div>
            <div style="height: 4px; border-radius: 2px; background: var(--color-panel-border);">
                <div style="height: 100%; width: ${data.favorabilidad_espriella}%; border-radius: 2px; background: var(--color-espriella);"></div>
            </div>
        </div>
    ` : `
        <div style="font-size: 14px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 8px;">Región sin datos</div>
        <div style="font-size: 12px; color: var(--color-text-secondary);">Completa la información en el panel derecho para visualizar el análisis.</div>
    `;

  return `
      <div style="
        background: var(--color-surface);
        border: 1px solid var(--color-panel-border);
        border-radius: 12px;
        padding: 16px;
        font-family: 'Satoshi', sans-serif;
        box-shadow: var(--color-panel-shadow);
        min-width: 200px;
      ">
        ${popupContent}
      </div>
    `;
}
