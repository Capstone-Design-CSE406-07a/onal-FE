import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { SENSITIVE_GROUPS, type SensitiveGroupKey } from "../constants";

type Step1SensitiveGroupProps = {
  value: SensitiveGroupKey[];
  onChange: (next: SensitiveGroupKey[]) => void;
};

export function Step1SensitiveGroup({ value, onChange }: Step1SensitiveGroupProps) {
  const toggle = (key: SensitiveGroupKey) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">민감군 선택</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="m-0 text-sm text-[#717182]">
          건강 특성에 맞는 환경 정보를 제공해드립니다 (복수 선택 가능)
        </p>
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
                  selected ? "border-[#bed3ee] bg-[#bed3ee]/5" : "border-black/10 bg-white",
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#bed3ee]/10 text-lg">
                  {group.emoji}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-lg font-medium text-[#0a0a0a]">{group.title}</span>
                  <span className="text-sm text-[#717182]">{group.description}</span>
                </div>
                {selected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#bed3ee] text-[#1a3a52]">
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
