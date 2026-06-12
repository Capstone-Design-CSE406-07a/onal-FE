import { useEffect, useRef } from "react";
import { Wind } from "lucide-react";

import type { ChatMessage as ChatMessageType } from "../constants";
import { useTypewriter } from "../hooks/use-typewriter";
import { formatTime } from "../utils/format-time";
import { ChatMarkdown } from "./chat-markdown";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { displayed, isTyping } = useTypewriter(message.content, !isUser);
  const ref = useRef<HTMLDivElement>(null);

  // 타이핑이 진행되는 동안 버블 하단이 보이도록 따라간다.
  useEffect(() => {
    if (isTyping) ref.current?.scrollIntoView({ block: "end" });
  }, [displayed, isTyping]);

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
    <div ref={ref} className="flex items-start gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Wind className="size-4 text-primary" />
      </span>
      <div className="max-w-[75%] rounded-[14px] border border-black/10 bg-accent px-3 py-3">
        <ChatMarkdown content={displayed} />
        {isTyping && (
          <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-app-black/70 align-middle" />
        )}
        {!isTyping && (
          <p className="mt-2 text-xs text-gray-dark">{formatTime(message.createdAt)}</p>
        )}
      </div>
    </div>
  );
}
