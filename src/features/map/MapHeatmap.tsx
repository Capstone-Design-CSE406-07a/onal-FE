import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import {
  buildHeatmapData,
  DEFAULT_CENTER,
  INTEREST_PLACES,
  LAYER_CONFIG,
  type LayerKey,
} from "./constants";

const heatmapSourceId = "heatmap-points";
const heatmapLayerId = "heatmap-layer";
const koreaBounds: mapboxgl.LngLatBoundsLike = [
  [124.5, 33.0],
  [132.0, 38.8],
];
const koreanLabel = [
  "coalesce",
  ["get", "name_ko"],
  ["get", "name_ko-KR"],
  ["get", "name"],
  ["get", "name_en"],
] as mapboxgl.Expression;

const applyKoreanLabels = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers ?? [];
  layers.forEach((layer) => {
    if (layer.type !== "symbol") {
      return;
    }
    const current = map.getLayoutProperty(layer.id, "text-field");
    if (!current) {
      return;
    }
    map.setLayoutProperty(layer.id, "text-field", koreanLabel);
  });
};

const buildRampExpression = (ramp: Array<[number, string]>): mapboxgl.Expression => {
  const expr: unknown[] = ["interpolate", ["linear"], ["heatmap-density"]];
  ramp.forEach(([stop, color]) => {
    expr.push(stop, color);
  });
  return expr as mapboxgl.Expression;
};

type MapHeatmapProps = {
  activeLayer: LayerKey;
  timeOffset: number;
  opacity: number;
};

export default function MapHeatmap({ activeLayer, timeOffset, opacity }: MapHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
    if (!token) {
      console.warn("VITE_MAPBOX_TOKEN is missing; Mapbox map is disabled.");
      return;
    }

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: DEFAULT_CENTER,
      zoom: 11,
      minZoom: 6,
      maxBounds: koreaBounds,
      attributionControl: false,
      logoPosition: "top-right",
    });

    mapRef.current = map;

    map.on("load", () => {
      applyKoreanLabels(map);
      map.addSource(heatmapSourceId, {
        type: "geojson",
        data: buildHeatmapData(activeLayer, timeOffset),
      });
      map.addLayer({
        id: heatmapLayerId,
        type: "heatmap",
        source: heatmapSourceId,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 12, 9, 36],
          "heatmap-opacity": opacity,
          "heatmap-color": buildRampExpression(LAYER_CONFIG[activeLayer].ramp),
        },
      });

      INTEREST_PLACES.forEach((place) => {
        const el = document.createElement("div");
        el.className =
          "flex h-8 min-w-8 items-center gap-1 rounded-full border border-black/10 bg-white px-2 text-xs font-medium text-[#0a0a0a] shadow-[0_1px_3px_rgba(0,0,0,0.12)]";
        el.innerHTML = `<span>${place.icon}</span><span>${place.name}</span>`;
        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(place.coordinates)
          .addTo(map);
        markersRef.current.push(marker);
      });

      loadedRef.current = true;
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 12,
            essential: true,
          });
        },
        () => {
          // ignore; keep default center
        },
        { enableHighAccuracy: false, timeout: 4000 },
      );
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
    };
    // Initial map setup only — subsequent prop changes are handled by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) {
      return;
    }
    const source = map.getSource(heatmapSourceId) as mapboxgl.GeoJSONSource | undefined;
    source?.setData(buildHeatmapData(activeLayer, timeOffset));
    map.setPaintProperty(
      heatmapLayerId,
      "heatmap-color",
      buildRampExpression(LAYER_CONFIG[activeLayer].ramp),
    );
  }, [activeLayer, timeOffset]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) {
      return;
    }
    map.setPaintProperty(heatmapLayerId, "heatmap-opacity", opacity);
  }, [opacity]);

  return (
    <div className="relative min-h-80 flex-1 overflow-hidden bg-[linear-gradient(114.4deg,rgba(190,211,238,0.05)_0%,rgba(190,211,238,0.1)_50%,rgba(190,211,238,0.05)_100%)]">
      <div ref={mapContainerRef} data-heatmap="true" className="h-full w-full" />
    </div>
  );
}
