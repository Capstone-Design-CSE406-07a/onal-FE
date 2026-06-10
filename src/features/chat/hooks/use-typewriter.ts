import { useEffect, useState } from "react";

const DEFAULT_SPEED_MS = 18;

/**
 * 전달된 텍스트를 한 글자씩 노출하는 타이프라이터 효과.
 * `enabled`가 false면 즉시 전체 텍스트를 반환한다(애니메이션 없음).
 */
export function useTypewriter(text: string, enabled: boolean, speed = DEFAULT_SPEED_MS) {
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled || count >= text.length) return;

    const timer = window.setTimeout(() => setCount((prev) => prev + 1), speed);
    return () => window.clearTimeout(timer);
  }, [enabled, count, text.length, speed]);

  return {
    displayed: text.slice(0, count),
    isTyping: enabled && count < text.length,
  };
}
