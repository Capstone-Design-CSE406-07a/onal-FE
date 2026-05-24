import { Info } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import {
  TEMP_OPTIONS,
  TEMP_REFERENCE_POINTS,
  type TempLevelKey,
  type TemperaturePreference,
} from "../constants";

type Step4TemperatureProps = {
  value: TemperaturePreference;
  onChange: (next: TemperaturePreference) => void;
};

export function Step4Temperature({ value, onChange }: Step4TemperatureProps) {
  const set = (celsius: number, key: TempLevelKey) => {
    onChange({ ...value, [celsius]: key });
  };
  const completed = TEMP_REFERENCE_POINTS.filter((p) => value[p.celsius]).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">체감 온도</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-start gap-3 rounded-[10px] border border-[#bed3ee]/20 bg-[#bed3ee]/5 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#bed3ee]" />
          <div className="flex flex-col gap-1">
            <p className="m-0 text-sm text-[#0a0a0a]">같은 기온도 사람마다 다르게 느껴집니다</p>
            <p className="m-0 text-xs text-[#717182]">
              각 온도에서의 체감을 선택하면 더 정확한 기온 안내를 받을 수 있어요
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {TEMP_REFERENCE_POINTS.map((point) => {
            const selectedKey = value[point.celsius];
            const fallback = TEMP_OPTIONS.find((o) => o.key === point.defaultKey);
            const selected = TEMP_OPTIONS.find((o) => o.key === selectedKey) ?? fallback;
            return (
              <div key={point.celsius} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="m-0 text-base font-medium text-[#0a0a0a]">
                    {point.celsius}°C
                  </h4>
                  <span className="text-2xl">{selected?.emoji}</span>
                </div>
                <div className="flex gap-2">
                  {TEMP_OPTIONS.map((opt) => {
                    const active = selectedKey === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => set(point.celsius, opt.key)}
                        className={cn(
                          "flex h-[93px] flex-1 flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] text-[10px] font-medium text-[#0a0a0a]",
                          active
                            ? "border-[#bed3ee] bg-[#bed3ee]/10 shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]"
                            : "border-black/10 bg-white",
                        )}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <p className="m-0 text-center text-sm text-[#717182]">
          {completed} / {TEMP_REFERENCE_POINTS.length} 완료
        </p>
      </CardContent>
    </Card>
  );
}
