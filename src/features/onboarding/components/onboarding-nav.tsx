import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

type OnboardingNavProps = {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  isLast?: boolean;
};

export function OnboardingNav({ onPrev, onNext, prevDisabled, isLast }: OnboardingNavProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <Button type="button" variant="outline" size="sm" onClick={onPrev} disabled={prevDisabled}>
        <ChevronLeft className="h-4 w-4" />
        <span>이전</span>
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onNext}
        className="bg-[#bed3ee] text-[#1a3a52] hover:bg-[#bed3ee]/90"
      >
        <span>{isLast ? "완료" : "다음"}</span>
        {!isLast && <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}
