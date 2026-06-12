import { Activity, Baby, Clock, Sun, Wind, type LucideIcon } from "lucide-react";

export type FaqItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

/**
 * 자주 묻는 질문 목록.
 * CLAUDE.md 시나리오 기준 공통 질문 + 민감군(영유아) 질문으로 구성.
 * TODO: 온보딩 민감군/시간대/장소 정보 기반 동적 생성으로 교체 필요.
 */
export const FAQ_ITEMS: FaqItem[] = [
  { id: "go-outside", label: "지금 외출해도 괜찮아?", icon: Clock },
  { id: "feels-like", label: "오늘 나한테 덥거나 추울까?", icon: Sun },
  { id: "exercise", label: "오늘 운동하기 좋은 날이야?", icon: Activity },
  { id: "dust-recover", label: "미세먼지 언제 나아져?", icon: Wind },
  { id: "park-with-kid", label: "아이 데리고 공원 나가도 돼?", icon: Baby },
];
