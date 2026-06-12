import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

type ChatHeaderProps = {
  onBack: () => void;
};

export function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-black/10 bg-white/95 px-4 py-4 backdrop-blur">
      <Button variant="icon" size="icon" onClick={onBack} aria-label="뒤로 가기">
        <ArrowLeft className="size-4" />
      </Button>
      <div className="flex flex-col">
        <Typography variant="h3" className="text-app-black">
          AI 환경 도우미
        </Typography>
        <Typography variant="body2" className="mt-1 text-gray-dark">
          맞춤형 환경 정보를 물어보세요
        </Typography>
      </div>
    </header>
  );
}
