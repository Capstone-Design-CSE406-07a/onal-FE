import { useNavigate } from 'react-router-dom'

import { useUser } from '@/shared/contexts/use-user'
import { clearAuthStorage, getStoredEmail } from '@/shared/lib/auth-storage'

import { SettingsContainer } from '../features/settings/containers/settings-container'
import { useSettingsState } from '../features/settings/hooks/use-settings-state'

export function SettingsView() {
  const navigate = useNavigate()
  const { user, setUser } = useUser()
  const state = useSettingsState()

  const email = getStoredEmail() ?? user?.email ?? ''

  function handleLogout() {
    clearAuthStorage()
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <SettingsContainer
      {...state}
      email={email}
      onLogout={handleLogout}
      onBack={() => navigate(-1)}
    />
  )
}
