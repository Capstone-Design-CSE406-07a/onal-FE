export type SensitiveGroup = 'general' | 'asthma' | 'infant' | 'elderly'
export type TemperatureFeeling = 'cold' | 'cool' | 'comfortable' | 'warm' | 'hot'
export type SettingsCardKey = 'sensitive' | 'activity' | 'places' | 'temperature'
export type PlaceIconType = 'home' | 'work' | 'school' | 'hospital' | 'other'
export const TEMPERATURE_POINTS = [0, 10, 20, 30] as const
export type TemperaturePoint = (typeof TEMPERATURE_POINTS)[number]

export type ActivityTime = {
  id: string
  name: string
  time: string
  alertEnabled: boolean
}

export type FavoritePlace = {
  id: string
  name: string
  address: string
  icon: PlaceIconType
}

export type TemperaturePreferences = Record<TemperaturePoint, TemperatureFeeling | null>

export type NotificationSettings = {
  dustAlert: boolean
  activityForecast: boolean
  emergencyAlert: boolean
}

export const SENSITIVE_GROUPS: { key: SensitiveGroup; label: string; description: string }[] = [
  { key: 'general', label: '일반', description: '특별한 건강 민감도 없음' },
  { key: 'asthma', label: '천식·호흡기', description: '미세먼지·오존 경보 강화' },
  { key: 'infant', label: '영유아 동반', description: '자외선·기온·대기질 복합 위험도' },
  { key: 'elderly', label: '노인', description: '체감온도·열사병 경보 강화' },
]

export const ACTIVITY_PRESETS: { name: string; time: string }[] = [
  { name: '출근', time: '08:00' },
  { name: '퇴근', time: '18:30' },
  { name: '등교', time: '07:30' },
  { name: '하교', time: '16:00' },
  { name: '운동', time: '06:00' },
]

export const TEMPERATURE_FEELINGS: { key: TemperatureFeeling; emoji: string; label: string }[] = [
  { key: 'cold', emoji: '🥶', label: '춥다' },
  { key: 'cool', emoji: '😊', label: '시원하다' },
  { key: 'comfortable', emoji: '😌', label: '적당하다' },
  { key: 'warm', emoji: '😅', label: '따뜻하다' },
  { key: 'hot', emoji: '🥵', label: '덥다' },
]

export const PLACE_ICONS: { key: PlaceIconType; label: string; src: string }[] = [
  { key: 'home', label: '집', src: 'http://localhost:3845/assets/12e47bbac815415faf2cb03bd61b95989670495d.svg' },
  { key: 'work', label: '직장', src: 'http://localhost:3845/assets/bc162bb3d51ce129167ba4a49ad072d340c63d30.svg' },
  { key: 'school', label: '학교', src: 'http://localhost:3845/assets/64cccbb76c9159b1d95cf54f892ca1695200ba33.svg' },
  { key: 'hospital', label: '병원', src: 'http://localhost:3845/assets/22dc6e8280ef5155a00069a1655ea0bf3a408c44.svg' },
  { key: 'other', label: '기타', src: 'http://localhost:3845/assets/5d6b7af61d718f760715de64bcf6d95e36b65da7.svg' },
]

export const MAX_ACTIVITY_TIMES = 5
export const MAX_FAVORITE_PLACES = 5
