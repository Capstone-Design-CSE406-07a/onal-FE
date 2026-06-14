import { apiClient } from "@/shared/api/client";
import type { User } from "@/shared/api/user";

import {
  ACTIVITY_LEVEL_SCORES,
  AGE_GROUP_SCORES,
  BODY_TYPE_SCORES,
  WATER_INTAKE_SCORES,
  type ActivityEntry,
  type LocationEntry,
  type ScoreProfile,
  type SensitiveGroupKey,
  type TemperaturePreference,
} from "./constants";

export type EnrollPayload = {
  sensivity: string[];
  activity_time: { type: string; time: string }[];
  favorite_place: { name: string; dong: string }[];
  felt_temperature_0: number;
  felt_temperature_10: number;
  felt_temperature_20: number;
  felt_temperature_30: number;
  water_intake: number | null;
  body_type: number | null;
  age: number | null;
  activity_level: number | null;
};

export const SENSITIVE_GROUP_LABEL: Record<SensitiveGroupKey, string> = {
  normal: "일반",
  respiratory: "천식/호흡기",
  infant: "영유아동반",
  elderly: "노인",
};

export function buildEnrollPayload(params: {
  sensitiveGroups: SensitiveGroupKey[];
  activities: ActivityEntry[];
  locations: LocationEntry[];
  tempPreference: TemperaturePreference;
  scoreProfile: ScoreProfile;
}): EnrollPayload {
  const { sensitiveGroups, activities, locations, tempPreference, scoreProfile } = params;

  const bodyTypeScore =
    scoreProfile.bodyType !== null && scoreProfile.currentTempFeeling !== null
      ? BODY_TYPE_SCORES[scoreProfile.bodyType][scoreProfile.currentTempFeeling]
      : null;

  return {
    sensivity: sensitiveGroups.map((key) => SENSITIVE_GROUP_LABEL[key]),
    activity_time: activities.map((a) => ({ type: a.label, time: a.time })),
    favorite_place: locations.map((l) => ({ name: l.name, dong: l.address })),
    felt_temperature_0: tempPreference[0] ?? 4,
    felt_temperature_10: tempPreference[10] ?? 4,
    felt_temperature_20: tempPreference[20] ?? 4,
    felt_temperature_30: tempPreference[30] ?? 4,
    water_intake:
      scoreProfile.waterIntake !== null ? WATER_INTAKE_SCORES[scoreProfile.waterIntake] : null,
    body_type: bodyTypeScore,
    age: scoreProfile.ageGroup !== null ? AGE_GROUP_SCORES[scoreProfile.ageGroup] : null,
    activity_level:
      scoreProfile.activityLevel !== null
        ? ACTIVITY_LEVEL_SCORES[scoreProfile.activityLevel]
        : null,
  };
}

export async function postEnroll(payload: EnrollPayload): Promise<void> {
  await apiClient("/user/enroll", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 마이페이지 수정 전용. 보낸 필드만 부분 업데이트되고, 업데이트된 전체 유저 객체를 반환한다.
export type UserUpdatePayload = Partial<EnrollPayload & { onboarding: boolean }>;

export async function putUserUpdate(payload: UserUpdatePayload): Promise<User> {
  return apiClient<User>("/user/update", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
