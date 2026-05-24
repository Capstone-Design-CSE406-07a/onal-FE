import { imgLayerDust, imgLayerRain, imgLayerRisk, imgLayerSun } from "./assets";
import { cn } from "@/shared/lib/utils";

const layers = [
  { icon: imgLayerDust, label: "미세먼지", active: true },
  { icon: imgLayerSun, label: "기온" },
  { icon: imgLayerSun, label: "자외선" },
  { icon: imgLayerRain, label: "강수" },
  { icon: imgLayerRisk, label: "복합 위험도" },
];

export default function BottomControlsPanel() {
  return (
    <div className="relative w-full px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="rounded-[14px] border-[0.75px] border-black/10 bg-white p-px">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <section className="flex flex-col gap-2">
            <p className="m-0 text-sm font-medium text-[#0a0a0a]">레이어 선택</p>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 max-[360px]:flex-wrap max-[360px]:overflow-x-visible [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar]:h-1">
              {layers.map((layer) => (
                <LayerButton key={layer.label} {...layer} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="m-0 text-sm font-medium text-[#0a0a0a]">투명도</p>
              <p className="m-0 text-sm text-[#717182]">70%</p>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-[#ececf0]">
              <div className="absolute inset-0 w-[70%] bg-[#bed3ee]" />
              <div className="absolute top-0 left-[67%] h-4 w-4 rounded-full border-[0.75px] border-[#bed3ee] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]" />
            </div>
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
};

function LayerButton({ icon, label, active }: LayerButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px] border-[1.5px] border-black/10 bg-white px-3.5 py-2.5 text-sm font-medium whitespace-nowrap text-[#0a0a0a] sm:text-base",
        active && "border-[#bed3ee] bg-[#bed3ee]/10 text-[#bed3ee]",
      )}
    >
      <img src={icon} alt="" className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
