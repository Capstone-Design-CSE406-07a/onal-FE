export type TempLevelKey = "cold" | "cool" | "neutral" | "warm" | "hot";

export type TempOption = { key: TempLevelKey; emoji: string; label: string };

export const TEMP_OPTIONS: TempOption[] = [
  { key: "cold", emoji: "🥶", label: "춥다" },
  { key: "cool", emoji: "😊", label: "시원하다" },
  { key: "neutral", emoji: "😌", label: "적당하다" },
  { key: "warm", emoji: "😅", label: "따뜻하다" },
  { key: "hot", emoji: "🥵", label: "덥다" },
];

export type TempReferencePoint = { celsius: number; defaultKey: TempLevelKey };

export const TEMP_REFERENCE_POINTS: TempReferencePoint[] = [
  { celsius: 0, defaultKey: "cold" },
  { celsius: 10, defaultKey: "cool" },
  { celsius: 20, defaultKey: "warm" },
  { celsius: 30, defaultKey: "hot" },
];

export type TemperaturePreference = Partial<Record<number, TempLevelKey>>;
