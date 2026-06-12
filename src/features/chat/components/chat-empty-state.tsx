import { Wind } from "lucide-react";

import { Typography } from "@/shared/ui/typography";

import { FAQ_ITEMS } from "../constants";
import { FaqButton } from "./faq-button";

type ChatEmptyStateProps = {
  onSelectFaq: (label: string) => void;
};

export function ChatEmptyState({ onSelectFaq }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center pt-8">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Wind className="size-8 text-primary" />
        </span>
        <Typography variant="h3" className="mt-4 text-app-black">
          무엇을 도와드릴까요?
        </Typography>
        <Typography variant="body2" className="mt-3 text-gray-dark">
          환경 정보에 대해 자유롭게 질문해보세요
        </Typography>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="body2" className="px-2 font-medium text-app-black">
          자주 묻는 질문
        </Typography>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <FaqButton key={item.id} item={item} onSelect={onSelectFaq} />
          ))}
        </div>
      </div>
    </div>
  );
}
