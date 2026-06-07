import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const MINUTE_STEP = 5;

type Period = "AM" | "PM";

type TimePickerProps = {
  value: string;
  onChange: (next: string) => void;
  id?: string;
  ariaLabel?: string;
};

export function TimePicker({ value, onChange, id, ariaLabel }: TimePickerProps) {
  const { period, hour12, minute } = parseTime(value);

  const emit = (parts: { period: Period; hour12: number; minute: number }) => {
    onChange(formatTime(parts));
  };

  return (
    <div id={id} aria-label={ariaLabel} className="flex gap-2">
      <Select value={period} onValueChange={(v) => emit({ period: v as Period, hour12, minute })}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">오전</SelectItem>
          <SelectItem value="PM">오후</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={String(hour12)}
        onValueChange={(v) => emit({ period, hour12: Number(v), minute })}
      >
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={String(h)}>
              {h}시
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(minute)}
        onValueChange={(v) => emit({ period, hour12, minute: Number(v) })}
      >
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {String(m).padStart(2, "0")}분
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function parseTime(value: string): { period: Period; hour12: number; minute: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return { period: "AM", hour12: 9, minute: 0 };
  const hour24 = Number(match[1]);
  const minuteRaw = Number(match[2]);
  const period: Period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  const minute = Math.min(55, Math.round(minuteRaw / MINUTE_STEP) * MINUTE_STEP);
  return { period, hour12, minute };
}

function formatTime({
  period,
  hour12,
  minute,
}: {
  period: Period;
  hour12: number;
  minute: number;
}): string {
  const hour24 =
    period === "AM"
      ? hour12 === 12
        ? 0
        : hour12
      : hour12 === 12
        ? 12
        : hour12 + 12;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
