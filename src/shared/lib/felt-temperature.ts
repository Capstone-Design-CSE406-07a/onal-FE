import {
  interpolateTempScore,
  type TemperaturePreference,
  type TempScaleValue,
} from "./temperature-interpolation";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** 0~10 척도 값을 0~1로 정규화 (중립 = 0.5). */
const norm10 = (value: number | null | undefined) =>
  value == null ? 0.5 : clamp(value, 0, 10) / 10;

const clampScale = (value: number | null | undefined): TempScaleValue =>
  clamp(Math.round(value ?? 4), 1, 7) as TempScaleValue;

/**
 * 기상학적 체감온도 (Steadman 호주식 Apparent Temperature).
 *
 * 기온·습도·풍속을 모두 반영하며 더위/추위 전 구간에서 자연스럽게 동작한다.
 *   AT = Ta + 0.33·e − 0.70·ws − 4.00
 *   e(수증기압, hPa) = (RH/100)·6.105·exp(17.27·Ta / (237.7 + Ta))
 *
 * @param tempC       기온 (°C)
 * @param humidityPct 상대습도 (%)
 * @param windMs      풍속 (m/s)
 */
export function apparentTemperature(tempC: number, humidityPct: number, windMs: number): number {
  const rh = clamp(humidityPct, 0, 100);
  const wind = Math.max(0, windMs);
  const e = (rh / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  return tempC + 0.33 * e - 0.7 * wind - 4.0;
}

export type FeltTemperatureProfile = {
  /** 온보딩에서 0/10/20/30°C 기준으로 측정한 체감 성향 (1=매우 춥게, 7=매우 덥게) */
  felt_temperature_0: number;
  felt_temperature_10: number;
  felt_temperature_20: number;
  felt_temperature_30: number;
  /** 0~10 척도 */
  water_intake: number;
  body_type: number;
  age: number;
  activity_level: number;
};

/** 척도(1~7) 중립 기준값. 4 = "평균적인 사람과 동일하게 느낌". */
const NEUTRAL_SCALE = 4;
/** 척도 1칸당 체감 보정 폭 (°C). 7(완전 더위민감) → +6°C, 1(완전 추위민감) → −6°C. */
const SENSITIVITY_C_PER_STEP = 2;
/** 활동량 보정 계수 — 활동량↑ → 체열 발생 → 더 덥게. (full 활동 ±1.5°C) */
const K_ACTIVITY = 3;
/** 체격 보정 계수 — 체격↑ → 보온/대사 → 더 덥게. (±1°C) */
const K_BODY = 2;
/** 수분 보정 계수 — 더위에서 수분↓ → 체온조절 저하 → 더 덥게. (탈수 시 +2°C) */
const K_WATER = 4;
/** 연령 보정 계수 — 연령↑ → 온도 민감도 증폭 (편차의 ±25%). */
const K_AGE = 0.5;
/** 수분 보정이 적용되기 시작하는 체감온도 임계값 (이 이상이면 더위 스트레스 구간). */
const HEAT_STRESS_THRESHOLD = 22;

/**
 * 개인 맞춤 체감온도.
 *
 * 1) 기상학적 체감온도(apparentTempC)를 기준으로
 * 2) 온보딩 성향(felt_temperature_*) + 생활 지표(수분/체격/연령/활동량)를 반영해
 *    "이 사람이 실제로 몇 °C처럼 느끼는지"를 계산한다.
 *
 * @param apparentTempC 기상학적 체감온도 (apparentTemperature 결과)
 * @param profile       사용자 프로필
 * @returns 개인 체감온도 (°C, 소수 첫째 자리)
 */
export function personalFeltTemperature(
  apparentTempC: number,
  profile: FeltTemperatureProfile,
): number {
  const preference: TemperaturePreference = {
    0: clampScale(profile.felt_temperature_0),
    10: clampScale(profile.felt_temperature_10),
    20: clampScale(profile.felt_temperature_20),
    30: clampScale(profile.felt_temperature_30),
  };

  // interpolateTempScore: 체감 성향을 0~100 점수로 보간 → 1~7 척도로 환원
  const score = interpolateTempScore(preference, apparentTempC);
  const scaleAtTemp = 1 + (score / 100) * 6;

  const activity = norm10(profile.activity_level);
  const body = norm10(profile.body_type);
  const water = norm10(profile.water_intake);
  const age = norm10(profile.age);

  // 성향 편차: 4보다 크면 "더 덥게", 작으면 "더 춥게" 느낀다.
  let offset = (scaleAtTemp - NEUTRAL_SCALE) * SENSITIVITY_C_PER_STEP;

  // 활동량·체격: 항상 체감을 끌어올림(더 덥게)
  offset += (activity - 0.5) * K_ACTIVITY;
  offset += (body - 0.5) * K_BODY;

  // 수분: 더위 스트레스 구간에서만, 수분이 적을수록 더 덥게
  if (apparentTempC >= HEAT_STRESS_THRESHOLD) {
    offset += (0.5 - water) * K_WATER;
  }

  // 연령: 편차(더위든 추위든)를 증폭/완화
  offset *= 1 + (age - 0.5) * K_AGE;

  return Math.round((apparentTempC + offset) * 10) / 10;
}
