import { useEffect, useRef } from "react";

import type { ChatMessage as ChatMessageType } from "../constants";
import { ChatMessage } from "./chat-message";
import { ChatTypingIndicator } from "./chat-typing-indicator";

type ChatMessageListProps = {
  messages: ChatMessageType[];
  isPending: boolean;
};

export function ChatMessageList({ messages, isPending }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isPending && <ChatTypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
