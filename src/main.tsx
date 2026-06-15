import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { UserProvider } from "./shared/contexts/user-provider";

import "./index.css";

// 공공데이터(data.go.kr) API 요청량 제한(429) 대응 — 재시도/자동 리페치를 줄이고
// 캐시를 길게 유지해 호출 횟수를 최소화한다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 429가 나면 재시도가 오히려 폭증을 유발하므로 끔
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 10 * 60 * 1000, // 10분간 신선 → 재요청 안 함
      gcTime: 30 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
