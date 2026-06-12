import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { TOTAL_STEPS } from "../constants";

type StepIndicatorProps = {
  current: number;
};

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex w-full items-center">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={stepNum} className="flex flex-1 items-center justify-center px-1">
            <div
              className={cn(
                "flex h-10 w-full items-center justify-center rounded-full text-base",
                done || active
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-primary text-gray-dark opacity-50",
                active && "shadow-sm",
              )}
            >
              {done ? <Check className="h-5 w-5" /> : stepNum}
            </div>
          </div>
        );
      })}
    </div>
  );
}
