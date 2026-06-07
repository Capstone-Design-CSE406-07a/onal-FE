import { Progress } from "@/shared/ui/progress";
import { Typography } from "@/shared/ui/typography";

import { TOTAL_STEPS } from "../constants";

type OnboardingHeaderProps = {
  step: number;
};

export function OnboardingHeader({ step }: OnboardingHeaderProps) {
  const pct = (step / TOTAL_STEPS) * 100;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h2" className="text-app-black">환경 설정</Typography>
        <Typography variant="body2" as="span" className="text-gray-dark">
          {step} / {TOTAL_STEPS}
        </Typography>
      </div>
      <Progress value={pct} className="h-3 bg-primary/20 [&>div]:bg-primary" />
    </div>
  );
}
