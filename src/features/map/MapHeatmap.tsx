import { useEffect, useRef } from "react";
import type { FeatureCollection, Point } from "geojson";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/mapbox-gl.css";

import {
  buildHeatmapData,
  DEFAULT_CENTER,
  LAYER_CONFIG,
  type InterestPlace,
  type LayerKey,
} from "./constants";
import { modulateByTime } from "./heatmap-builder";
import { applyScoresToHeatmap, type LayerScore } from "./personalization";
import { Skeleton } from "@/shared/ui/skeleton";

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

const buildSourceData = (
  geoJsonData: FeatureCollection<Point, { weight: number }> | undefined,
  activeLayer: LayerKey,
  timeOffset: number,
  layerScores: Record<LayerKey, LayerScore>,
) => {
  // 실측 데이터가 있으면 시간 모듈레이션을 입히고, 없으면 시뮬레이션 데이터로 폴백.
  const base = geoJsonData
    ? modulateByTime(geoJsonData, activeLayer, timeOffset)
    : buildHeatmapData(activeLayer, timeOffset);
  return applyScoresToHeatmap(base, activeLayer, layerScores);
};

const createMarkerElement = (place: InterestPlace) => {
  const el = document.createElement("div");
  const icon = document.createElement("span");
  const name = document.createElement("span");

  el.className =
    "flex h-8 min-w-8 items-center gap-1 rounded-full border border-black/10 bg-white px-2 text-xs font-medium text-app-black shadow-marker";
  icon.textContent = place.icon;
  name.textContent = place.name;
  el.append(icon, name);

  return el;
};

const createCurrentLocationElement = () => {
  const el = document.createElement("div");
  const icon = document.createElement("span");
  const name = document.createElement("span");

  el.className =
    "flex h-8 min-w-8 items-center gap-1 rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground shadow-marker-active";
  icon.textContent = "📍";
  name.textContent = "현재 위치";
  el.append(icon, name);

  return el;
};

type MapHeatmapProps = {
  activeLayer: LayerKey;
  timeOffset: number;
  opacity: number;
  interestPlaces: InterestPlace[];
  layerScores: Record<LayerKey, LayerScore>;
  geoJsonData?: FeatureCollection<Point, { weight: number }>;
  userCoords?: [number, number] | null;
  locating?: boolean;
};

export default function MapHeatmap({
  activeLayer,
  timeOffset,
  opacity,
  interestPlaces,
  layerScores,
  geoJsonData,
  userCoords,
  locating = false,
}: MapHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentMarkerRef = useRef<mapboxgl.Marker | null>(null);
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
        data: buildSourceData(geoJsonData, activeLayer, timeOffset, layerScores),
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

      interestPlaces.forEach((place) => {
        const marker = new mapboxgl.Marker({
          element: createMarkerElement(place),
          anchor: "bottom",
        })
          .setLngLat(place.coordinates)
          .addTo(map);
        markersRef.current.push(marker);
      });

      loadedRef.current = true;
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      currentMarkerRef.current?.remove();
      currentMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
    };
    // Initial map setup only; subsequent prop changes are handled by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) {
      return;
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    interestPlaces.forEach((place) => {
      const marker = new mapboxgl.Marker({ element: createMarkerElement(place), anchor: "bottom" })
        .setLngLat(place.coordinates)
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [interestPlaces]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) {
      return;
    }
    const source = map.getSource(heatmapSourceId) as mapboxgl.GeoJSONSource | undefined;
    source?.setData(buildSourceData(geoJsonData, activeLayer, timeOffset, layerScores));
    map.setPaintProperty(
      heatmapLayerId,
      "heatmap-color",
      buildRampExpression(LAYER_CONFIG[activeLayer].ramp),
    );
  }, [activeLayer, geoJsonData, layerScores, timeOffset]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) {
      return;
    }
    map.setPaintProperty(heatmapLayerId, "heatmap-opacity", opacity);
  }, [opacity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userCoords) {
      return;
    }

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setLngLat(userCoords);
    } else {
      currentMarkerRef.current = new mapboxgl.Marker({
        element: createCurrentLocationElement(),
        anchor: "bottom",
      })
        .setLngLat(userCoords)
        .addTo(map);
    }

    map.flyTo({ center: userCoords, zoom: 12, essential: true });
  }, [userCoords]);

  return (
    <div className="relative min-h-80 flex-1 overflow-hidden bg-[linear-gradient(114.4deg,color-mix(in_srgb,var(--primary)_5%,transparent)_0%,color-mix(in_srgb,var(--primary)_10%,transparent)_50%,color-mix(in_srgb,var(--primary)_5%,transparent)_100%)]">
      <div ref={mapContainerRef} data-heatmap="true" className="h-full w-full" />
      {locating ? (
        <div className="absolute inset-0 z-10 flex flex-col gap-3 bg-white/60 p-4 backdrop-blur-sm">
          <Skeleton className="h-full w-full" />
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-dark shadow-marker">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            현재 위치를 불러오는 중…
          </div>
        </div>
      ) : null}
    </div>
  );
}
