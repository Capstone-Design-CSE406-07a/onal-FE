import { TEMPERATURE_FEELINGS, TEMPERATURE_POINTS } from '../constants'
import type { TemperatureFeeling, TemperaturePoint, TemperaturePreferences } from '../constants'

type TemperatureTabProps = {
  prefs: TemperaturePreferences
  onSelect: (temp: TemperaturePoint, feeling: TemperatureFeeling) => void
  onSave: () => void
}

const TEMP_EMOJI_MAP: Record<TemperaturePoint, string> = {
  0: '🥶',
  10: '😊',
  20: '😅',
  30: '🥵',
}

export function TemperatureTab({ prefs, onSelect, onSave }: TemperatureTabProps) {
  const completedCount = TEMPERATURE_POINTS.filter((t) => prefs[t] !== null).length

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-5 text-[#717182] w-[231px]">
        각 온도에서의 체감을 선택하면 더 정확한 기온 안내를 받을 수 있어요
      </p>

      <div className="flex flex-col gap-8">
        {TEMPERATURE_POINTS.map((temp) => (
          <div key={temp} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-[#0a0a0a]">{temp}°C</span>
              <span className="text-2xl">{TEMP_EMOJI_MAP[temp]}</span>
            </div>
            <div className="flex gap-2">
              {TEMPERATURE_FEELINGS.map((feeling) => {
                const selected = prefs[temp] === feeling.key
                return (
                  <button
                    key={feeling.key}
                    onClick={() => onSelect(temp, feeling.key)}
                    className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-[10px] border py-2 text-center transition-colors ${
                      selected
                        ? 'border-[#bed3ee] bg-[rgba(190,211,238,0.1)] shadow-md'
                        : 'border-black/10'
                    }`}
                  >
                    <span className="text-2xl leading-8">{feeling.emoji}</span>
                    <span className="text-[10px] font-medium text-[#0a0a0a]">{feeling.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-[#717182]">
        {completedCount} / {TEMPERATURE_POINTS.length} 완료
      </p>

      <div className="flex justify-end">
        <button onClick={onSave} className="h-8 rounded-[8px] bg-[#bed3ee] px-3 text-sm font-medium text-[#1a3a52]">
          저장
        </button>
      </div>
    </div>
  )
}
