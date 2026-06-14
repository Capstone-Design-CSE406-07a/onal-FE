export const MAX_ACTIVITIES = 5;

export type ActivityPreset = { label: string; time: string };

export const ACTIVITY_PRESETS: ActivityPreset[] = [
  { label: "출근", time: "08:00" },
  { label: "퇴근", time: "18:30" },
  { label: "등교", time: "07:30" },
  { label: "하교", time: "16:00" },
  { label: "운동", time: "20:00" },
];

export type ActivityEntry = {
  id: string;
  label: string;
  time: string;
  notify: boolean;
};
