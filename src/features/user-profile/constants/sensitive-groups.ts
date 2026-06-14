export type SensitiveGroupKey = "normal" | "respiratory" | "infant" | "elderly";

export type SensitiveGroup = {
  key: SensitiveGroupKey;
  title: string;
  description: string;
  emoji: string;
};

export const SENSITIVE_GROUPS: SensitiveGroup[] = [
  { key: "normal", title: "일반", description: "특별한 건강 민감도 없음", emoji: "👤" },
  {
    key: "respiratory",
    title: "천식·호흡기",
    description: "미세먼지·오존 경보 강화",
    emoji: "🌬️",
  },
  {
    key: "infant",
    title: "영유아 동반",
    description: "자외선·기온·대기질 복합 위험도",
    emoji: "👶",
  },
  { key: "elderly", title: "노인", description: "체감온도·열사병 경보 강화", emoji: "👴" },
];
