import { useState } from 'react'

import { MAX_FAVORITE_PLACES, PLACE_ICONS } from '../constants'
import type { FavoritePlace, PlaceIconType } from '../constants'

const ADD_ICON = 'http://localhost:3845/assets/da27d048a849d88c66f8416a43b3f7529d187711.svg'
const EMPTY_ICON = 'http://localhost:3845/assets/a4e1e416796525b609a93000629591d017a9f20c.svg'

type FavoritePlacesTabProps = {
  places: FavoritePlace[]
  onAdd: (name: string, address: string, icon: PlaceIconType) => void
  onRemove: (id: string) => void
  onSave: () => void
}

export function FavoritePlacesTab({ places, onAdd, onRemove, onSave }: FavoritePlacesTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<PlaceIconType>('home')

  function handleAdd() {
    if (!name.trim() || !address.trim()) return
    onAdd(name.trim(), address.trim(), selectedIcon)
    setName('')
    setAddress('')
    setSelectedIcon('home')
    setShowForm(false)
  }

  function handleCancel() {
    setName('')
    setAddress('')
    setSelectedIcon('home')
    setShowForm(false)
  }

  const canAdd = places.length < MAX_FAVORITE_PLACES

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-5 text-[#717182]">
        자주 방문하는 장소를 등록하여 해당 지점의 환경 정보를 확인하세요 (최대 {MAX_FAVORITE_PLACES}개)
      </p>

      {places.length === 0 && !showForm && (
        <div className="flex flex-col items-center gap-3 py-10">
          <img src={EMPTY_ICON} alt="" className="size-12" />
          <p className="text-sm text-[#717182]">등록된 장소가 없습니다</p>
        </div>
      )}

      {places.length > 0 && (
        <div className="flex flex-col gap-2">
          {places.map((place) => {
            const iconData = PLACE_ICONS.find((i) => i.key === place.icon)
            return (
              <div key={place.id} className="flex items-center justify-between rounded-[10px] border border-black/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  {iconData && <img src={iconData.src} alt="" className="size-5" />}
                  <div>
                    <p className="text-sm font-medium text-[#0a0a0a]">{place.name}</p>
                    <p className="text-xs text-[#717182]">{place.address}</p>
                  </div>
                </div>
                <button onClick={() => onRemove(place.id)} className="text-sm text-[#717182]">✕</button>
              </div>
            )
          })}
        </div>
      )}

      {canAdd && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex h-9 items-center justify-center gap-1 rounded-[8px] border border-black/10 bg-white text-sm font-medium text-[#0a0a0a]"
        >
          <img src={ADD_ICON} alt="" className="size-4" />
          장소 추가
        </button>
      )}

      {showForm && (
        <div className="flex flex-col gap-4 rounded-[10px] border border-black/10 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">장소명</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 회사, 아이 어린이집"
              className="h-9 rounded-[8px] bg-[#f3f3f5] px-3 text-sm text-[#0a0a0a] outline-none placeholder:text-[#717182]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">주소</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="서울시 강남구..."
              className="h-9 rounded-[8px] bg-[#f3f3f5] px-3 text-sm text-[#0a0a0a] outline-none placeholder:text-[#717182]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">아이콘</label>
            <div className="flex gap-2">
              {PLACE_ICONS.map((icon) => (
                <button
                  key={icon.key}
                  onClick={() => setSelectedIcon(icon.key)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-[10px] border py-3 text-xs font-medium text-[#0a0a0a] transition-colors ${
                    selectedIcon === icon.key
                      ? 'border-[#bed3ee] bg-[rgba(190,211,238,0.05)] shadow-sm'
                      : 'border-black/10'
                  }`}
                >
                  <img src={icon.src} alt={icon.label} className="size-5" />
                  {icon.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!name.trim() || !address.trim()}
              className="flex-1 rounded-[8px] bg-[#bed3ee] py-2 text-sm font-medium text-[#1a3a52] disabled:opacity-50"
            >
              추가
            </button>
            <button
              onClick={handleCancel}
              className="w-14 rounded-[8px] border border-black/10 bg-white py-2 text-sm font-medium text-[#0a0a0a]"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={onSave} className="h-8 rounded-[8px] bg-[#bed3ee] px-3 text-sm font-medium text-[#1a3a52]">
          저장
        </button>
      </div>
    </div>
  )
}
