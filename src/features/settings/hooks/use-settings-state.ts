import { useState } from 'react'

import type {
  ActivityTime,
  FavoritePlace,
  NotificationSettings,
  PlaceIconType,
  SensitiveGroup,
  SettingsCardKey,
  TemperatureFeeling,
  TemperaturePoint,
  TemperaturePreferences,
} from '../constants'
import { MAX_ACTIVITY_TIMES, MAX_FAVORITE_PLACES } from '../constants'

export type UseSettingsStateReturn = {
  expandedCard: SettingsCardKey | null
  toggleCard: (key: SettingsCardKey) => void
  notifications: NotificationSettings
  toggleNotification: (key: keyof NotificationSettings) => void
  selectedGroups: SensitiveGroup[]
  toggleSensitiveGroup: (group: SensitiveGroup) => void
  activityTimes: ActivityTime[]
  addActivityTime: (name: string, time: string) => void
  removeActivityTime: (id: string) => void
  toggleActivityAlert: (id: string) => void
  favoritePlaces: FavoritePlace[]
  addFavoritePlace: (name: string, address: string, icon: PlaceIconType) => void
  removeFavoritePlace: (id: string) => void
  temperaturePrefs: TemperaturePreferences
  setTemperatureFeeling: (temp: TemperaturePoint, feeling: TemperatureFeeling) => void
}

export function useSettingsState(): UseSettingsStateReturn {
  const [expandedCard, setExpandedCard] = useState<SettingsCardKey | null>(null)

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dustAlert: true,
    activityForecast: true,
    emergencyAlert: true,
  })

  const [selectedGroups, setSelectedGroups] = useState<SensitiveGroup[]>(['general'])

  const [activityTimes, setActivityTimes] = useState<ActivityTime[]>([])

  const [favoritePlaces, setFavoritePlaces] = useState<FavoritePlace[]>([])

  const [temperaturePrefs, setTemperaturePrefs] = useState<TemperaturePreferences>({
    0: null,
    10: null,
    20: null,
    30: null,
  })

  function toggleCard(key: SettingsCardKey) {
    setExpandedCard((prev) => (prev === key ? null : key))
  }

  function toggleNotification(key: keyof NotificationSettings) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleSensitiveGroup(group: SensitiveGroup) {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    )
  }

  function addActivityTime(name: string, time: string) {
    if (activityTimes.length >= MAX_ACTIVITY_TIMES) return
    const newItem: ActivityTime = {
      id: `${Date.now()}`,
      name,
      time,
      alertEnabled: true,
    }
    setActivityTimes((prev) => [...prev, newItem])
  }

  function removeActivityTime(id: string) {
    setActivityTimes((prev) => prev.filter((t) => t.id !== id))
  }

  function toggleActivityAlert(id: string) {
    setActivityTimes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, alertEnabled: !t.alertEnabled } : t)),
    )
  }

  function addFavoritePlace(name: string, address: string, icon: PlaceIconType) {
    if (favoritePlaces.length >= MAX_FAVORITE_PLACES) return
    const newPlace: FavoritePlace = { id: `${Date.now()}`, name, address, icon }
    setFavoritePlaces((prev) => [...prev, newPlace])
  }

  function removeFavoritePlace(id: string) {
    setFavoritePlaces((prev) => prev.filter((p) => p.id !== id))
  }

  function setTemperatureFeeling(temp: TemperaturePoint, feeling: TemperatureFeeling) {
    setTemperaturePrefs((prev) => ({ ...prev, [temp]: feeling }))
  }

  return {
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
  }
}
