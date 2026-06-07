import { Button } from "@/shared/ui/button";

type OnboardingNavProps = {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  isLast?: boolean;
};

export function OnboardingNav({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  isLast,
}: OnboardingNavProps) {
  return (
    <div className="flex w-full gap-3">
      {!prevDisabled && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="h-14 flex-1 rounded-xl text-base"
        >
          이전
        </Button>
      )}
      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="h-14 flex-1 rounded-xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
      >
        {isLast ? "완료" : "다음"}
      </Button>
    </div>
  );
}
