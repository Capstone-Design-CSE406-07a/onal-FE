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
} from "../constants";

type EnrollPayload = {
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

const SENSITIVE_GROUP_LABEL: Record<SensitiveGroupKey, string> = {
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
    water_intake: scoreProfile.waterIntake !== null ? WATER_INTAKE_SCORES[scoreProfile.waterIntake] : null,
    body_type: bodyTypeScore,
    age: scoreProfile.ageGroup !== null ? AGE_GROUP_SCORES[scoreProfile.ageGroup] : null,
    activity_level: scoreProfile.activityLevel !== null ? ACTIVITY_LEVEL_SCORES[scoreProfile.activityLevel] : null,
  };
}

export async function postEnroll(payload: EnrollPayload): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const res = await fetch(`${baseUrl}/user/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`enroll failed: ${res.status}`);
  }
}
