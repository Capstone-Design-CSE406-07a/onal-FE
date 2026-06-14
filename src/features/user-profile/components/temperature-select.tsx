import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/utils";

import {
  TEMP_CIRCLES,
  TEMP_REFERENCE_POINTS,
  type TemperaturePreference,
  type TempScaleValue,
} from "../constants";

type TemperatureSelectProps = {
  value: TemperaturePreference;
  onChange: (next: TemperaturePreference) => void;
};

export function TemperatureSelect({ value, onChange }: TemperatureSelectProps) {
  function select(celsius: number, scale: TempScaleValue) {
    onChange({ ...value, [celsius]: scale });
  }

  const completed = TEMP_REFERENCE_POINTS.filter((p) => value[p] != null).length;

  return (
    <Card>
      <CardHeader>
        <Typography variant="body1" className="font-semibold text-app-black">
          체감 온도 성향
        </Typography>
        <Typography variant="body2" className="text-gray-dark">
          각 온도에서 어떻게 느끼는지 선택해 주세요. 선택에 따라 맞춤 기온 안내를 제공합니다.
        </Typography>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-8">
          {TEMP_REFERENCE_POINTS.map((celsius) => {
            const selected = value[celsius];
            return (
              <div key={celsius} className="flex flex-col gap-3">
                <Typography variant="body1" as="span" className="font-medium text-app-black">
                  {celsius}°C
                </Typography>

                <div className="mx-auto flex w-fit flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {TEMP_CIRCLES.map((circle) => {
                      const active = selected === circle.value;
                      return (
                        <button
                          key={circle.value}
                          type="button"
                          onClick={() => select(celsius, circle.value)}
                          className={cn(
                            "shrink-0 rounded-full border-2 bg-white transition-all",
                            circle.twSize,
                            circle.borderColor,
                            active && [circle.selectedBg, "border-[3px] shadow-sm"],
                          )}
                          aria-label={`${celsius}°C — ${circle.value}단계`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="caption" as="span" className="text-primary">
                      추움
                    </Typography>
                    <Typography variant="caption" as="span" className="text-red">
                      더움
                    </Typography>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Typography variant="body2" className="text-center text-gray-dark">
          {completed} / {TEMP_REFERENCE_POINTS.length} 완료
        </Typography>
      </CardContent>
    </Card>
  );
}
