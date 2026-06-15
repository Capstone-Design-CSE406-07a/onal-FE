import type { User } from "@/shared/api/user";
import { personalComfortScore } from "@/shared/lib/comfort-score";
import { apparentTemperature, personalFeltTemperature } from "@/shared/lib/felt-temperature";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * 복합 위험도 가중치. 합 = 1.
 * 대기질을 가장 크게, 그다음 열(더위/추위) 스트레스, 강수, 자외선 순.
 */
export const RISK_WEIGHTS = {
  air: 0.35,
  heat: 0.3,
  rain: 0.2,
  uv: 0.15,
} as const;

/** 쾌적 기준 체감온도 (°C). 이 값에서 멀어질수록 열 스트레스↑. */
const COMFORT_TEMP = 21;
/** 열 스트레스가 최대(1.0)에 도달하는 편차 폭 (°C). */
const HEAT_SPAN = 16;

/** 통합대기환경지수(1~4) → 0~1 위험도. */
export function airHazard(aqiIndex: number): number {
  return Number.isNaN(aqiIndex) ? 0 : clamp01((aqiIndex - 1) / 3);
}

/** 기온·습도·풍속 → 체감온도 기반 열 스트레스 0~1 (더위/추위 양방향). */
export function heatHazard(tempC: number, humidityPct: number, windMs: number): number {
  if (Number.isNaN(tempC)) return 0;
  const at = apparentTemperature(tempC, humidityPct, windMs);
  return clamp01(Math.abs(at - COMFORT_TEMP) / HEAT_SPAN);
}

/**
 * 개인화 열 스트레스 0~1.
 *
 * - user 없음: 기존 일반식 |AT − 21| / 16 (heatHazard와 동일, fallback).
 * - user 있음: 일반 열 스트레스와 종합 쾌적 점수(수분·체형·나이·활동량) 기반
 *   위험도를 50:50으로 블렌딩한다. 상단 요약 패널(personalization.ts)의
 *   temp 카드(heatLevel*45 + comfortRisk*45)와 동일한 비율이라 지도·카드가 일관된다.
 *
 * 밴드(추움/적당/더움)는 개인 체감온도로 결정되므로 같은 날씨라도 사용자별로 값이 달라진다.
 */
export function personalHeatHazard(
  tempC: number,
  humidityPct: number,
  windMs: number,
  user?: User | null,
): number {
  if (Number.isNaN(tempC)) return 0;
  const at = apparentTemperature(tempC, humidityPct, windMs);
  const generic = clamp01(Math.abs(at - COMFORT_TEMP) / HEAT_SPAN);
  if (!user) return generic;

  const felt = personalFeltTemperature(at, user); // 개인 체감온도
  const comfort = personalComfortScore(user, felt); // 종합 쾌적 점수 (0~100, 높을수록 쾌적)
  const comfortRisk = clamp01((100 - comfort.score) / 100); // 쾌적↑ → 위험↓
  return clamp01(0.5 * generic + 0.5 * comfortRisk);
}

/** 자외선 지수(0~11) → 0~1 위험도. */
export function uvHazard(uv: number): number {
  return clamp01(uv / 11);
}

/**
 * 강수 → 0~1 위험도.
 * @param precipForm 강수형태 코드 ("0" = 없음)
 * @param mm         1시간 강수량
 */
export function rainHazard(precipForm: string, mm: number): number {
  if (precipForm === "0") return 0;
  return Number.isNaN(mm) ? 0.4 : clamp01(mm / 10 + 0.4);
}

export type HazardLevels = {
  air: number;
  heat: number;
  rain: number;
  uv: number;
};

/** 0~1 해저드들을 가중합한 복합 위험도 (0~1). */
export function compositeHazard(hazards: HazardLevels): number {
  return (
    hazards.air * RISK_WEIGHTS.air +
    hazards.heat * RISK_WEIGHTS.heat +
    hazards.rain * RISK_WEIGHTS.rain +
    hazards.uv * RISK_WEIGHTS.uv
  );
}
