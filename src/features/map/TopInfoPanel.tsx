import { AlertCircle } from "lucide-react";

import { DustIcon, imgChat, imgLocation, SunIcon, TemperatureIcon } from "./assets";

export default function TopInfoPanel() {
  return (
    <div className="relative flex w-full flex-col gap-3 px-3 pt-3 sm:gap-4 sm:px-4 sm:pt-4">
      <div className="rounded-[14px] border-[0.75px] border-black/10 bg-white p-px">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 text-sm text-[#717182]">
                <img src={imgLocation} alt="" className="h-4 w-4" />
                <span>현재 위치</span>
              </div>
              <p className="m-0 text-xl/[28px] font-medium text-[#0a0a0a]">서울시 강남구</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
              <img src={imgChat} alt="" className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <MetricCard icon={DustIcon} value="45" label="미세먼지" />
            <MetricCard icon={TemperatureIcon} value="15°C" label="기온" />
            <MetricCard icon={SunIcon} value="5" label="자외선" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-[10px] border-[0.75px] border-[#d4183d]/20 bg-[#d4183d]/10 p-3 text-[#d4183d]">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <strong className="text-sm font-medium">오늘 오후 미세먼지 나쁨</strong>
        </div>
        <span className="ml-6 text-xs text-[#d4183d]/80">호흡기 민감군 주의 필요</span>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: string;
  value: string;
  label: string;
};

function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[10px] bg-[#e9f2fb]/50 py-3 text-center">
      <span
        aria-hidden
        className="h-5 w-5 bg-[#bed3ee]"
        style={{
          WebkitMaskImage: `url(${icon})`,
          maskImage: `url(${icon})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      <p className="m-0 text-sm font-medium text-[#0a0a0a]">{value}</p>
      <p className="m-0 text-xs text-[#717182]">{label}</p>
    </div>
  );
}
