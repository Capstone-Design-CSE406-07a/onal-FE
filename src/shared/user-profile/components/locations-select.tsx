import { useState } from "react";
import { Building, GraduationCap, Home, Hospital, MoreHorizontal, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/utils";

import {
  LOCATION_ICON_OPTIONS,
  MAX_LOCATIONS,
  type LocationEntry,
  type LocationIconKey,
} from "../constants";

let locationIdCounter = 0;
const nextLocationId = () => `loc-${++locationIdCounter}`;

type LocationsSelectProps = {
  value: LocationEntry[];
  onChange: (next: LocationEntry[]) => void;
};

export function LocationsSelect({ value, onChange }: LocationsSelectProps) {
  const [draftName, setDraftName] = useState("");
  const [draftAddress, setDraftAddress] = useState("");
  const [draftIcon, setDraftIcon] = useState<LocationIconKey>("home");

  const reset = () => {
    setDraftName("");
    setDraftAddress("");
    setDraftIcon("home");
  };

  const add = () => {
    if (!draftName.trim() || value.length >= MAX_LOCATIONS) return;
    onChange([
      ...value,
      {
        id: nextLocationId(),
        name: draftName.trim(),
        address: draftAddress.trim(),
        icon: draftIcon,
      },
    ]);
    reset();
  };

  const remove = (id: string) => onChange(value.filter((v) => v.id !== id));

  return (
    <Card>
      <CardHeader>
        <Typography variant="body1" className="font-semibold text-app-black">
          자주 방문하는 장소
        </Typography>
        <Typography variant="body2" className="text-gray-dark">
          자주 방문하는 장소를 등록하여 해당 지점의 환경 정보를 확인하세요 (최대 {MAX_LOCATIONS}개)
        </Typography>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {value.length > 0 && (
          <div className="flex flex-col gap-3">
            {value.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 rounded-md bg-accent/50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-app-black">
                  {renderLocationIcon(entry.icon)}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <Typography variant="body1" as="span" className="font-medium text-app-black">
                    {entry.name}
                  </Typography>
                  <Typography variant="body2" as="span" className="text-gray-dark">
                    {entry.address}
                  </Typography>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(entry.id)}
                  aria-label="삭제"
                >
                  <X className="h-4 w-4 text-gray-dark" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-md border border-black/10 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="location-name">장소명</Label>
            <Input
              id="location-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="예: 회사, 아이 어린이집"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location-address">주소</Label>
            <Input
              id="location-address"
              value={draftAddress}
              onChange={(e) => setDraftAddress(e.target.value)}
              placeholder="서울시 강남구..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>아이콘</Label>
            <div className="flex gap-2">
              {LOCATION_ICON_OPTIONS.map((opt) => {
                const selected = opt.key === draftIcon;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDraftIcon(opt.key)}
                    className={cn(
                      "flex h-17 flex-1 flex-col items-center justify-center gap-1.5 rounded-md border-[1.5px] text-xs font-medium text-app-black",
                      selected ? "border-primary bg-primary/5" : "border-black/10 bg-white",
                    )}
                  >
                    {renderLocationIcon(opt.key)}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={add}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              추가
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function renderLocationIcon(key: LocationIconKey) {
  const className = "h-5 w-5";
  switch (key) {
    case "home":
      return <Home className={className} />;
    case "work":
      return <Building className={className} />;
    case "school":
      return <GraduationCap className={className} />;
    case "hospital":
      return <Hospital className={className} />;
    case "other":
      return <MoreHorizontal className={className} />;
  }
}
