import type { TempScaleValue } from "@/shared/lib/temperature-interpolation";

export type {
  TempScaleValue,
  TemperaturePreference,
  TempReferencePoint,
} from "@/shared/lib/temperature-interpolation";
export { TEMP_REFERENCE_POINTS } from "@/shared/lib/temperature-interpolation";

type CircleConfig = {
  value: TempScaleValue;
  twSize: string;
  borderColor: string;
  selectedBg: string;
};

export const TEMP_CIRCLES: CircleConfig[] = [
  { value: 1, twSize: "size-9", borderColor: "border-temp-cold", selectedBg: "bg-temp-cold/30" },
  { value: 2, twSize: "size-8", borderColor: "border-temp-cool", selectedBg: "bg-temp-cool/30" },
  { value: 3, twSize: "size-6", borderColor: "border-temp-mild", selectedBg: "bg-temp-mild/30" },
  { value: 4, twSize: "size-4", borderColor: "border-purple", selectedBg: "bg-purple/30" },
  { value: 5, twSize: "size-6", borderColor: "border-temp-warm", selectedBg: "bg-temp-warm/30" },
  { value: 6, twSize: "size-8", borderColor: "border-temp-hot", selectedBg: "bg-temp-hot/30" },
  { value: 7, twSize: "size-9", borderColor: "border-red", selectedBg: "bg-red/30" },
];
