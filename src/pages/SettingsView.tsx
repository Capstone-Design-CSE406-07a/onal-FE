import { useNavigate } from 'react-router-dom'

import { SettingsContainer } from '../features/settings/containers/settings-container'
import { useSettingsState } from '../features/settings/hooks/use-settings-state'

export function SettingsView() {
  const navigate = useNavigate()
  const state = useSettingsState()

  return <SettingsContainer {...state} onBack={() => navigate(-1)} />
}
