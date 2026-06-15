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
  // 램프 최저 스톱은 "투명"이 아니라 옅은 색 — 값이 낮은(안전/없음) 지역도
  // 전국이 옅게 칠해지고, 값이 높을수록 진해진다.
  air: {
    label: "대기질",
    unit: "PM2.5",
    icon: DustIcon,
    ramp: [
      [0, "rgba(120, 190, 230, 0.4)"],
      [0.34, "rgba(150, 205, 130, 0.62)"],
      [0.6, "rgba(255, 212, 90, 0.78)"],
      [0.8, "rgba(245, 140, 90, 0.86)"],
      [1, "rgba(212, 24, 61, 0.92)"],
    ],
  },
  temp: {
    label: "기온/체감",
    unit: "°C",
    icon: TemperatureIcon,
    // weight = 기온/40 (0°C→0, 40°C→1). 스톱을 실제 체감에 맞춰 배치한다:
    // 0~10°C 파랑(추움), 18~24°C 초록·노랑(쾌적), 28°C↑ 주황, 33°C↑ 빨강.
    // → 한여름 ~25°C가 "쾌적한 노랑"으로 보이고, 지역별 4~5°C 차이도 색으로 드러난다.
    ramp: [
      [0, "rgba(70, 130, 220, 0.55)"], // 0°C
      [0.25, "rgba(125, 190, 230, 0.5)"], // 10°C
      [0.45, "rgba(150, 205, 150, 0.6)"], // 18°C 쾌적 초록
      [0.575, "rgba(228, 220, 110, 0.7)"], // 23°C 연노랑
      [0.7, "rgba(245, 165, 80, 0.82)"], // 28°C 주황
      [0.825, "rgba(232, 90, 60, 0.88)"], // 33°C 주황빨강
      [1, "rgba(200, 30, 45, 0.92)"], // 40°C 빨강
    ],
  },
  uv: {
    label: "자외선",
    unit: "UV",
    icon: SunIcon,
    ramp: [
      [0, "rgba(150, 210, 160, 0.4)"],
      [0.3, "rgba(245, 225, 100, 0.7)"],
      [0.6, "rgba(248, 150, 60, 0.82)"],
      [0.8, "rgba(230, 70, 60, 0.88)"],
      [1, "rgba(150, 50, 200, 0.9)"],
    ],
  },
  rain: {
    label: "강수",
    unit: "mm",
    icon: RainIcon,
    ramp: [
      [0, "rgba(190, 215, 230, 0.35)"],
      [0.3, "rgba(150, 205, 245, 0.7)"],
      [0.6, "rgba(70, 170, 240, 0.82)"],
      [0.85, "rgba(30, 120, 210, 0.9)"],
      [1, "rgba(10, 80, 180, 0.95)"],
    ],
  },
  risk: {
    label: "복합 위험도",
    unit: "Risk",
    icon: RiskIcon,
    ramp: [
      [0, "rgba(150, 205, 150, 0.4)"],
      [0.3, "rgba(255, 215, 120, 0.72)"],
      [0.55, "rgba(250, 150, 90, 0.82)"],
      [0.8, "rgba(235, 70, 70, 0.88)"],
      [1, "rgba(159, 18, 57, 0.95)"],
    ],
  },
};

export const DEFAULT_CENTER: [number, number] = [127.0276, 37.4979];

export type InterestPlace = {
  id: string;
  name: string;
  dong?: string;
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
