export const MAX_LOCATIONS = 5;

export type LocationIconKey = "home" | "work" | "school" | "hospital" | "other";

export type LocationIconOption = { key: LocationIconKey; label: string };

export const LOCATION_ICON_OPTIONS: LocationIconOption[] = [
  { key: "home", label: "집" },
  { key: "work", label: "직장" },
  { key: "school", label: "학교" },
  { key: "hospital", label: "병원" },
  { key: "other", label: "기타" },
];

export type LocationEntry = {
  id: string;
  name: string;
  address: string;
  icon: LocationIconKey;
};
