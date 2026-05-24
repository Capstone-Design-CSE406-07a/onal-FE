import { useState } from "react";

import {
  TOTAL_STEPS,
  type ActivityEntry,
  type LocationEntry,
  type SensitiveGroupKey,
  type TemperaturePreference,
} from "../constants";

export type OnboardingState = ReturnType<typeof useOnboardingState>;

export function useOnboardingState() {
  const [step, setStep] = useState(1);
  const [sensitiveGroups, setSensitiveGroups] = useState<SensitiveGroupKey[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [locations, setLocations] = useState<LocationEntry[]>([]);
  const [tempPreference, setTempPreference] = useState<TemperaturePreference>({});

  const next = () => {
    if (step >= TOTAL_STEPS) {
      // TODO: 데이터 연동 — 온보딩 완료 처리 / 메인 페이지 이동
      return;
    }
    setStep(step + 1);
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return {
    step,
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
  };
}
