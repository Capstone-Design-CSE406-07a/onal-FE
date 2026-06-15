import { useEffect, useRef, useState } from "react";
import type { FeatureCollection, Point } from "geojson";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/mapbox-gl.css";

import { Skeleton } from "@/shared/ui/skeleton";

import { MapLegend } from "./components/map-legend";
import { DEFAULT_CENTER, LAYER_CONFIG, type InterestPlace, type LayerKey } from "./constants";
import { modulateByTime } from "./heatmap-builder";

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

// 색을 점 밀도가 아니라 "실제 값(weight)"에 직접 매핑한다.
// → 지역별 값 차이(예: 기온)가 색 차이로 드러나고, 값이 낮아도 묻히지 않는다.
const buildColorByValue = (ramp: Array<[number, string]>): mapboxgl.Expression => {
  const expr: unknown[] = ["interpolate", ["linear"], ["get", "weight"]];
  ramp.forEach(([stop, color]) => {
    expr.push(stop, color);
  });
  return expr as mapboxgl.Expression;
};

// 모든 레이어가 전국 250개 시군구 데이터를 쓰므로 반경을 통일한다.
// 점이 작아 흩뿌려져 보이지 않도록 충분히 키워 면처럼 보이게 한다.
const radiusByZoom = (): mapboxgl.Expression =>
  ["interpolate", ["linear"], ["zoom"], 6, 18, 9, 40, 11, 64, 13, 100] as mapboxgl.Expression;

const EMPTY_FEATURE_COLLECTION: FeatureCollection<Point, { weight: number }> = {
  type: "FeatureCollection",
  features: [],
};

const buildSourceData = (
  geoJsonData: FeatureCollection<Point, { weight: number }> | undefined,
  activeLayer: LayerKey,
  timeOffset: number,
) => {
  // 실측 데이터가 준비되면 시간 모듈레이션을 입히고, 아직 없으면 빈 레이어를 둔다.
  // (가짜 시뮬레이션 폴백 제거 — 로딩 중엔 상위에서 로딩 화면을 덮는다.)
  if (geoJsonData != null && geoJsonData.features.length > 0) {
    return modulateByTime(geoJsonData, activeLayer, timeOffset);
  }

  return EMPTY_FEATURE_COLLECTION;
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
  geoJsonData?: FeatureCollection<Point, { weight: number }>;
  userCoords?: [number, number] | null;
  locating?: boolean;
  dataLoading?: boolean;
};

export default function MapHeatmap({
  activeLayer,
  timeOffset,
  opacity,
  interestPlaces,
  geoJsonData,
  userCoords,
  locating = false,
  dataLoading = false,
}: MapHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const loadedRef = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);

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
      // 동(洞) 라벨이 나오는 수준 이상으로는 확대 금지 — 시군구 단위 히트맵이
      // 점처럼 깨져 보이지 않도록 제한.
      maxZoom: 13,
      maxBounds: koreaBounds,
      attributionControl: false,
      // 범례를 우측 상단에 띄우므로 로고는 좌측 하단으로 비켜둔다.
      logoPosition: "bottom-left",
    });

    mapRef.current = map;

    map.on("load", () => {
      applyKoreanLabels(map);
      map.addSource(heatmapSourceId, {
        type: "geojson",
        data: buildSourceData(geoJsonData, activeLayer, timeOffset),
      });
      map.addLayer({
        id: heatmapLayerId,
        type: "circle",
        source: heatmapSourceId,
        paint: {
          // 색 = 실제 값(weight). 반경을 크게 + blur 로 부드럽게 면처럼 칠한다.
          "circle-radius": radiusByZoom(),
          "circle-color": buildColorByValue(LAYER_CONFIG[activeLayer].ramp),
          "circle-blur": 1,
          "circle-opacity": opacity,
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
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      currentMarkerRef.current?.remove();
      currentMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
      setMapLoaded(false);
    };
    // Initial map setup only; subsequent prop changes are handled by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) {
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
  }, [interestPlaces, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) {
      return;
    }
    const source = map.getSource(heatmapSourceId) as mapboxgl.GeoJSONSource | undefined;
    source?.setData(buildSourceData(geoJsonData, activeLayer, timeOffset));
    map.setPaintProperty(
      heatmapLayerId,
      "circle-color",
      buildColorByValue(LAYER_CONFIG[activeLayer].ramp),
    );
    map.setPaintProperty(heatmapLayerId, "circle-radius", radiusByZoom());
  }, [activeLayer, geoJsonData, timeOffset, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) {
      return;
    }
    map.setPaintProperty(heatmapLayerId, "circle-opacity", opacity);
  }, [opacity, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !userCoords) {
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
  }, [userCoords, mapLoaded]);

  return (
    <div className="relative min-h-80 flex-1 overflow-hidden bg-[linear-gradient(114.4deg,color-mix(in_srgb,var(--primary)_5%,transparent)_0%,color-mix(in_srgb,var(--primary)_10%,transparent)_50%,color-mix(in_srgb,var(--primary)_5%,transparent)_100%)]">
      <div ref={mapContainerRef} data-heatmap="true" className="h-full w-full" />
      <MapLegend activeLayer={activeLayer} />
      {locating || dataLoading ? (
        <div className="absolute inset-0 z-10 flex flex-col gap-3 bg-white/60 p-4 backdrop-blur-sm">
          <Skeleton className="h-full w-full" />
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-dark shadow-marker">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            {locating ? "현재 위치를 불러오는 중…" : "날씨 데이터를 불러오는 중…"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
