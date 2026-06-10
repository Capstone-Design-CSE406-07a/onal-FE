import type { FaqItem } from "../constants";

type FaqButtonProps = {
  item: FaqItem;
  onSelect: (label: string) => void;
};

export function FaqButton({ item, onSelect }: FaqButtonProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.label)}
      className="flex w-full items-center gap-3 rounded-lg border border-black/10 bg-white px-3 py-3 text-left transition-colors hover:bg-gray-light"
    >
      <Icon className="size-4 shrink-0 text-primary" />
      <span className="text-sm font-medium text-app-black">{item.label}</span>
    </button>
  );
}
