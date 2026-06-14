import type { FeatureCollection, Point } from "geojson";

import type { User } from "@/shared/api/user";
import { apparentTemperature, personalFeltTemperature } from "@/shared/lib/felt-temperature";

import { compositeHazard, heatHazard, rainHazard, uvHazard } from "./composite-risk";
import type { InterestPlace, LayerKey } from "./constants";

type FavoritePlace = User["favorite_place"][number];

export type LayerScore = {
  score: number;
  label: "낮음" | "보통" | "주의" | "위험";
  headline: string;
  detail: string;
};

export type PersonalizedMapData = {
  currentDong: string;
  metrics: {
    airQuality: number;
    /** 실제 기온 (°C) */
    temperature: number;
    /** 기상학적 체감온도 — 기온+습도+풍속 (°C) */
    apparentTemp: number;
    /** 개인 맞춤 체감온도 — 성향·생활지표 반영 (°C) */
    personalFeltTemp: number;
    uvIndex: number;
    rainAmount: number;
  };
  layerScores: Record<LayerKey, LayerScore>;
  primaryAlert: LayerScore;
};

const FALLBACK_DONG = "서울시 강남구";
const FALLBACK_COORDINATES: [number, number] = [127.0276, 37.4979];

const DONG_COORDINATES: Record<string, [number, number]> = {
  "서울시 강남구": [127.0473, 37.5172],
  "서울시 서초구": [127.0324, 37.4837],
  "수원시 영통구": [127.0465, 37.2596],
  강남구: [127.0473, 37.5172],
  서초구: [127.0324, 37.4837],
  영통구: [127.0465, 37.2596],
  역삼동: [127.0365, 37.5007],
};

const PLACE_ICON: Record<string, string> = {
  집: "🏠",
  회사: "🏢",
  학교: "🎓",
  공원: "🌳",
  헬스장: "💪",
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const normalizeTenPoint = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return 0.5;
  }
  return clamp(value, 0, 10) / 10;
};

const toLabel = (score: number): LayerScore["label"] => {
  if (score >= 75) return "위험";
  if (score >= 55) return "주의";
  if (score >= 35) return "보통";
  return "낮음";
};

const makeScore = (score: number, headline: string, detail: string): LayerScore => ({
  score: Math.round(clamp(score)),
  label: toLabel(score),
  headline,
  detail,
});

const getCoordinates = (dong: string, index: number): [number, number] => {
  const matchedKey = Object.keys(DONG_COORDINATES).find((key) => dong.includes(key));
  const [lng, lat] = matchedKey ? DONG_COORDINATES[matchedKey] : FALLBACK_COORDINATES;

  return [lng + index * 0.012, lat + index * 0.008];
};

const isNearActivityTime = (user: User | null, timeOffset: number) => {
  if (!user?.activity_time.length) return false;

  const now = new Date();
  const targetMinutes = now.getHours() * 60 + now.getMinutes() + timeOffset * 60;

  return user.activity_time.some(({ time }) => {
    const [hour, minute] = time.split(":").map(Number);
    const activityMinutes = hour * 60 + minute;
    const diff = Math.abs(((((targetMinutes - activityMinutes) % 1440) + 2160) % 1440) - 720);
    return diff <= 90;
  });
};

export function buildInterestPlacesFromUser(user: User | null): InterestPlace[] {
  const favorites: FavoritePlace[] = user?.favorite_place ?? [];

  return favorites.map((place, index) => ({
    id: `${place.name}-${place.dong}-${index}`,
    name: place.name,
    dong: place.dong,
    coordinates: getCoordinates(place.dong, index),
    icon: PLACE_ICON[place.name] ?? "📍",
  }));
}

export type WeatherInput = {
  aqiIndex?: number;
  temperature?: number;
  humidity?: number;
  windMs?: number;
  precipForm?: string;
  uvIndex?: number;
  rainMm?: number;
};

export function buildPersonalizedMapData(
  user: User | null,
  timeOffset: number,
  weather?: WeatherInput,
): PersonalizedMapData {
  const hour = new Date().getHours() + timeOffset;
  const dayCycle = 0.5 + 0.5 * Math.sin(((hour - 8) / 24) * Math.PI * 2);
  const commuteBoost = isNearActivityTime(user, timeOffset) ? 12 : 0;
  const hasRespiratory = user?.sensivity.includes("천식/호흡기") ?? false;
  const hasSensitiveAge =
    user?.sensivity.some((value) => value === "영유아동반" || value === "노인") ?? false;

  const airQuality =
    weather?.aqiIndex !== undefined
      ? Math.round(((weather.aqiIndex - 1) / 3) * 87 + 8)
      : Math.round(clamp(38 + dayCycle * 18 + commuteBoost * 0.5, 8, 95));
  const temperature =
    weather?.temperature !== undefined
      ? weather.temperature
      : Math.round((15 + dayCycle * 9 + timeOffset * 0.15) * 10) / 10;
  const humidity = weather?.humidity ?? 55;
  const windMs = weather?.windMs ?? 1.5;
  const uvIndex =
    weather?.uvIndex !== undefined
      ? weather.uvIndex
      : Math.round(clamp(2 + dayCycle * 6, 0, 11) * 10) / 10;
  const rainAmount =
    weather?.rainMm !== undefined && !isNaN(weather.rainMm)
      ? weather.rainMm
      : Math.round(clamp(0.8 + (1 - dayCycle) * 3.5, 0, 20) * 10) / 10;

  // 체감온도 2단계: 기상학적 체감온도 → 개인 맞춤 체감온도
  const apparentTempRaw = apparentTemperature(temperature, humidity, windMs);
  const personalFeltRaw = user ? personalFeltTemperature(apparentTempRaw, user) : apparentTempRaw;
  const apparentTemp = Math.round(apparentTempRaw * 10) / 10;
  const personalFeltTemp = Math.round(personalFeltRaw * 10) / 10;

  // 0~1 해저드 (복합 위험도와 히트맵이 공유하는 정규화 기준)
  const airLevel = clamp(airQuality, 0, 100) / 100;
  const heatLevel = heatHazard(temperature, humidity, windMs);
  const uvLevel = uvHazard(uvIndex);
  const rainLevel = rainHazard(
    weather?.precipForm ?? (rainAmount > 0 ? "1" : "0"),
    rainAmount,
  );

  const activity = normalizeTenPoint(user?.activity_level);
  const waterRisk = 1 - normalizeTenPoint(user?.water_intake);
  const bodyRisk = normalizeTenPoint(user?.body_type);
  const ageRisk = normalizeTenPoint(user?.age);

  const air = makeScore(
    airLevel * 78 + (hasRespiratory ? 22 : 0) + (hasSensitiveAge ? 10 : 0) + activity * 8,
    "오늘 오후 미세먼지 주의",
    hasRespiratory
      ? "호흡기 민감군 기준으로 대기질 위험도를 높게 반영했어요."
      : "현재 활동량과 대기질을 함께 반영했어요.",
  );
  const temp = makeScore(
    heatLevel * 70 + waterRisk * 10 + bodyRisk * 8 + activity * 8 + (hasSensitiveAge ? 6 : 0),
    personalFeltTemp >= temperature ? "더위 체감 주의" : "추위 체감 주의",
    `기온 ${temperature}°C · 체감온도 ${apparentTemp}°C → 내 체감 ${personalFeltTemp}°C로 느껴요.`,
  );
  const uv = makeScore(
    uvLevel * 80 + activity * 12 + waterRisk * 8 + (hasSensitiveAge ? 8 : 0),
    "자외선 노출 관리 필요",
    "활동량과 수분 섭취 점수를 자외선 위험도에 반영했어요.",
  );
  const rain = makeScore(
    rainLevel * 70 + commuteBoost + activity * 8,
    "이동 시간대 강수 확인",
    commuteBoost > 0
      ? "등록한 활동 시간과 가까워 강수 위험도를 높였어요."
      : "현재 강수 가능성과 활동량을 함께 봤어요.",
  );

  // 복합 위험도 = 4개 해저드 가중합(히트맵과 동일) + 개인 민감도 보정
  const baseRisk = compositeHazard({
    air: airLevel,
    heat: heatLevel,
    rain: rainLevel,
    uv: uvLevel,
  });
  const sensitivityBoost =
    (hasRespiratory ? 8 : 0) + (hasSensitiveAge ? 8 : 0) + ageRisk * 6 + commuteBoost * 0.3;
  const risk = makeScore(
    baseRisk * 100 + sensitivityBoost,
    "복합 위험도 확인",
    "대기질·체감온도·강수·자외선을 개인 민감도와 합산한 점수예요.",
  );

  const layerScores = { air, temp, uv, rain, risk };
  const primaryAlert = Object.values(layerScores).reduce((highest, current) =>
    current.score > highest.score ? current : highest,
  );

  return {
    currentDong: user?.favorite_place?.[0]?.dong ?? FALLBACK_DONG,
    metrics: { airQuality, temperature, apparentTemp, personalFeltTemp, uvIndex, rainAmount },
    layerScores,
    primaryAlert,
  };
}

export function applyScoresToHeatmap(
  data: FeatureCollection<Point, { weight: number }>,
  activeLayer: LayerKey,
  layerScores: Record<LayerKey, LayerScore>,
): FeatureCollection<Point, { weight: number }> {
  const layerWeight = layerScores[activeLayer].score / 65;

  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      properties: {
        weight: clamp((feature.properties?.weight ?? 0.3) * (0.55 + layerWeight), 0.05, 1),
      },
    })),
  };
}
