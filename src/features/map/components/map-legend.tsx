import { LAYER_CONFIG, type LayerKey } from "../constants";

// 레이어별 색 띠 아래에 표시할 눈금 라벨(좌=낮음/안전 → 우=높음/위험).
// temp는 weight=°C/40 라 0·10·20·30·40°C가 띠 위치(0·25·50·75·100%)에 정확히 맞는다.
const LEGEND_TICKS: Record<LayerKey, string[]> = {
  air: ["좋음", "보통", "나쁨", "매우나쁨"],
  temp: ["0°", "10°", "20°", "30°", "40°"],
  uv: ["낮음", "보통", "높음", "매우↑", "위험"],
  rain: ["없음", "약", "보통", "강", "폭우"],
  risk: ["안전", "보통", "주의", "위험"],
};

function buildGradient(ramp: Array<[number, string]>): string {
  const stops = ramp.map(([stop, color]) => `${color} ${Math.round(stop * 100)}%`);
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

type MapLegendProps = {
  activeLayer: LayerKey;
};

export function MapLegend({ activeLayer }: MapLegendProps) {
  const { label, ramp } = LAYER_CONFIG[activeLayer];
  const ticks = LEGEND_TICKS[activeLayer];

  return (
    <div className="pointer-events-none absolute right-2 top-2 z-10 w-36 rounded-xl border border-black/5 bg-white/90 px-3 py-2 shadow-marker backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-semibold text-app-black">{label}</p>
      <div className="h-2 w-full rounded-full" style={{ background: buildGradient(ramp) }} />
      <div className="mt-1 flex justify-between text-[10px] font-medium text-gray-dark">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
}
