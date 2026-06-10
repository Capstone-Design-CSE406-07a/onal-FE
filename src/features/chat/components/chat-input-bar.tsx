import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type ChatInputBarProps = {
  onSend: (value: string) => void;
  disabled?: boolean;
};

export function ChatInputBar({ onSend, disabled = false }: ChatInputBarProps) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0 && !disabled;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-2 border-t border-black/10 bg-white/95 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur"
    >
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="질문을 입력하세요..."
        disabled={disabled}
        className="flex-1 border-transparent bg-gray-light"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        aria-label="질문 보내기"
        className="bg-primary"
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
}
