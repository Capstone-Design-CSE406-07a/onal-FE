import { ActivityTimeTab } from '../components/activity-time-tab'
import { FavoritePlacesTab } from '../components/favorite-places-tab'
import { NotificationCard } from '../components/notification-card'
import { SensitiveGroupTab } from '../components/sensitive-group-tab'
import { SettingsCollapsibleCard } from '../components/settings-collapsible-card'
import { SettingsHeader } from '../components/settings-header'
import { TemperatureTab } from '../components/temperature-tab'
import type { UseSettingsStateReturn } from '../hooks/use-settings-state'

const SENSITIVE_ICON = 'http://localhost:3845/assets/c469c8b9cf5522acfb595768d3949748f208ada9.svg'
const ACTIVITY_ICON = 'http://localhost:3845/assets/6213a88d11b3715cc5d64283e22bab8b0796a14c.svg'
const PLACES_ICON = 'http://localhost:3845/assets/a146f6c97a7f8b90235b5acd5411e493e95fcb8f.svg'
const TEMP_ICON = 'http://localhost:3845/assets/f54195ed51c41dfba265351e5ca606a54cb62305.svg'

type SettingsContainerProps = UseSettingsStateReturn & {
  onBack?: () => void
}

export function SettingsContainer({
  onBack,
  expandedCard,
  toggleCard,
  notifications,
  toggleNotification,
  selectedGroups,
  toggleSensitiveGroup,
  activityTimes,
  addActivityTime,
  removeActivityTime,
  toggleActivityAlert,
  favoritePlaces,
  addFavoritePlace,
  removeFavoritePlace,
  temperaturePrefs,
  setTemperatureFeeling,
}: SettingsContainerProps) {
  return (
    <div
      className="relative flex min-h-full w-full flex-col bg-white"
      style={{
        background: 'linear-gradient(110.633deg, rgba(190,211,238,0.1) 0%, #fff 50%, rgba(190,211,238,0.05) 100%)',
      }}
    >
      <SettingsHeader onBack={onBack} />

      <div className="flex flex-col gap-3 px-4 pb-8 pt-[96px]">
        <NotificationCard
          dustAlert={notifications.dustAlert}
          activityForecast={notifications.activityForecast}
          emergencyAlert={notifications.emergencyAlert}
          onToggle={toggleNotification}
        />

        <div className="h-px bg-black/10" />

        <p className="px-2 text-[18px] font-medium text-[#0a0a0a]">맞춤 설정</p>

        <SettingsCollapsibleCard
          iconSrc={SENSITIVE_ICON}
          title="민감군 설정"
          description="건강 특성에 맞는 환경 정보 제공"
          isOpen={expandedCard === 'sensitive'}
          onToggle={() => toggleCard('sensitive')}
        >
          <SensitiveGroupTab
            selectedGroups={selectedGroups}
            onToggle={toggleSensitiveGroup}
            onSave={() => toggleCard('sensitive')}
          />
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc={ACTIVITY_ICON}
          title="활동 시간대"
          description="외출·이동 시간대 관리"
          isOpen={expandedCard === 'activity'}
          onToggle={() => toggleCard('activity')}
        >
          <ActivityTimeTab
            activityTimes={activityTimes}
            onAdd={addActivityTime}
            onRemove={removeActivityTime}
            onToggleAlert={toggleActivityAlert}
            onSave={() => toggleCard('activity')}
          />
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc={PLACES_ICON}
          title="관심 장소"
          description="자주 방문하는 장소 등록"
          isOpen={expandedCard === 'places'}
          onToggle={() => toggleCard('places')}
        >
          <FavoritePlacesTab
            places={favoritePlaces}
            onAdd={addFavoritePlace}
            onRemove={removeFavoritePlace}
            onSave={() => toggleCard('places')}
          />
        </SettingsCollapsibleCard>

        <SettingsCollapsibleCard
          iconSrc={TEMP_ICON}
          title="체감 온도 성향"
          description="개인별 온도 체감 프로파일"
          isOpen={expandedCard === 'temperature'}
          onToggle={() => toggleCard('temperature')}
        >
          <TemperatureTab
            prefs={temperaturePrefs}
            onSelect={setTemperatureFeeling}
            onSave={() => toggleCard('temperature')}
          />
        </SettingsCollapsibleCard>

        <div className="mt-3 rounded-[14px] border border-black/10 bg-white p-px">
          <div className="flex items-center justify-between rounded-[13px] px-4 py-4">
            <div>
              <p className="text-base font-medium text-[#0a0a0a]">계정</p>
              <p className="text-sm text-[#717182]">user@example.com</p>
            </div>
            <button className="rounded-[8px] border border-black/10 px-3 py-1.5 text-sm font-medium text-[#0a0a0a]">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
