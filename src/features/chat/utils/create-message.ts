import type { ChatMessage, ChatRole } from "../constants";

/** 채팅 메시지 엔티티를 생성하는 순수 팩토리. */
export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date(),
  };
}
