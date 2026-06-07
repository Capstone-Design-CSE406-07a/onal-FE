import { useState } from 'react'

import { ACTIVITY_PRESETS, MAX_ACTIVITY_TIMES } from '../constants'
import type { ActivityTime } from '../constants'

const CLOCK_ICON = 'http://localhost:3845/assets/e877f144d5e5003fa59ae583012fef64ed938217.svg'

type ActivityTimeTabProps = {
  activityTimes: ActivityTime[]
  onAdd: (name: string, time: string) => void
  onRemove: (id: string) => void
  onToggleAlert: (id: string) => void
  onSave: () => void
}

export function ActivityTimeTab({ activityTimes, onAdd, onRemove, onToggleAlert, onSave }: ActivityTimeTabProps) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')

  function handleAdd() {
    if (!name.trim() || !time) return
    onAdd(name.trim(), time)
    setName('')
    setTime('')
  }

  function handleCancel() {
    setName('')
    setTime('')
  }

  function handlePreset(preset: { name: string; time: string }) {
    onAdd(preset.name, preset.time)
  }

  const canAdd = activityTimes.length < MAX_ACTIVITY_TIMES

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-5 text-[#717182]">
        외출·이동 시간대를 등록하면 맞춤 예보를 제공합니다 (최대 {MAX_ACTIVITY_TIMES}개)
      </p>

      {activityTimes.length > 0 && (
        <div className="flex flex-col gap-2">
          {activityTimes.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-[10px] border border-black/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={CLOCK_ICON} alt="" className="size-4" />
                <span className="text-sm font-medium text-[#0a0a0a]">{item.name} {item.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleAlert(item.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.alertEnabled ? 'bg-[#bed3ee]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${item.alertEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <button onClick={() => onRemove(item.id)} className="ml-1 text-sm text-[#717182]">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[#0a0a0a]">프리셋</p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePreset(preset)}
                  className="flex items-center gap-1 rounded-[8px] border border-black/10 bg-white px-2.5 py-1.5 text-sm font-medium text-[#0a0a0a]"
                >
                  <img src={CLOCK_ICON} alt="" className="size-4" />
                  {preset.name} {preset.time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[10px] border border-black/10 p-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="시간대 이름 (예: 점심시간)"
              className="h-9 rounded-[8px] bg-[#f3f3f5] px-3 text-sm text-[#0a0a0a] outline-none placeholder:text-[#717182]"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 rounded-[8px] bg-[#f3f3f5] px-3 text-sm text-[#0a0a0a] outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!name.trim() || !time}
                className="flex-1 rounded-[8px] bg-[#bed3ee] py-2 text-sm font-medium text-[#1a3a52] disabled:opacity-50"
              >
                추가
              </button>
              <button
                onClick={handleCancel}
                className="w-14 rounded-[8px] border border-black/10 bg-white py-2 text-sm font-medium text-[#0a0a0a]"
              >
                취소
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button onClick={onSave} className="h-8 rounded-[8px] bg-[#bed3ee] px-3 text-sm font-medium text-[#1a3a52]">
          저장
        </button>
      </div>
    </div>
  )
}
