import { Check } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/utils";

import { SENSITIVE_GROUPS, type SensitiveGroupKey } from "../constants";

type SensitiveGroupSelectProps = {
  value: SensitiveGroupKey[];
  onChange: (next: SensitiveGroupKey[]) => void;
};

export function SensitiveGroupSelect({ value, onChange }: SensitiveGroupSelectProps) {
  const toggle = (key: SensitiveGroupKey) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  };

  return (
    <Card>
      <CardHeader className="">
        <Typography variant="body1" className="font-semibold text-app-black">
          민감군 선택
        </Typography>
        <Typography variant="body2" className="text-gray-dark">
          건강 특성에 맞는 환경 정보를 제공해드립니다 (복수 선택 가능)
        </Typography>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {SENSITIVE_GROUPS.map((group) => {
            const selected = value.includes(group.key);
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => toggle(group.key)}
                className={cn(
                  "relative flex items-start gap-3 rounded-[10px] border-[1.5px] px-4 py-4 text-left",
                  selected ? "border-primary bg-primary/5" : "border-black/10 bg-white",
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-lg">
                  {group.emoji}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <Typography variant="body1" as="span" className="text-app-black">
                    {group.title}
                  </Typography>
                  <Typography variant="body2" as="span" className="text-gray-dark">
                    {group.description}
                  </Typography>
                </div>
                {selected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
