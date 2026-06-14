import {
  ActivityTimeSelect,
  LocationsSelect,
  ScoreProfileSelect,
  SensitiveGroupSelect,
  TemperatureSelect,
} from "@/features/user-profile";
import { Button } from "@/shared/ui/button";

import { SettingsCollapsibleCard } from "../components/settings-collapsible-card";
import { SettingsHeader } from "../components/settings-header";
import type { SettingsCardKey } from "../constants";
import type { UseSettingsStateReturn } from "../hooks/use-settings-state";

type SettingsContainerProps = UseSettingsStateReturn & {
  onBack?: () => void;
  email: string;
  onLogout: () => void;
};

export function SettingsContainer({
  onBack,
  email,
  onLogout,
  expandedCard,
  toggleCard,
  sensitiveGroups,
  setSensitiveGroups,
  activities,
  setActivities,
  locations,
  setLocations,
  tempPreference,
  setTempPreference,
  scoreProfile,
  setScoreProfile,
  save,
  isSaving,
}: SettingsContainerProps) {
  function handleSave(card: SettingsCardKey) {
    save();
    toggleCard(card);
  }

  return (
    <div className="relative flex min-h-full w-full flex-col bg-app-bg">
      <SettingsHeader onBack={onBack} />

      <div className="flex flex-col gap-3 px-4 py-24">
        <p className="px-2 text-[18px] font-medium text-app-black">맞춤 설정</p>

        <SettingsCollapsibleCard
          iconSrc="/icons/setting/user.svg"
          title="민감군 설정"
          description="건강 특성에 맞는 환경 정보 제공"
          isOpen={expandedCard === "sensitive"}
          onToggle={() => toggleCard("sensitive")}
        >
          <div className="flex flex-col gap-4">
            <SensitiveGroupSelect value={sensitiveGroups} onChange={setSensitiveGroups} />
            <SaveButton onClick={() => handleSave("sensitive")} isSaving={isSaving} />
          </div>
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc="/icons/setting/clock.svg"
          title="활동 시간대"
          description="외출·이동 시간대 관리"
          isOpen={expandedCard === "activity"}
          onToggle={() => toggleCard("activity")}
        >
          <div className="flex flex-col gap-4">
            <ActivityTimeSelect value={activities} onChange={setActivities} />
            <SaveButton onClick={() => handleSave("activity")} isSaving={isSaving} />
          </div>
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc="/icons/main/location.svg"
          title="관심 장소"
          description="자주 방문하는 장소 등록"
          isOpen={expandedCard === "places"}
          onToggle={() => toggleCard("places")}
        >
          <div className="flex flex-col gap-4">
            <LocationsSelect value={locations} onChange={setLocations} />
            <SaveButton onClick={() => handleSave("places")} isSaving={isSaving} />
          </div>
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc="/icons/setting/temperature.svg"
          title="체감 온도 성향"
          description="개인별 온도 체감 프로파일"
          isOpen={expandedCard === "temperature"}
          onToggle={() => toggleCard("temperature")}
        >
          <div className="flex flex-col gap-4">
            <TemperatureSelect value={tempPreference} onChange={setTempPreference} />
            <SaveButton onClick={() => handleSave("temperature")} isSaving={isSaving} />
          </div>
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc="/icons/setting/stack.svg"
          title="종합 체감 프로파일"
          description="더 정확한 맞춤 정보를 위한 추가 정보"
          isOpen={expandedCard === "score"}
          onToggle={() => toggleCard("score")}
        >
          <div className="flex flex-col gap-4">
            <ScoreProfileSelect value={scoreProfile} onChange={setScoreProfile} />
            <SaveButton onClick={() => handleSave("score")} isSaving={isSaving} />
          </div>
        </SettingsCollapsibleCard>

        <div className="mt-3 rounded-[14px] border border-black/10 bg-white p-px">
          <div className="flex items-center justify-between rounded-[13px] px-4 py-4">
            <div>
              <p className="text-base font-medium text-app-black">계정</p>
              <p className="text-sm text-gray-dark">{email}</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-[8px] border border-black/10 px-3 py-1.5 text-sm font-medium text-app-black"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SaveButtonProps = {
  onClick: () => void;
  isSaving: boolean;
};

function SaveButton({ onClick, isSaving }: SaveButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isSaving}
      className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {isSaving ? "저장 중…" : "저장"}
    </Button>
  );
}
