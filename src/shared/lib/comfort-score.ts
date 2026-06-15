import type { User } from "@/shared/api/user";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** 기온 기준점수 — 적당할 때 가장 쾌적(70), 춥거나 더우면 40. */
export const TEMP_BASE_SCORE = { cold: 40, comfortable: 70, hot: 40 } as const;
export type TempBand = keyof typeof TEMP_BASE_SCORE;

/** 개인 체감온도(°C) → 기온 밴드. */
export function temperatureBand(feltTempC: number): TempBand {
  if (feltTempC <= 15) return "cold";
  if (feltTempC >= 27) return "hot";
  return "comfortable";
}

export type ComfortBreakdown = {
  /** 0~100, 높을수록 쾌적. */
  score: number;
  band: TempBand;
  base: number;
  /** 가감점 합 (수분+활동량+체형). */
  adjustment: number;
  ageMultiplier: number;
};

/**
 * 개인 쾌적 점수.
 *
 * 표 공식: `기온 기준점수 + (수분 + 활동량 + 체형) × 나이 배율`, 0~100 클램프.
 *
 * - `water_intake`(-8/0/+8)·`activity_level`(-5/+5/-10)·`body_type`(-10~+5)는
 *   온보딩에서 이미 환산된 가감점으로 저장돼 있어 그대로 합산한다.
 * - `age`는 나이 배율(0.8~1.5)로 저장돼 있어 가감점 합에만 곱한다
 *   (고령일수록 생활 요인의 영향이 증폭).
 * - 밴드(추움/적당/더움)는 개인 체감온도로 결정되므로 온보딩 체감 성향이 반영된다.
 *
 * @param feltTempC 개인 체감온도(personalFeltTemperature 결과)
 */
export function personalComfortScore(user: User | null, feltTempC: number): ComfortBreakdown {
  const band = temperatureBand(feltTempC);
  const base = TEMP_BASE_SCORE[band];

  const water = user?.water_intake ?? 0;
  const activity = user?.activity_level ?? 0;
  const body = user?.body_type ?? 0;
  const adjustment = water + activity + body;

  // age는 배율(0.8~1.5). 비정상값(0/누락)이면 중립 1로.
  const ageMultiplier = user?.age && user.age > 0 ? user.age : 1;

  const score = clamp(base + adjustment * ageMultiplier, 0, 100);
  return { score, band, base, adjustment, ageMultiplier };
}
