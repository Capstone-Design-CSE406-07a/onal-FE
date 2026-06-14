import { useMutation } from "@tanstack/react-query";

import {
  buildEnrollPayload,
  postEnroll,
  type ActivityEntry,
  type LocationEntry,
  type ScoreProfile,
  type SensitiveGroupKey,
  type TemperaturePreference,
} from "@/features/user-profile";

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
