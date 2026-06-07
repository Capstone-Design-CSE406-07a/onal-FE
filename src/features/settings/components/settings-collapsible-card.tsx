import { ChevronDown } from "lucide-react";

type SettingsCollapsibleCardProps = {
  iconSrc: string;
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export function SettingsCollapsibleCard({
  iconSrc,
  title,
  description,
  isOpen,
  onToggle,
  children,
}: SettingsCollapsibleCardProps) {
  return (
    <div className="rounded-[14px] border border-black/10 bg-white p-px">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 rounded-[13px] px-6 py-6"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(190,211,238,0.1)]">
          <img src={iconSrc} alt="" className="size-5 object-contain" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[18px] font-medium tracking-tight text-[#0a0a0a]">{title}</p>
          <p className="text-sm text-[#717182]">{description}</p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="mx-0 h-px bg-black/10" />
          <div className="px-6 pb-6 pt-6">{children}</div>
        </>
      )}
    </div>
  );
}
