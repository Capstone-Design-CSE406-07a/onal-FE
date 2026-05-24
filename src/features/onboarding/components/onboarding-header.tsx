import { Progress } from "@/shared/ui/progress";

import { TOTAL_STEPS } from "../constants";

type OnboardingHeaderProps = {
  step: number;
};

export function OnboardingHeader({ step }: OnboardingHeaderProps) {
  const pct = (step / TOTAL_STEPS) * 100;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-2xl font-medium text-[#0a0a0a]">환경 설정</h2>
        <span className="text-sm text-[#717182]">
          {step} / {TOTAL_STEPS}
        </span>
      </div>
      <Progress value={pct} className="h-3 bg-[#bed3ee]/20 [&>div]:bg-[#bed3ee]" />
    </div>
  );
}
