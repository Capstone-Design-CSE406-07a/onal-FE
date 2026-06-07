import { SettingsContainer } from '../features/settings/containers/settings-container'
import { useSettingsState } from '../features/settings/hooks/use-settings-state'

export function SettingsView() {
  const state = useSettingsState()

  return <SettingsContainer {...state} />
}
