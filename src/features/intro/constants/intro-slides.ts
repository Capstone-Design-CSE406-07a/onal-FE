import { Cloud, type LucideIcon } from "lucide-react";

export type IntroSlide = {
  id: string;
  icon?: LucideIcon;
  image?: string;
  title: string;
  description: string;
};

export const INTRO_SLIDES: IntroSlide[] = [
  {
    id: "welcome",
    icon: Cloud,
    title: "나에게 딱 맞는 환경 정보, ONAL",
    description: "날씨와 대기질을 내 체질·민감도에 맞춰\n 개인화해 보여주는 환경 앱이에요.",
  },
  {
    id: "heatmap",
    image: "/images/intro-1.png",
    title: "전국 환경을 한눈에",
    description:
      "대기질·체감온도·복합 위험도를 지도에서 보고,\n ±12시간 예보를 슬라이더로 살펴보세요.",
  },
  {
    id: "felt",
    image: "/images/intro-3.png",
    title: "내가 느끼는 그대로",
    description:
      "온보딩에서 측정한 체감 성향과 생활 지표로,\n 실제 기온이 아닌 '내 체감 온도·위험도'를 계산해요.",
  },
  {
    id: "ai",
    image: "/images/intro-4.png",
    title: "궁금하면 물어보세요",
    description:
      "내 민감군·활동 시간·관심 장소를 바탕으로\n AI가 '지금 외출해도 돼?' 같은 질문에 답해드려요.",
  },
];
