const BACK_ICON = 'http://localhost:3845/assets/7eed9ded4b1a6533c8e86d9b238a06e418256b97.svg'

type SettingsHeaderProps = {
  onBack?: () => void
}

export function SettingsHeader({ onBack }: SettingsHeaderProps) {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-20 items-center gap-3 border-b border-black/10 bg-white/95 px-4 backdrop-blur-sm">
      <button
        onClick={onBack}
        className="flex size-9 items-center justify-center rounded-[8px]"
      >
        <img src={BACK_ICON} alt="뒤로" className="size-4" />
      </button>
      <div className="flex flex-col">
        <p className="text-xl font-medium leading-7 tracking-tight text-[#0a0a0a]">개인 설정</p>
        <p className="text-sm text-[#717182]">환경 정보 맞춤 설정을 관리하세요</p>
      </div>
    </div>
  )
}
