import { OnboardingHeader } from "../components/onboarding-header";
import { OnboardingNav } from "../components/onboarding-nav";
import { Step1SensitiveGroup } from "../components/step1-sensitive-group";
import { Step2ActivityTime } from "../components/step2-activity-time";
import { Step3Locations } from "../components/step3-locations";
import { Step4Temperature } from "../components/step4-temperature";
import { StepIndicator } from "../components/step-indicator";
import { useOnboardingState } from "../hooks/use-onboarding-state";

export function OnboardingContainer() {
  const {
    step,
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
  } = useOnboardingState();

  return (
    <div className="flex min-h-full w-full justify-center bg-white">
      <div className="flex w-full max-w-[600px] flex-col gap-6 px-4 py-8">
        <OnboardingHeader step={step} />
        <StepIndicator current={step} />

        {step === 1 && (
          <Step1SensitiveGroup value={sensitiveGroups} onChange={setSensitiveGroups} />
        )}
        {step === 2 && <Step2ActivityTime value={activities} onChange={setActivities} />}
        {step === 3 && <Step3Locations value={locations} onChange={setLocations} />}
        {step === 4 && (
          <Step4Temperature value={tempPreference} onChange={setTempPreference} />
        )}

        <OnboardingNav onPrev={prev} onNext={next} prevDisabled={isFirst} isLast={isLast} />
      </div>
    </div>
  );
}
