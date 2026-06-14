import { AlertCircle, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { DustIcon, SunIcon, TemperatureIcon } from "./assets";
import type { PersonalizedMapData } from "./personalization";

type TopInfoPanelProps = {
  data: PersonalizedMapData;
  currentDong: string;
  locatingDong?: boolean;
};

export default function TopInfoPanel({
  data,
  currentDong,
  locatingDong = false,
}: TopInfoPanelProps) {
  const navigate = useNavigate();
  const { metrics, primaryAlert } = data;
  const alertTone = primaryAlert.label === "위험" || primaryAlert.label === "주의";
  return (
    <div className="relative flex w-full flex-col gap-3 px-3 pt-3 sm:gap-4 sm:px-4 sm:pt-4">
      <div className="rounded-[14px] border-[0.75px] border-black/10 bg-white p-px">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 text-sm text-gray-dark">
                <img src="/icons/main/location.svg" alt="" className="h-4 w-4" />
                <span>현재 위치</span>
              </div>
              {locatingDong ? (
                <Skeleton className="h-7 w-32" />
              ) : (
                <p className="m-0 text-xl/[28px] font-medium text-app-black">{currentDong}</p>
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
            <MetricCard icon={DustIcon} value={`${metrics.airQuality}`} label="미세먼지" />
            <MetricCard
              icon={TemperatureIcon}
              value={`${metrics.personalFeltTemp}°C`}
              label="체감온도"
            />
            <MetricCard icon={SunIcon} value={`${metrics.uvIndex}`} label="자외선" />
          </div>
        </div>
      </div>

      {alertTone ? (
        <div className="flex flex-col gap-1 rounded-[10px] border-[0.75px] border-destructive/20 bg-destructive/10 p-3 text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <strong className="text-sm font-medium">{primaryAlert.headline}</strong>
          </div>
          <span className="ml-6 text-xs text-destructive/80">{primaryAlert.detail}</span>
        </div>
      ) : null}
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
    <div className="flex flex-col items-center gap-1 rounded-[10px] bg-accent/50 py-3 text-center">
      <span
        aria-hidden
        className="h-5 w-5 bg-primary"
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
      <p className="m-0 text-sm font-medium text-app-black">{value}</p>
      <p className="m-0 text-xs text-gray-dark">{label}</p>
    </div>
  );
}
