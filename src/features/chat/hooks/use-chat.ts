import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { postAskAgent } from "../api/ask-agent";
import { AGENT_ERROR_MESSAGE, type ChatMessage } from "../constants";
import { createMessage } from "../utils/create-message";

type UseChatOptions = {
  /** 현재 위치 추적으로 얻은 "OO시 OO구". 위치 확보 전이면 null. */
  dong: string | null;
};

/**
 * AI 채팅 상태 관리 훅.
 * 사용자 메시지를 누적하고 `/ai-agent/question/agent`로 질문을 보내 답변을 받는다.
 */
export function useChat({ dong }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const appendMessage = useCallback((role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [...prev, createMessage(role, content)]);
  }, []);

  const mutation = useMutation({
    mutationFn: (prompt: string) => postAskAgent({ prompt, dong: dong ?? "" }),
    onSuccess: (data) => appendMessage("assistant", data.answer),
    onError: () => appendMessage("assistant", AGENT_ERROR_MESSAGE),
  });

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || mutation.isPending) return;

      appendMessage("user", trimmed);
      mutation.mutate(trimmed);
    },
    [appendMessage, mutation],
  );

  return {
    messages,
    isEmpty: messages.length === 0,
    isPending: mutation.isPending,
    sendMessage,
  };
}
