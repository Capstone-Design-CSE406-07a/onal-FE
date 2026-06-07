const BELL_ICON = 'http://localhost:3845/assets/ec590948525f0e24a2fdd4f64683d729023f5a8e.svg'
const ROW_ICON = 'http://localhost:3845/assets/d2c16fa7886101a749938f5f2a48e02dea3d5a52.svg'

type NotificationRowProps = {
  label: string
  enabled: boolean
  onToggle: () => void
}

function NotificationRow({ label, enabled, onToggle }: NotificationRowProps) {
  return (
    <div className="flex h-11 items-center justify-between rounded-[10px] bg-[rgba(233,242,251,0.5)] px-3 py-3">
      <div className="flex items-center gap-3">
        <img src={ROW_ICON} alt="" className="size-4" />
        <span className="text-sm text-[#0a0a0a]">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? 'bg-[#bed3ee]' : 'bg-gray-200'}`}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

type NotificationCardProps = {
  dustAlert: boolean
  activityForecast: boolean
  emergencyAlert: boolean
  onToggle: (key: 'dustAlert' | 'activityForecast' | 'emergencyAlert') => void
}

export function NotificationCard({ dustAlert, activityForecast, emergencyAlert, onToggle }: NotificationCardProps) {
  return (
    <div className="rounded-[14px] border border-black/10 bg-white p-px">
      <div className="flex flex-col gap-4 rounded-[13px] p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(190,211,238,0.1)]">
            <img src={BELL_ICON} alt="" className="size-5" />
          </div>
          <div>
            <p className="text-[18px] font-medium tracking-tight text-[#0a0a0a]">알림 설정</p>
            <p className="text-sm text-[#717182]">환경 정보 알림 수신 설정</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <NotificationRow label="미세먼지 경보" enabled={dustAlert} onToggle={() => onToggle('dustAlert')} />
          <NotificationRow label="활동 시간대 예보" enabled={activityForecast} onToggle={() => onToggle('activityForecast')} />
          <NotificationRow label="긴급 환경 경보" enabled={emergencyAlert} onToggle={() => onToggle('emergencyAlert')} />
        </div>
      </div>
    </div>
  )
}
