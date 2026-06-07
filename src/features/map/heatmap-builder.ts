import type { FeatureCollection, Point } from "geojson";

import type { PmDataResponse, TempertureWindResponse, UvDataResponse } from "@/shared/api";

import type { NationwideWeatherData } from "./hooks/use-nationwide-weather-data";
import type { NearbyWeatherData } from "./hooks/use-nearby-weather-data";
import type { LayerKey } from "./constants";

export type HeatmapWeatherData = {
  pm: PmDataResponse | null;
  tempWind: TempertureWindResponse | null;
  uv: UvDataResponse | null;
};

type UrbanCluster = {
  coords: [number, number];
  sido: string;
  sigungu: string;
  density: number;
};

const URBAN_CLUSTERS: UrbanCluster[] = [
  { coords: [126.978, 37.5665], sido: "서울특별시", sigungu: "종로구", density: 1.0 },
  { coords: [126.924, 37.527], sido: "서울특별시", sigungu: "구로구", density: 0.88 },
  { coords: [127.028, 37.498], sido: "서울특별시", sigungu: "강남구", density: 0.92 },
  { coords: [127.082, 37.538], sido: "서울특별시", sigungu: "송파구", density: 0.78 },
  { coords: [126.868, 37.496], sido: "경기도", sigungu: "광명시", density: 0.82 },
  { coords: [126.776, 37.456], sido: "경기도", sigungu: "부천시", density: 0.72 },
  { coords: [126.92, 37.64], sido: "서울특별시", sigungu: "은평구", density: 0.65 },
  { coords: [127.06, 37.63], sido: "서울특별시", sigungu: "노원구", density: 0.6 },
  { coords: [127.14, 37.59], sido: "경기도", sigungu: "구리시", density: 0.55 },
  { coords: [127.15, 37.43], sido: "경기도", sigungu: "하남시", density: 0.73 },
  { coords: [126.902, 37.69], sido: "경기도", sigungu: "고양시", density: 0.5 },
  { coords: [127.005, 37.43], sido: "경기도", sigungu: "과천시", density: 0.67 },
  { coords: [126.72, 37.54], sido: "인천광역시", sigungu: "부평구", density: 0.58 },
  { coords: [127.2, 37.59], sido: "경기도", sigungu: "남양주시", density: 0.45 },
];

// nationwide 배열에서 sido+sigungu로 항목 찾기
function findEntry<T extends { sido: string; sigungu: string }>(
  items: T[],
  sido: string,
  sigungu: string,
): T | undefined {
  return items.find((item) => item.sido === sido && item.sigungu === sigungu);
}

// 클러스터마다 안정적인 fallback 변동값
function clusterVariation(index: number): number {
  return 0.65 + 0.35 * Math.abs(Math.sin(index * 1.618));
}

function normalizeWeight(layer: LayerKey, pm: PmDataResponse | null, tempWind: TempertureWindResponse | null, uv: UvDataResponse | null): number {
  switch (layer) {
    case "air": {
      const pm25W = Math.min(1, parseFloat(pm?.미세먼지 ?? "0") / 150);
      const pm10W = Math.min(1, parseFloat(pm?.초미세먼지 ?? "0") / 75); // 75μg/m³ = 매우나쁨
      // 통합대기환경지수: '1'=좋음 '2'=보통 '3'=나쁨 '4'=매우나쁨
      const caiMap: Record<string, number> = { "1": 0.15, "2": 0.45, "3": 0.75, "4": 1.0 };
      const caiW = caiMap[pm?.통합대기환경지수 ?? "1"] ?? 0.15;
      return Math.min(1, (pm25W + pm10W + caiW) / 3);
    }
    case "temp": {
      const val = parseFloat(tempWind?.기온 ?? "15");
      return Math.min(1, Math.max(0, (val + 10) / 50));
    }
    case "uv": {
      const val = uv?.uv ?? 0;
      return Math.min(1, val / 11);
    }
    case "rain": {
      const form = parseInt(tempWind?.강수형태 ?? "0");
      const amount = parseFloat(tempWind?.["1시간강수량"] ?? "0");
      const formWeight = form === 0 ? 0 : form <= 3 ? 0.6 : 0.3;
      return Math.min(1, formWeight + amount / 20);
    }
    case "risk": {
      const airW = normalizeWeight("air", pm, tempWind, uv);
      const tempW = normalizeWeight("temp", pm, tempWind, uv);
      const uvW = normalizeWeight("uv", pm, tempWind, uv);
      const rainW = normalizeWeight("rain", pm, tempWind, uv);
      return Math.min(1, (airW + tempW + uvW + rainW) / 4);
    }
    default:
      return 0;
  }
}

// nearby 항목 → 방향 정보가 없으므로 n등분 각도로 사용자 위치 주변에 배치
// 1 km ≈ 0.009 deg (위도), 경도는 위도 cos 보정
function nearbyItemsToPoints(
  userCenter: [number, number],
  nearby: NearbyWeatherData,
  layer: LayerKey,
  timeMod: number,
): Array<[number, number, number]> {
  const [userLng, userLat] = userCenter;
  const KM_TO_DEG_LAT = 0.009;
  const KM_TO_DEG_LNG = 0.009 / Math.cos((userLat * Math.PI) / 180);

  // 세 배열의 길이 중 최댓값 기준으로 인덱스 순회
  const len = Math.max(
    nearby.pm?.length ?? 0,
    nearby.tempWind?.length ?? 0,
    nearby.uv?.length ?? 0,
  );
  if (len === 0) return [];

  const points: Array<[number, number, number]> = [];

  for (let i = 0; i < len; i++) {
    const pmItem = nearby.pm?.[i] ?? null;
    const twItem = nearby.tempWind?.[i] ?? null;
    const uvItem = nearby.uv?.[i] ?? null;

    const distKm = pmItem?.distance ?? twItem?.distance ?? uvItem?.distance ?? 1;
    const angle = (2 * Math.PI * i) / len;

    const lat = userLat + distKm * KM_TO_DEG_LAT * Math.sin(angle);
    const lng = userLng + distKm * KM_TO_DEG_LNG * Math.cos(angle);

    const pmData: PmDataResponse | null = pmItem
      ? { 미세먼지: pmItem.미세먼지, 초미세먼지: pmItem.초미세먼지, 통합대기환경지수: pmItem.통합대기환경지수, 측정시간: pmItem.측정시간 }
      : null;
    const twData: TempertureWindResponse | null = twItem
      ? { 기온: twItem.기온, 풍속: twItem.풍속, 풍향: twItem.풍향, 습도: twItem.습도, '1시간강수량': twItem['1시간강수량'], 강수형태: twItem.강수형태 }
      : null;
    const uvData: UvDataResponse | null = uvItem ? { uv: uvItem.uv } : null;

    const raw = normalizeWeight(layer, pmData, twData, uvData);
    const weight = Math.min(1, Math.max(0, raw * timeMod));
    points.push([lng, lat, weight]);
  }

  return points;
}

// 포인트는 최소화 — Mapbox heatmap-density 누적 방지
// 비대칭 오프셋 3개로 자연스러운 blob 형태 유지
function generateClusterPoints(
  center: [number, number],
  weight: number,
): Array<[number, number, number]> {
  const [lng, lat] = center;
  const spread = 0.012;
  return [
    [lng, lat, weight],
    [lng + spread * 0.6, lat + spread * 0.2, weight * 0.7],
    [lng - spread * 0.4, lat - spread * 0.5, weight * 0.7],
    [lng + spread * 0.1, lat + spread * 0.65, weight * 0.6],
  ];
}

export function buildHeatmapDataFromApi(
  layer: LayerKey,
  userCenter: [number, number],
  localData: HeatmapWeatherData,
  nationwide: NationwideWeatherData | null,
  timeOffset: number,
  nearby: NearbyWeatherData | null = null,
): FeatureCollection<Point, { weight: number }> {
  const timeMod = 1 + 0.15 * Math.sin((timeOffset / 12) * Math.PI);

  const baseWeight = normalizeWeight(layer, localData.pm, localData.tempWind, localData.uv);
  const userWeight = Math.min(1, Math.max(0, baseWeight * timeMod));

  const allPoints: Array<[number, number, number]> = [];

  // 수도권 도심 클러스터 — nationwide 데이터로 각 지역 실제 값 사용
  URBAN_CLUSTERS.forEach((cluster, i) => {
    let clusterWeight: number;

    if (nationwide) {
      const pmEntry = findEntry(nationwide.pm, cluster.sido, cluster.sigungu);
      const twEntry = findEntry(nationwide.tempWind, cluster.sido, cluster.sigungu);
      const uvEntry = findEntry(nationwide.uv, cluster.sido, cluster.sigungu);

      if (pmEntry || twEntry || uvEntry) {
        const raw = normalizeWeight(layer, pmEntry ?? null, twEntry ?? null, uvEntry ?? null);
        clusterWeight = Math.min(1, Math.max(0, raw * timeMod));
      } else {
        clusterWeight = Math.min(1, userWeight * clusterVariation(i));
      }
    } else {
      // nationwide 로딩 전: 전 지역 균등 분포 (사용자 위치 과강조 방지)
      clusterWeight = Math.min(1, userWeight * clusterVariation(i));
    }

    allPoints.push(...generateClusterPoints(cluster.coords, clusterWeight));
  });

  // 인근 지역 실측 데이터 — 있으면 클러스터 기반 추정값보다 우선 반영
  if (nearby) {
    allPoints.push(...nearbyItemsToPoints(userCenter, nearby, layer, timeMod));
  }

  // 사용자 위치 — 클러스터와 동일한 크기로 추가 (위치가 클러스터 목록에 없을 경우 보완)
  allPoints.push(...generateClusterPoints(userCenter, userWeight));

  return {
    type: "FeatureCollection",
    features: allPoints.map(([pLng, pLat, w]) => ({
      type: "Feature",
      properties: { weight: w },
      geometry: { type: "Point", coordinates: [pLng, pLat] },
    })),
  };
}
