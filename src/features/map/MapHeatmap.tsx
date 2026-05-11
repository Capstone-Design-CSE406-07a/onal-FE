import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { FeatureCollection, Point } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";

import { HeatmapLayer, MapSurface } from "./styles";

const defaultCenter = { lat: 37.4979, lng: 127.0276 };

const heatmapPoints = [
  { lat: 37.4979, lng: 127.0276, weight: 0.9 },
  { lat: 37.505, lng: 127.021, weight: 0.7 },
  { lat: 37.49, lng: 127.035, weight: 0.6 },
];

const heatmapGeoJson: FeatureCollection<Point, { weight: number }> = {
  type: "FeatureCollection",
  features: heatmapPoints.map((point) => ({
    type: "Feature",
    properties: { weight: point.weight },
    geometry: {
      type: "Point",
      coordinates: [point.lng, point.lat] as [number, number],
    },
  })),
};

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

export default function MapHeatmap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 11,
      minZoom: 6,
      maxBounds: koreaBounds,
      attributionControl: false,
      logoPosition: "top-right",
    });

    mapRef.current = map;

    map.on("load", () => {
      applyKoreanLabels(map);
      if (map.getSource(heatmapSourceId)) {
        return;
      }

      map.addSource(heatmapSourceId, {
        type: "geojson",
        data: heatmapGeoJson,
      });

      map.addLayer({
        id: heatmapLayerId,
        type: "heatmap",
        source: heatmapSourceId,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 12, 9, 36],
          "heatmap-opacity": 0.8,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 0, 0)",
            0.2,
            "rgba(190, 211, 238, 0.4)",
            0.5,
            "rgba(190, 211, 238, 0.7)",
            0.8,
            "rgba(190, 211, 238, 0.9)",
            1,
            "rgba(190, 211, 238, 1)",
          ],
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <MapSurface>
      <HeatmapLayer ref={mapContainerRef} data-heatmap="true" />
    </MapSurface>
  );
}
