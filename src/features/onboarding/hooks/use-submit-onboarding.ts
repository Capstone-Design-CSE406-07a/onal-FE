import { useMutation } from "@tanstack/react-query";

import { buildEnrollPayload, postEnroll } from "../api/enroll";
import type { ActivityEntry, LocationEntry, ScoreProfile, SensitiveGroupKey, TemperaturePreference } from "../constants";

type SubmitParams = {
  sensitiveGroups: SensitiveGroupKey[];
  activities: ActivityEntry[];
  locations: LocationEntry[];
  tempPreference: TemperaturePreference;
  scoreProfile: ScoreProfile;
};

export function useSubmitOnboarding() {
  return useMutation({
    mutationFn: (params: SubmitParams) => postEnroll(buildEnrollPayload(params)),
  });
}
