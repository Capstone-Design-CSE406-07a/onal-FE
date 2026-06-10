import { AlertCircle, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { DustIcon, imgLocation, SunIcon, TemperatureIcon } from "./assets";
import type { PersonalizedMapData } from "./personalization";

type TopInfoPanelProps = {
  data: PersonalizedMapData;
  currentDong: string;
  locatingDong?: boolean;
};

export default function TopInfoPanel({ currentDong, locatingDong = false }: TopInfoPanelProps) {
  const navigate = useNavigate();
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
              {locatingDong ? (
                <Skeleton className="h-7 w-32" />
              ) : (
                <p className="m-0 text-xl/[28px] font-medium text-[#0a0a0a]">{currentDong}</p>
              )}
            </div>
            <div className="flex h-8 items-center justify-center gap-2">
              <Button
                variant="icon"
                size="icon"
                onClick={() => {
                  navigate("/chat");
                }}
              >
                <img src="/icons/main/chat.svg" alt="chat" className="size-5" />
              </Button>
              <Button
                variant="icon"
                size="icon"
                onClick={() => {
                  navigate("/setting");
                }}
              >
                <SettingsIcon className="size-5" />
              </Button>
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
