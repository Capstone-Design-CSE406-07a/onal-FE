export type TempScaleValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TemperaturePreference = Partial<Record<number, TempScaleValue>>;

export const TEMP_REFERENCE_POINTS = [0, 10, 20, 30] as const;
export type TempReferencePoint = (typeof TEMP_REFERENCE_POINTS)[number];

const SCALE_MIN = 1;
const SCALE_MAX = 7;

/** TempScaleValue(1–7) → 체감 점수(0–100) */
export function scaleToScore(value: TempScaleValue): number {
  return ((value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

/**
 * 임의의 온도에서 체감 점수를 선형 보간으로 계산합니다.
 *
 * 기준점: 0·10·20·30°C
 * 범위 밖 온도는 가장 가까운 기준점 값으로 클램프합니다.
 *
 * @example
 * // 10°C → 2번째(값=2), 20°C → 5번째(값=5)
 * interpolateTempScore({ 10: 2, 20: 5 }, 15)  // → 50  (중간)
 * interpolateTempScore({ 10: 2, 20: 5 }, 12)  // → 80% of score(2) + 20% of score(5)
 */
export function interpolateTempScore(preference: TemperaturePreference, temp: number): number {
  const refs = [...TEMP_REFERENCE_POINTS].sort((a, b) => a - b);

  // 범위 밖 클램프
  const minRef = refs[0];
  const maxRef = refs[refs.length - 1];

  if (temp <= minRef) {
    const v = preference[minRef];
    return v != null ? scaleToScore(v) : 50;
  }
  if (temp >= maxRef) {
    const v = preference[maxRef];
    return v != null ? scaleToScore(v) : 50;
  }

  const lowerRef = [...refs].reverse().find((r) => r <= temp)!;
  const upperRef = refs.find((r) => r > temp)!;

  const lowerVal = preference[lowerRef];
  const upperVal = preference[upperRef];

  if (lowerVal == null && upperVal == null) return 50;
  if (lowerVal == null) return scaleToScore(upperVal!);
  if (upperVal == null) return scaleToScore(lowerVal);

  const lowerScore = scaleToScore(lowerVal);
  const upperScore = scaleToScore(upperVal);

  // 선형 보간: ratio = (temp - lower) / (upper - lower)
  const ratio = (temp - lowerRef) / (upperRef - lowerRef);
  return lowerScore * (1 - ratio) + upperScore * ratio;
}
