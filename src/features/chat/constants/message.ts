export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
};

/** 에이전트 응답 실패 시 사용자에게 노출하는 폴백 메시지. */
export const AGENT_ERROR_MESSAGE = "답변을 불러오지 못했어요. 잠시 후 다시 시도해주세요.";
