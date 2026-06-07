import { http } from './http';
import type {
  PmDataResponse,
  PmNationwideItem,
  PmNearbyItem,
  TempertureWindNationwideItem,
  TempertureWindNearbyItem,
  TempertureWindResponse,
  UvDataResponse,
  UvNationwideItem,
  UvNearbyItem,
} from './types';

type Coords = { lat: number; lng: number };

export const weatherApi = {
  // 현재 위치 기반 단건 조회 (TopInfoPanel용)
  getPm: (coords: Coords) =>
    http.get<PmDataResponse>('/getdata/pm', { params: coords }),

  getTemperatureWind: (coords: Coords) =>
    http.get<TempertureWindResponse>('/getdata/temperture_wind', { params: coords }),

  getUv: (coords: Coords) =>
    http.get<UvDataResponse>('/getdata/uv', { params: coords }),

  // 전국 동별 배열 조회 (히트맵 nationwide 데이터용)
  getPmNationwide: () =>
    http.get<PmNationwideItem[]>('/getdata/pm/nationwide'),

  getTemperatureWindNationwide: () =>
    http.get<TempertureWindNationwideItem[]>('/getdata/temperture_wind/nationwide'),

  getUvNationwide: () =>
    http.get<UvNationwideItem[]>('/getdata/uv/nationwide'),

  // 특정 동 반경 5km 배열 조회 (nearby)
  getPmNearby: (dong: string) =>
    http.get<PmNearbyItem[] | null>('/getdata/pm/nearby', { params: { dong } }),

  getTemperatureWindNearby: (dong: string) =>
    http.get<TempertureWindNearbyItem[] | null>('/getdata/temperture_wind/nearby', { params: { dong } }),

  getUvNearby: (dong: string) =>
    http.get<UvNearbyItem[] | null>('/getdata/uv/nearby', { params: { dong } }),
};
