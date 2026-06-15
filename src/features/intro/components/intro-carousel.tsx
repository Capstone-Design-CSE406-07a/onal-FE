import { useRef, useState } from "react";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/utils";

import type { IntroSlide } from "../constants";

type IntroCarouselProps = {
  slides: IntroSlide[];
};

// 스와이프 인식 최소 이동량(px).
const SWIPE_THRESHOLD = 40;

export function IntroCarousel({ slides }: IntroCarouselProps) {
  // 현재 슬라이드 인덱스는 이 컴포넌트 안에서만 의미 있는 UI 상태.
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    setActiveIndex(Math.min(slides.length - 1, Math.max(0, index)));
  };

  const handleTouchEnd = (endX: number) => {
    if (touchStartX.current === null) return;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div className="flex w-full flex-col items-center gap-9">
      <div
        className="w-full overflow-hidden"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => {
            const Icon = slide.icon;
            return (
            <div
              key={slide.id}
              className="flex w-full shrink-0 flex-col items-center gap-6 px-2 text-center"
            >
              {Icon && (
                <div className="flex h-80 w-full items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-11 w-11 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
              )}
              {slide.image && (
                <div className="flex h-80 w-full items-center justify-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-auto rounded-2xl object-contain shadow-marker"
                  />
                </div>
              )}
              <div className="flex flex-col items-center gap-3">
                <Typography variant="h3" className="text-app-black">
                  {slide.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="leading-relaxed text-gray-dark whitespace-pre-wrap"
                >
                  {slide.description}
                </Typography>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2" role="tablist" aria-label="서비스 소개 슬라이드">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${index + 1}번째 슬라이드로 이동`}
            onClick={() => goTo(index)}
            className={cn(
              "h-2 cursor-pointer rounded-full transition-all",
              index === activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/25",
            )}
          />
        ))}
      </div>
    </div>
  );
}
