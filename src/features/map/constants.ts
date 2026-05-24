import type { FeatureCollection, Point } from "geojson";

import { DustIcon, RainIcon, RiskIcon, SunIcon, TemperatureIcon } from "./assets";

export type LayerKey = "air" | "temp" | "uv" | "rain" | "risk";

export type LayerConfig = {
  label: string;
  unit: string;
  icon: string;
  ramp: Array<[number, string]>;
};

export const LAYER_KEYS: LayerKey[] = ["air", "temp", "uv", "rain", "risk"];

export const LAYER_CONFIG: Record<LayerKey, LayerConfig> = {
  air: {
    label: "대기질",
    unit: "PM2.5",
    icon: DustIcon,
    ramp: [
      [0, "rgba(0,0,0,0)"],
      [0.2, "rgba(167, 217, 167, 0.55)"],
      [0.5, "rgba(255, 217, 102, 0.7)"],
      [0.8, "rgba(244, 144, 96, 0.85)"],
      [1, "rgba(212, 24, 61, 0.9)"],
    ],
  },
  temp: {
    label: "기온/체감",
    unit: "°C",
    icon: TemperatureIcon,
    ramp: [
      [0, "rgba(0,0,0,0)"],
      [0.2, "rgba(96, 165, 250, 0.55)"],
      [0.5, "rgba(190, 211, 238, 0.7)"],
      [0.8, "rgba(251, 191, 36, 0.85)"],
      [1, "rgba(212, 24, 61, 0.9)"],
    ],
  },
  uv: {
    label: "자외선",
    unit: "UV",
    icon: SunIcon,
    ramp: [
      [0, "rgba(0,0,0,0)"],
      [0.2, "rgba(167, 243, 208, 0.55)"],
      [0.5, "rgba(253, 224, 71, 0.7)"],
      [0.8, "rgba(249, 115, 22, 0.85)"],
      [1, "rgba(168, 85, 247, 0.9)"],
    ],
  },
  rain: {
    label: "강수",
    unit: "mm",
    icon: RainIcon,
    ramp: [
      [0, "rgba(0,0,0,0)"],
      [0.2, "rgba(186, 230, 253, 0.55)"],
      [0.5, "rgba(125, 211, 252, 0.7)"],
      [0.8, "rgba(56, 189, 248, 0.85)"],
      [1, "rgba(2, 132, 199, 0.95)"],
    ],
  },
  risk: {
    label: "복합 위험도",
    unit: "Risk",
    icon: RiskIcon,
    ramp: [
      [0, "rgba(0,0,0,0)"],
      [0.2, "rgba(254, 215, 170, 0.55)"],
      [0.5, "rgba(253, 164, 175, 0.75)"],
      [0.8, "rgba(244, 63, 94, 0.85)"],
      [1, "rgba(159, 18, 57, 0.95)"],
    ],
  },
};

export const DEFAULT_CENTER: [number, number] = [127.0276, 37.4979];

const BASE_POINTS: Array<[number, number, number]> = [
  [127.0276, 37.4979, 0.9],
  [127.021, 37.505, 0.7],
  [127.035, 37.49, 0.6],
  [127.04, 37.51, 0.5],
  [127.015, 37.495, 0.65],
  [127.05, 37.5, 0.55],
  [127.028, 37.515, 0.45],
  [127.005, 37.482, 0.4],
  [127.06, 37.493, 0.5],
  [126.998, 37.508, 0.35],
];

const LAYER_PHASE: Record<LayerKey, number> = {
  air: 0,
  temp: 4,
  uv: -3,
  rain: 6,
  risk: 2,
};

export function buildHeatmapData(
  layer: LayerKey,
  timeOffset: number,
): FeatureCollection<Point, { weight: number }> {
  const phase = LAYER_PHASE[layer];
  const mod = 0.5 + 0.5 * Math.cos(((timeOffset + phase) / 12) * Math.PI);
  return {
    type: "FeatureCollection",
    features: BASE_POINTS.map(([lng, lat, base]) => ({
      type: "Feature",
      properties: { weight: Math.min(1, base * (0.4 + 0.9 * mod)) },
      geometry: { type: "Point", coordinates: [lng, lat] },
    })),
  };
}

export type InterestPlace = {
  id: string;
  name: string;
  coordinates: [number, number];
  icon: string;
};

export const INTEREST_PLACES: InterestPlace[] = [
  { id: "home", name: "집", coordinates: [127.0276, 37.4979], icon: "🏠" },
  { id: "office", name: "회사", coordinates: [127.054, 37.508], icon: "🏢" },
  { id: "school", name: "학교", coordinates: [127.01, 37.483], icon: "🎓" },
  { id: "park", name: "공원", coordinates: [127.038, 37.515], icon: "🌳" },
  { id: "gym", name: "헬스장", coordinates: [127.025, 37.501], icon: "💪" },
];
