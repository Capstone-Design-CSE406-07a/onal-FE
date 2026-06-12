import { useState } from "react";

import {
  INITIAL_SCORE_PROFILE,
  TOTAL_STEPS,
  type ActivityEntry,
  type LocationEntry,
  type ScoreProfile,
  type SensitiveGroupKey,
  type TemperaturePreference,
} from "../constants";

export type OnboardingState = ReturnType<typeof useOnboardingState>;

export function useOnboardingState() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [sensitiveGroups, setSensitiveGroups] = useState<SensitiveGroupKey[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [locations, setLocations] = useState<LocationEntry[]>([]);
  const [tempPreference, setTempPreference] = useState<TemperaturePreference>({});
  const [scoreProfile, setScoreProfile] = useState<ScoreProfile>(INITIAL_SCORE_PROFILE);

  const next = () => {
    if (step >= TOTAL_STEPS) {
      setCompleted(true);
      return;
    }
    setStep(step + 1);
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return {
    step,
    completed,
    isFirst: step === 1,
    isLast: step === TOTAL_STEPS,
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
  };
}
