import type { TempScaleValue } from "@/shared/lib/temperature-interpolation";

export type {
  TempScaleValue,
  TemperaturePreference,
  TempReferencePoint,
} from "@/shared/lib/temperature-interpolation";
export { TEMP_REFERENCE_POINTS } from "@/shared/lib/temperature-interpolation";

type CircleConfig = {
  value: TempScaleValue
  twSize: string
  borderColor: string
  selectedBg: string
}

export const TEMP_CIRCLES: CircleConfig[] = [
  { value: 1, twSize: 'size-9',  borderColor: 'border-[#9ABDE9]', selectedBg: 'bg-[#9ABDE9]/30' },
  { value: 2, twSize: 'size-8',  borderColor: 'border-[#B0BBE2]', selectedBg: 'bg-[#B0BBE2]/30' },
  { value: 3, twSize: 'size-6',  borderColor: 'border-[#C7B9DC]', selectedBg: 'bg-[#C7B9DC]/30' },
  { value: 4, twSize: 'size-4',  borderColor: 'border-purple',    selectedBg: 'bg-purple/30'    },
  { value: 5, twSize: 'size-6',  borderColor: 'border-[#E3A5B9]', selectedBg: 'bg-[#E3A5B9]/30' },
  { value: 6, twSize: 'size-8',  borderColor: 'border-[#E9939D]', selectedBg: 'bg-[#E9939D]/30' },
  { value: 7, twSize: 'size-9',  borderColor: 'border-red',       selectedBg: 'bg-red/30'       },
]
