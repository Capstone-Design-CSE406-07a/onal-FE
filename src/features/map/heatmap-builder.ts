import type { FeatureCollection, Point } from "geojson";

import type {
  PmNationwideItem,
  TempWindNationwideItem,
  UvNationwideItem,
} from "@/shared/api/weather";

import type { User } from "@/shared/api/user";
import {
  apparentTemperature,
  type FeltTemperaturePreference,
  personalFeltTemperature,
} from "@/shared/lib/felt-temperature";

import {
  airHazard,
  compositeHazard,
  personalHeatHazard,
  rainHazard,
  uvHazard,
} from "./composite-risk";
import type { LayerKey } from "./constants";
import { REGION_COORDS } from "./region-coords";

// deterministic scatter within sigungu — keeps same dong at same offset across re-renders
function dongOffset(dong: string): [number, number] {
  let h = 0;
  for (let i = 0; i < dong.length; i++) {
    h = (h * 31 + dong.charCodeAt(i)) & 0xffffff;
  }
  return [((h & 0xff) - 128) / 25000, (((h >> 8) & 0xff) - 128) / 25000];
}

// 백엔드 sido 표기가 축약형("서울")으로 와도 사전 키("서울특별시")와 매칭되도록 정규화.
const SIDO_ALIASES: Record<string, string> = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  세종: "세종특별자치시",
  경기: "경기도",
  강원: "강원특별자치도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전북특별자치도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};

function normalizeRegionPart(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

const REGION_COORDS_NORMALIZED: Record<string, [number, number]> = Object.fromEntries(
  Object.entries(REGION_COORDS).map(([key, value]) => [normalizeRegionPart(key), value]),
);

function lookupSigunguCoords(sido: string, sigungu: string): [number, number] | undefined {
  const s = sido.trim();
  const g = sigungu.trim();
  const canonicalSido = SIDO_ALIASES[s] ?? s;
  const exactKey = `${s}_${g}`;
  const canonicalKey = `${canonicalSido}_${g}`;
  const normalizedExactKey = normalizeRegionPart(exactKey);
  const normalizedCanonicalKey = normalizeRegionPart(canonicalKey);

  return (
    REGION_COORDS[exactKey] ??
    REGION_COORDS[canonicalKey] ??
    REGION_COORDS_NORMALIZED[normalizedExactKey] ??
    REGION_COORDS_NORMALIZED[normalizedCanonicalKey]
  );
}

function buildFeatures<T extends { sido: string; sigungu: string; dong: string }>(
  items: T[],
  weightFn: (item: T) => number,
): FeatureCollection<Point, { weight: number }>["features"] {
  return items.flatMap((item) => {
    const base = lookupSigunguCoords(item.sido, item.sigungu);
    if (!base) return [];
    const [dLng, dLat] = dongOffset(item.dong);
    return [
      {
        type: "Feature" as const,
        properties: { weight: weightFn(item) },
        geometry: { type: "Point" as const, coordinates: [base[0] + dLng, base[1] + dLat] },
      },
    ];
  });
}

function toGeoJson(
  features: FeatureCollection<Point, { weight: number }>["features"],
): FeatureCollection<Point, { weight: number }> {
  return { type: "FeatureCollection", features };
}

// KMA는 관측 결측을 -999 / -998.9 같은 음수 센티넬로 내려보낸다(예: 옹진군 도서지역).
// 그대로 계산에 넣으면 체감온도·위험도가 엉뚱하게 튀므로, 파싱 단계에서 null 처리한다.
const KMA_SENTINEL_MAX = -90;
function parseKmaNumber(raw: string, unit: string): number | null {
  const n = parseFloat(raw.replace(unit, ""));
  return Number.isNaN(n) || n <= KMA_SENTINEL_MAX ? null : n;
}

export function buildPmHeatmap(
  data: PmNationwideItem[],
): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(
    buildFeatures(data, (item) => {
      const idx = parseInt(item.통합대기환경지수, 10);
      return isNaN(idx) ? 0 : Math.min(1, (idx - 1) / 3);
    }),
  );
}

export function buildTempHeatmap(
  data: TempWindNationwideItem[],
  preference?: FeltTemperaturePreference,
): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(
    buildFeatures(
      // 결측 격자는 아예 점을 찍지 않는다(0으로 칠하면 가짜 한파 지점이 생김).
      data.filter((item) => parseKmaNumber(item.기온, "°C") !== null),
      // weight = 개인 체감온도/40. 실제 기온이 아니라 ① 기상학적 체감(기온+습도+풍속)에
      // ② 온보딩 체감 성향(felt_temperature_*)을 입힌 "내가 느끼는 온도"로 칠한다.
      // 색 스톱(constants의 temp.ramp)이 체감 °C에 맞춰 배치돼 있어, 같은 25°C라도
      // 더위에 민감한 사용자는 주황 쪽으로 더 진하게 보인다.
      (item) => {
        const tempC = parseKmaNumber(item.기온, "°C")!;
        const humidity = parseKmaNumber(item.습도, "%") ?? 55;
        const wind = parseKmaNumber(item.풍속, "m/s") ?? 1;
        const apparent = apparentTemperature(tempC, humidity, wind);
        const felt = preference ? personalFeltTemperature(apparent, preference) : apparent;
        return Math.min(1, Math.max(0, felt / 40));
      },
    ),
  );
}

export function buildUvHeatmap(
  data: UvNationwideItem[],
): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(buildFeatures(data, (item) => Math.min(1, item.uv / 11)));
}

export function buildRainHeatmap(
  data: TempWindNationwideItem[],
): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(
    buildFeatures(
      data.filter((item) => parseKmaNumber(item.기온, "°C") !== null),
      (item) => {
        if (item.강수형태 === "0") return 0;
        const mm = parseKmaNumber(item["1시간강수량"], "mm");
        return mm === null ? 0.4 : Math.min(1, mm / 10 + 0.4);
      },
    ),
  );
}

export function buildRiskHeatmap(
  pmData: PmNationwideItem[],
  tempWindData: TempWindNationwideItem[],
  uvData: UvNationwideItem[],
  // 로그인·온보딩 완료 사용자면 종합 쾌적 점수로 heat 항을 개인화한다(없으면 일반식 fallback).
  user?: User | null,
): FeatureCollection<Point, { weight: number }> {
  const key = (i: { sido: string; sigungu: string; dong: string }) =>
    `${i.sido}_${i.sigungu}_${i.dong}`;
  const uvByKey = new Map(uvData.map((u) => [key(u), u.uv]));
  const tempByKey = new Map(tempWindData.map((t) => [key(t), t]));

  return toGeoJson(
    buildFeatures(pmData, (item) => {
      const tw = tempByKey.get(key(item));
      const air = airHazard(parseInt(item.통합대기환경지수, 10));
      // 센티넬(-999 등)이면 해당 요소를 무시(0/기본값)해 옹진군 같은 가짜 위험지점 방지.
      const t = tw ? parseKmaNumber(tw.기온, "°C") : null;
      const h = tw ? parseKmaNumber(tw.습도, "%") : null;
      const w = tw ? parseKmaNumber(tw.풍속, "m/s") : null;
      const heat = t !== null ? personalHeatHazard(t, h ?? 55, w ?? 1, user) : 0;
      const mm = tw ? parseKmaNumber(tw["1시간강수량"], "mm") : null;
      const rain = tw ? rainHazard(tw.강수형태, mm ?? 0) : 0;
      const uv = uvHazard(uvByKey.get(key(item)) ?? 0);
      return compositeHazard({ air, heat, rain, uv });
    }),
  );
}

/** 레이어별 일주기 피크 시각 (시뮬레이션용). */
const LAYER_PEAK_HOUR: Record<LayerKey, number> = {
  air: 8, // 출퇴근 시간대 대기질 악화
  temp: 15, // 한낮 최고 기온
  uv: 13, // 정오 자외선 최대
  rain: 16, // 오후 소나기 경향
  risk: 14,
};

/** 시각 h(0~24)에서의 일주기 강도 (0~1). */
function diurnal(hour: number, peak: number): number {
  return 0.5 + 0.5 * Math.cos((2 * Math.PI * (hour - peak)) / 24);
}

/**
 * 실측 스냅샷(현재값)에 시간대별 일주기 변화를 입힌다.
 * timeOffset === 0 이면 배율 1 → 원본 그대로, ±시간이면 시뮬레이션 예보.
 *
 * ⚠️ 기상청/에어코리아 nationwide API는 현재 시각 스냅샷만 제공하므로
 *    ±12시간 값은 실측이 아닌 일주기 패턴 기반 추정치다.
 */
export function modulateByTime(
  data: FeatureCollection<Point, { weight: number }>,
  layer: LayerKey,
  timeOffset: number,
): FeatureCollection<Point, { weight: number }> {
  if (timeOffset === 0) return data;

  const peak = LAYER_PEAK_HOUR[layer];
  const nowHour = new Date().getHours();
  const targetHour = (((nowHour + timeOffset) % 24) + 24) % 24;
  const base = 0.6 + 0.8 * diurnal(nowHour, peak);
  const target = 0.6 + 0.8 * diurnal(targetHour, peak);
  const factor = target / base;

  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      properties: {
        weight: Math.min(1, Math.max(0, (feature.properties?.weight ?? 0) * factor)),
      },
    })),
  };
}
