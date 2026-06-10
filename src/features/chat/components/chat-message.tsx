import { Wind } from "lucide-react";

import type { ChatMessage as ChatMessageType } from "../constants";
import { formatTime } from "../utils/format-time";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-[14px] border border-black/10 bg-primary px-3 py-3">
          <p className="text-sm leading-relaxed text-primary-foreground">{message.content}</p>
          <p className="mt-2 text-xs text-primary-foreground/70">{formatTime(message.createdAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Wind className="size-4 text-primary" />
      </span>
      <div className="max-w-[75%] rounded-[14px] border border-black/10 bg-accent px-3 py-3">
        <p className="text-sm leading-relaxed text-app-black">{message.content}</p>
        <p className="mt-2 text-xs text-gray-dark">{formatTime(message.createdAt)}</p>
      </div>
    </div>
  );
}
