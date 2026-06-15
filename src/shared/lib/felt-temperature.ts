import {
  interpolateTempScore,
  type TemperaturePreference,
  type TempScaleValue,
} from "./temperature-interpolation";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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

export type FeltTemperaturePreference = {
  /** 온보딩에서 0/10/20/30°C 기준으로 측정한 체감 성향 (1=매우 춥게, 7=매우 덥게) */
  felt_temperature_0: number;
  felt_temperature_10: number;
  felt_temperature_20: number;
  felt_temperature_30: number;
};

/** 척도(1~7) 중립 기준값. 4 = "평균적인 사람과 동일하게 느낌". */
const NEUTRAL_SCALE = 4;
/** 척도 1칸당 체감 보정 폭 (°C). 7(완전 더위민감) → +6°C, 1(완전 추위민감) → −6°C. */
const SENSITIVITY_C_PER_STEP = 2;

/**
 * 개인 맞춤 체감온도.
 *
 * 기상학적 체감온도(apparentTempC)에 온보딩 체감 성향(felt_temperature_*)을 반영해
 * "이 사람이 실제로 몇 °C처럼 느끼는지"를 계산한다.
 *
 * 수분·체격·연령·활동량 같은 생활 지표는 °C 보정이 아니라 별도의 쾌적 점수
 * (personalComfortScore)로 반영한다.
 *
 * @param apparentTempC 기상학적 체감온도 (apparentTemperature 결과)
 * @param preference    온보딩 체감 성향
 * @returns 개인 체감온도 (°C, 소수 첫째 자리)
 */
export function personalFeltTemperature(
  apparentTempC: number,
  preference: FeltTemperaturePreference,
): number {
  const scalePref: TemperaturePreference = {
    0: clampScale(preference.felt_temperature_0),
    10: clampScale(preference.felt_temperature_10),
    20: clampScale(preference.felt_temperature_20),
    30: clampScale(preference.felt_temperature_30),
  };

  // interpolateTempScore: 체감 성향을 0~100 점수로 보간 → 1~7 척도로 환원
  const score = interpolateTempScore(scalePref, apparentTempC);
  const scaleAtTemp = 1 + (score / 100) * 6;

  // 성향 편차: 4보다 크면 "더 덥게", 작으면 "더 춥게" 느낀다.
  const offset = (scaleAtTemp - NEUTRAL_SCALE) * SENSITIVITY_C_PER_STEP;

  return Math.round((apparentTempC + offset) * 10) / 10;
}
