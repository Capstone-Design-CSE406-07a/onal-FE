import { cn } from "@/shared/lib/utils";

import { LAYER_CONFIG, LAYER_KEYS, type LayerKey } from "./constants";

type BottomControlsPanelProps = {
  activeLayer: LayerKey;
  onLayerChange: (key: LayerKey) => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
  timeOffset: number;
  onTimeOffsetChange: (v: number) => void;
};

export default function BottomControlsPanel({
  activeLayer,
  onLayerChange,
  opacity,
  onOpacityChange,
  timeOffset,
  onTimeOffsetChange,
}: BottomControlsPanelProps) {
  const opacityPct = Math.round(opacity * 100);
  const timeLabel =
    timeOffset === 0 ? "지금" : timeOffset > 0 ? `+${timeOffset}시간` : `${timeOffset}시간`;

  return (
    <div className="relative w-full px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="rounded-[14px] border-[0.75px] border-black/10 bg-white p-px">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <section className="flex flex-col gap-2">
            <p className="m-0 text-sm font-medium text-app-black">레이어 선택</p>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 max-[360px]:flex-wrap max-[360px]:overflow-x-visible [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar]:h-1">
              {LAYER_KEYS.map((key) => (
                <LayerButton
                  key={key}
                  icon={LAYER_CONFIG[key].icon}
                  label={LAYER_CONFIG[key].label}
                  active={key === activeLayer}
                  onClick={() => onLayerChange(key)}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="m-0 text-sm font-medium text-app-black">시간</p>
              <p className="m-0 text-sm text-gray-dark">{timeLabel}</p>
            </div>
            <input
              type="range"
              min={-12}
              max={12}
              step={1}
              value={timeOffset}
              onChange={(e) => onTimeOffsetChange(Number(e.target.value))}
              aria-label="시간 슬라이더"
              className="h-4 w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-dark">
              <span>-12h</span>
              <span>지금</span>
              <span>+12h</span>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="m-0 text-sm font-medium text-app-black">투명도</p>
              <p className="m-0 text-sm text-gray-dark">{opacityPct}%</p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={opacityPct}
              onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
              aria-label="히트맵 투명도"
              className="h-4 w-full accent-primary"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

type LayerButtonProps = {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
};

function LayerButton({ icon, label, active, onClick }: LayerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border-[1.5px] border-black/10 bg-white px-2.5 py-2 text-xs font-medium whitespace-nowrap text-app-black sm:px-3 sm:text-sm",
        active && "border-primary bg-primary/10 text-primary",
      )}
    >
      <img src={icon} alt="" className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
