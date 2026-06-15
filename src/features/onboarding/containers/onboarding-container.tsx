import { useNavigate } from "react-router-dom";

import {
  ActivityTimeSelect,
  LocationsSelect,
  ScoreProfileSelect,
  SensitiveGroupSelect,
  TemperatureSelect,
} from "@/features/user-profile";

import { OnboardingComplete } from "../components/onboarding-complete";
import { OnboardingHeader } from "../components/onboarding-header";
import { OnboardingNav } from "../components/onboarding-nav";
import { StepIndicator } from "../components/step-indicator";
import { TEMP_REFERENCE_POINTS } from "../constants";
import { useOnboardingState } from "../hooks/use-onboarding-state";
import { useSubmitOnboarding } from "../hooks/use-submit-onboarding";

export function OnboardingContainer() {
  const {
    step,
    completed,
    isFirst,
    isLast,
    next,
    prev,
    sensitiveGroups,
    setSensitiveGroups,
    activities,
    setActivities,
    locations,
    setLocations,
    tempPreference,
    setTempPreference,
    scoreProfile,
    setScoreProfile,
  } = useOnboardingState();

  const navigate = useNavigate();
  const submitMutation = useSubmitOnboarding();

  if (completed) return <OnboardingComplete />;

  const nextDisabled = (() => {
    if (step === 1) return sensitiveGroups.length === 0;
    if (step === 2) return activities.length === 0;
    if (step === 3) return locations.length === 0;
    if (step === 4) return TEMP_REFERENCE_POINTS.some((p) => tempPreference[p] == null);
    if (step === 5) return Object.values(scoreProfile).some((v) => v === null);
    return false;
  })();

  const handleNext = () => {
    if (!isLast) {
      next();
      return;
    }
    submitMutation.mutate(
      { sensitiveGroups, activities, locations, tempPreference, scoreProfile },
      { onSuccess: () => navigate("/", { replace: true }) },
    );
  };

  return (
    <div className="flex min-h-dvh w-full justify-center bg-app-bg">
      <div className="flex min-h-dvh w-full max-w-150 flex-col">
        {/* 스크롤되는 본문 — 내용이 길면 이 영역이 늘어나며 페이지가 스크롤된다. */}
        <div className="flex flex-1 flex-col gap-6 px-4 pt-8 pb-6">
          <OnboardingHeader step={step} />
          <StepIndicator current={step} />

          {step === 1 && (
            <SensitiveGroupSelect value={sensitiveGroups} onChange={setSensitiveGroups} />
          )}
          {step === 2 && <ActivityTimeSelect value={activities} onChange={setActivities} />}
          {step === 3 && <LocationsSelect value={locations} onChange={setLocations} />}
          {step === 4 && <TemperatureSelect value={tempPreference} onChange={setTempPreference} />}
          {step === 5 && <ScoreProfileSelect value={scoreProfile} onChange={setScoreProfile} />}
        </div>

        {/* 항상 하단에 고정되는 푸터 — 내용이 짧으면 바닥에, 길면 스크롤해도 뷰포트 하단에 붙어 있다. */}
        <div className="sticky bottom-0 bg-app-bg px-4 pt-4 pb-4 shadow-footer">
          <OnboardingNav
            onPrev={prev}
            onNext={handleNext}
            prevDisabled={isFirst}
            nextDisabled={nextDisabled || submitMutation.isPending}
            isLast={isLast}
          />
        </div>
      </div>
    </div>
  );
}
