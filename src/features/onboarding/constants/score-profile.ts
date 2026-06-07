export type WaterIntake = "low" | "medium" | "high";
export type BodyType = "slim" | "normal" | "overweight";
export type AgeGroup = "teen" | "adult" | "middle" | "senior";
export type CurrentTempFeeling = "cold" | "comfortable" | "hot";
export type ActivityLevel = "none" | "light" | "intense";

export type ScoreProfile = {
  waterIntake: WaterIntake | null;
  bodyType: BodyType | null;
  ageGroup: AgeGroup | null;
  currentTempFeeling: CurrentTempFeeling | null;
  activityLevel: ActivityLevel | null;
};

export type ScoreProfilePayload = {
  waterIntake: number | null;
  bodyType: number | null;
  ageGroup: number | null;
  currentTempFeeling: number | null;
  activityLevel: number | null;
};

export const INITIAL_SCORE_PROFILE: ScoreProfile = {
  waterIntake: null,
  bodyType: null,
  ageGroup: null,
  currentTempFeeling: null,
  activityLevel: null,
};

type OptionItem = { value: string; label: string };

type QuestionConfig = {
  key: keyof ScoreProfile;
  label: string;
  options: OptionItem[];
};

export const SCORE_QUESTIONS: QuestionConfig[] = [
  {
    key: "waterIntake",
    label: "평균 물 섭취량",
    options: [
      { value: "low", label: "적음" },
      { value: "medium", label: "보통" },
      { value: "high", label: "많음" },
    ],
  },
  {
    key: "bodyType",
    label: "체형",
    options: [
      { value: "slim", label: "마름" },
      { value: "normal", label: "보통" },
      { value: "overweight", label: "과체중" },
    ],
  },
  {
    key: "ageGroup",
    label: "나이",
    options: [
      { value: "teen", label: "10대" },
      { value: "adult", label: "20-30대" },
      { value: "middle", label: "40-50대" },
      { value: "senior", label: "60대+" },
    ],
  },
  {
    key: "currentTempFeeling",
    label: "지금 기온",
    options: [
      { value: "cold", label: "추움" },
      { value: "comfortable", label: "적당함" },
      { value: "hot", label: "더움" },
    ],
  },
  {
    key: "activityLevel",
    label: "활동량",
    options: [
      { value: "none", label: "거의 없음" },
      { value: "light", label: "가벼운 운동" },
      { value: "intense", label: "격한 운동" },
    ],
  },
];

// 선택지 → 점수 변환
const WATER_INTAKE_SCORES: Record<WaterIntake, number> = { low: 1, medium: 2, high: 3 };
const BODY_TYPE_SCORES: Record<BodyType, number> = { slim: 1, normal: 2, overweight: 3 };
const AGE_GROUP_SCORES: Record<AgeGroup, number> = { teen: 1, adult: 2, middle: 3, senior: 4 };
const CURRENT_TEMP_SCORES: Record<CurrentTempFeeling, number> = { cold: 1, comfortable: 2, hot: 3 };
const ACTIVITY_LEVEL_SCORES: Record<ActivityLevel, number> = { none: 1, light: 2, intense: 3 };

export function toScorePayload(profile: ScoreProfile): ScoreProfilePayload {
  return {
    waterIntake: profile.waterIntake !== null ? WATER_INTAKE_SCORES[profile.waterIntake] : null,
    bodyType: profile.bodyType !== null ? BODY_TYPE_SCORES[profile.bodyType] : null,
    ageGroup: profile.ageGroup !== null ? AGE_GROUP_SCORES[profile.ageGroup] : null,
    currentTempFeeling:
      profile.currentTempFeeling !== null ? CURRENT_TEMP_SCORES[profile.currentTempFeeling] : null,
    activityLevel:
      profile.activityLevel !== null ? ACTIVITY_LEVEL_SCORES[profile.activityLevel] : null,
  };
}
