import { SENSITIVE_GROUPS } from '../constants'
import type { SensitiveGroup } from '../constants'

const CHECK_ICON = 'http://localhost:3845/assets/d8beaae87a6eabfd69dce1f350096cf0edb896bc.svg'

type SensitiveGroupTabProps = {
  selectedGroups: SensitiveGroup[]
  onToggle: (group: SensitiveGroup) => void
  onSave: () => void
}

export function SensitiveGroupTab({ selectedGroups, onToggle, onSave }: SensitiveGroupTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-5 text-[#717182]">
        건강 특성에 맞는 환경 정보를 제공해드립니다 (복수 선택 가능)
      </p>
      <div className="flex flex-col gap-3">
        {SENSITIVE_GROUPS.map((group) => {
          const selected = selectedGroups.includes(group.key)
          return (
            <button
              key={group.key}
              onClick={() => onToggle(group.key)}
              className={`flex items-center justify-between rounded-[10px] border p-4 text-left transition-colors ${
                selected
                  ? 'border-[#bed3ee] bg-[rgba(190,211,238,0.05)]'
                  : 'border-black/10 bg-white'
              }`}
            >
              <div>
                <p className="text-[18px] font-medium text-[#0a0a0a]">{group.label}</p>
                <p className="text-sm text-[#717182]">{group.description}</p>
              </div>
              {selected && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#bed3ee]">
                  <img src={CHECK_ICON} alt="선택됨" className="size-4" />
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="h-8 rounded-[8px] bg-[#bed3ee] px-3 text-sm font-medium text-[#1a3a52]"
        >
          저장
        </button>
      </div>
    </div>
  )
}
