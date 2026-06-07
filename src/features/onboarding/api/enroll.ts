import {
  type ActivityEntry,
  type AgeGroup,
  type ActivityLevel,
  type BodyType,
  type LocationEntry,
  type ScoreProfile,
  type SensitiveGroupKey,
  type TemperaturePreference,
  type WaterIntake,
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

const WATER_INTAKE_SCORE: Record<WaterIntake, number> = { low: 1, medium: 2, high: 3 };
const BODY_TYPE_SCORE: Record<BodyType, number> = { slim: 1, normal: 2, overweight: 3 };
const AGE_REPRESENTATIVE: Record<AgeGroup, number> = { teen: 15, adult: 25, middle: 45, senior: 65 };
const ACTIVITY_LEVEL_SCORE: Record<ActivityLevel, number> = { none: 1, light: 2, intense: 3 };

export function buildEnrollPayload(params: {
  sensitiveGroups: SensitiveGroupKey[];
  activities: ActivityEntry[];
  locations: LocationEntry[];
  tempPreference: TemperaturePreference;
  scoreProfile: ScoreProfile;
}): EnrollPayload {
  const { sensitiveGroups, activities, locations, tempPreference, scoreProfile } = params;

  return {
    sensivity: sensitiveGroups.map((key) => SENSITIVE_GROUP_LABEL[key]),
    activity_time: activities.map((a) => ({ type: a.label, time: a.time })),
    favorite_place: locations.map((l) => ({ name: l.name, dong: l.address })),
    felt_temperature_0: tempPreference[0] ?? 4,
    felt_temperature_10: tempPreference[10] ?? 4,
    felt_temperature_20: tempPreference[20] ?? 4,
    felt_temperature_30: tempPreference[30] ?? 4,
    water_intake: scoreProfile.waterIntake !== null ? WATER_INTAKE_SCORE[scoreProfile.waterIntake] : null,
    body_type: scoreProfile.bodyType !== null ? BODY_TYPE_SCORE[scoreProfile.bodyType] : null,
    age: scoreProfile.ageGroup !== null ? AGE_REPRESENTATIVE[scoreProfile.ageGroup] : null,
    activity_level: scoreProfile.activityLevel !== null ? ACTIVITY_LEVEL_SCORE[scoreProfile.activityLevel] : null,
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
