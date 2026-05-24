import { Clock, Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { TimePicker } from "@/shared/ui/time-picker";

import { ACTIVITY_PRESETS, MAX_ACTIVITIES, type ActivityEntry } from "../constants";

let activityIdCounter = 0;
const nextActivityId = (label: string) => `activity-${label}-${++activityIdCounter}`;

type Step2ActivityTimeProps = {
  value: ActivityEntry[];
  onChange: (next: ActivityEntry[]) => void;
};

export function Step2ActivityTime({ value, onChange }: Step2ActivityTimeProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftTime, setDraftTime] = useState("");

  const resetDraft = () => {
    setDraftLabel("");
    setDraftTime("09:00");
  };
  const openForm = () => {
    resetDraft();
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    resetDraft();
  };

  const addPreset = (label: string, time: string) => {
    if (value.length >= MAX_ACTIVITIES) return;
    if (value.some((v) => v.label === label)) return;
    onChange([...value, { id: nextActivityId(label), label, time, notify: true }]);
  };
  const addCustom = () => {
    const label = draftLabel.trim();
    const time = draftTime.trim();
    if (!label || !time) return;
    if (value.length >= MAX_ACTIVITIES) return;
    onChange([...value, { id: nextActivityId(label), label, time, notify: true }]);
    closeForm();
  };
  const toggleNotify = (id: string) => {
    onChange(value.map((v) => (v.id === id ? { ...v, notify: !v.notify } : v)));
  };
  const remove = (id: string) => {
    onChange(value.filter((v) => v.id !== id));
  };

  const full = value.length >= MAX_ACTIVITIES;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">활동 시간대</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="m-0 text-sm text-[#717182]">
          외출·이동 시간대를 등록하면 맞춤 예보를 제공합니다 (최대 {MAX_ACTIVITIES}개)
        </p>

        <div className="flex flex-col gap-3">
          <h4 className="m-0 text-sm font-medium text-[#0a0a0a]">프리셋</h4>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_PRESETS.map((preset) => {
              const used = value.some((v) => v.label === preset.label);
              const full = value.length >= MAX_ACTIVITIES;
              const disabled = used || full;
              return (
                <Button
                  key={preset.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => addPreset(preset.label, preset.time)}
                >
                  <Clock className="h-4 w-4" />
                  <span>
                    {preset.label} {preset.time}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {value.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="m-0 text-sm font-medium text-[#0a0a0a]">등록된 시간대</h4>
            <div className="flex flex-col gap-3">
              {value.map((entry) => {
                const notifyId = `notify-${entry.id}`;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-[10px] bg-[#e9f2fb]/50 p-3"
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-[#0a0a0a]">{entry.label}</span>
                        <span className="text-sm text-[#717182]">{entry.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={notifyId}
                          checked={entry.notify}
                          onCheckedChange={() => toggleNotify(entry.id)}
                          aria-label="알림 토글"
                          className="data-[state=checked]:bg-[#bed3ee]"
                        />
                        <Label htmlFor={notifyId} className="text-xs font-medium text-[#717182]">
                          알림 받기
                        </Label>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(entry.id)}
                      aria-label="삭제"
                    >
                      <X className="h-4 w-4 text-[#717182]" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {formOpen ? (
          <div className="flex flex-col gap-4 rounded-[10px] border border-black/10 p-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-label">이름</Label>
              <Input
                id="activity-label"
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                placeholder="예: 산책, 운동"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-time">시간</Label>
              <TimePicker
                id="activity-time"
                ariaLabel="시간 선택"
                value={draftTime || "09:00"}
                onChange={setDraftTime}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={addCustom}
                disabled={!draftLabel.trim() || !draftTime.trim() || full}
                className="flex-1 bg-[#bed3ee] text-[#1a3a52] hover:bg-[#bed3ee]/90"
              >
                추가
              </Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={full}
            onClick={openForm}
          >
            <Plus className="h-4 w-4" />
            <span>직접 입력</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
