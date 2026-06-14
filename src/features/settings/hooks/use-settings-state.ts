import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  buildEnrollPayload,
  INITIAL_SCORE_PROFILE,
  putUserUpdate,
  SENSITIVE_GROUP_LABEL,
  type ActivityEntry,
  type LocationEntry,
  type ScoreProfile,
  type SensitiveGroupKey,
  type TemperaturePreference,
  type TempScaleValue,
} from "@/features/user-profile";
import { useUser } from "@/shared/contexts/use-user";

import type { NotificationSettings, SettingsCardKey } from "../constants";

// 서버 라벨 → 민감군 키 (시드용 역매핑)
const KEY_BY_SENSITIVE_LABEL = Object.fromEntries(
  Object.entries(SENSITIVE_GROUP_LABEL).map(([key, label]) => [label, key as SensitiveGroupKey]),
) as Record<string, SensitiveGroupKey>;

/** 저장된 felt_temperature(숫자)를 체감 척도(1~7)로 보정한다. */
function toScaleValue(value: number): TempScaleValue {
  return Math.min(Math.max(Math.round(value), 1), 7) as TempScaleValue;
}

export type UseSettingsStateReturn = {
  expandedCard: SettingsCardKey | null;
  toggleCard: (key: SettingsCardKey) => void;
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
  sensitiveGroups: SensitiveGroupKey[];
  setSensitiveGroups: (next: SensitiveGroupKey[]) => void;
  activities: ActivityEntry[];
  setActivities: (next: ActivityEntry[]) => void;
  locations: LocationEntry[];
  setLocations: (next: LocationEntry[]) => void;
  tempPreference: TemperaturePreference;
  setTempPreference: (next: TemperaturePreference) => void;
  scoreProfile: ScoreProfile;
  setScoreProfile: (next: ScoreProfile) => void;
  save: () => void;
  isSaving: boolean;
};

export function useSettingsState(): UseSettingsStateReturn {
  const { user, setUser } = useUser();

  const [expandedCard, setExpandedCard] = useState<SettingsCardKey | null>(null);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dustAlert: true,
    activityForecast: true,
    emergencyAlert: true,
  });

  const [sensitiveGroups, setSensitiveGroups] = useState<SensitiveGroupKey[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [locations, setLocations] = useState<LocationEntry[]>([]);
  const [tempPreference, setTempPreference] = useState<TemperaturePreference>({});
  const [scoreProfile, setScoreProfile] = useState<ScoreProfile>(INITIAL_SCORE_PROFILE);

  // 현재 유저 정보로 폼을 1회 시드한다 (enroll은 전체 교체 방식이라 기존 값 보존이 필요).
  // 점수 프로파일은 서버가 카테고리 원본이 아닌 환산 점수만 저장하므로 역매핑 불가 → 시드하지 않고,
  // 저장 시 미선택 항목은 기존 유저 값을 그대로 보존한다.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (user && seededFor !== user.googleId) {
    setSeededFor(user.googleId);

    setSensitiveGroups(
      user.sensivity
        .map((label) => KEY_BY_SENSITIVE_LABEL[label])
        .filter((key): key is SensitiveGroupKey => Boolean(key)),
    );
    setActivities(
      user.activity_time.map((item, index) => ({
        id: `seed-activity-${index}`,
        label: item.type,
        time: item.time,
        notify: true,
      })),
    );
    setLocations(
      user.favorite_place.map((place, index) => ({
        id: `seed-place-${index}`,
        name: place.name,
        address: place.dong,
        icon: "home",
      })),
    );
    setTempPreference({
      0: toScaleValue(user.felt_temperature_0),
      10: toScaleValue(user.felt_temperature_10),
      20: toScaleValue(user.felt_temperature_20),
      30: toScaleValue(user.felt_temperature_30),
    });
  }

  function toggleCard(key: SettingsCardKey) {
    setExpandedCard((prev) => (prev === key ? null : key));
  }

  function toggleNotification(key: keyof NotificationSettings) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const mutation = useMutation({
    mutationFn: () => {
      const { water_intake, body_type, age, activity_level, ...rest } = buildEnrollPayload({
        sensitiveGroups,
        activities,
        locations,
        tempPreference,
        scoreProfile,
      });
      // PUT /user/update 는 보낸 필드만 수정한다. 점수 프로파일을 새로 선택하지 않았다면(null)
      // 해당 필드를 아예 보내지 않아 기존 유저 값을 그대로 보존한다.
      return putUserUpdate({
        ...rest,
        ...(water_intake !== null && { water_intake }),
        ...(body_type !== null && { body_type }),
        ...(age !== null && { age }),
        ...(activity_level !== null && { activity_level }),
      });
    },
    // 업데이트된 전체 유저 객체로 컨텍스트를 갱신
    onSuccess: (updatedUser) => setUser(updatedUser),
  });

  function save() {
    if (mutation.isPending) return;
    mutation.mutate();
  }

  return {
    expandedCard,
    toggleCard,
    notifications,
    toggleNotification,
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
    save,
    isSaving: mutation.isPending,
  };
}
