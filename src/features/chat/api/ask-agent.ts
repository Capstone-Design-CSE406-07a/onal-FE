import { apiClient } from "@/shared/api/client";

export type AskAgentRequest = {
  prompt: string;
};

export type AskAgentResponse = {
  answer: string;
};

// googleId는 백엔드가 세션(req.user)에서 읽으므로 바디에 담지 않는다.
// apiClient가 credentials: "include"로 세션 쿠키를 함께 전송한다.
export function postAskAgent(payload: AskAgentRequest): Promise<AskAgentResponse> {
  return apiClient<AskAgentResponse>("/ai-agent/question/agent", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
