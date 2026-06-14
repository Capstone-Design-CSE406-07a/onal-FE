import { ChevronLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";

type SettingsHeaderProps = {
  onBack?: () => void;
};

export function SettingsHeader({ onBack }: SettingsHeaderProps) {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex h-20 items-center gap-3 border-b border-black/10 bg-white/95 px-4 backdrop-blur-sm">
      <Button onClick={onBack} variant="icon">
        <ChevronLeft className="size-6" />
      </Button>
      <div className="flex flex-col">
        <p className="text-xl font-medium leading-7 tracking-tight text-app-black">개인 설정</p>
        <p className="text-sm text-gray-dark">환경 정보 맞춤 설정을 관리하세요</p>
      </div>
    </div>
  );
}
