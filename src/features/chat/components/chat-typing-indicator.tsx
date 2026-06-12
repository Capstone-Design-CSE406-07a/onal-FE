import { Wind } from "lucide-react";

export function ChatTypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Wind className="size-4 text-primary" />
      </span>
      <div className="flex items-center gap-1 rounded-[14px] border border-black/10 bg-accent px-3 py-4">
        <span className="size-1.5 animate-bounce rounded-full bg-gray-dark [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-gray-dark [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-gray-dark" />
      </div>
    </div>
  );
}
