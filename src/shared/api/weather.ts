import { apiClient } from "./client";

export type PmPointData = {
  미세먼지: string;
  초미세먼지: string;
  통합대기환경지수: string;
  측정시간: string;
};

export type PmNationwideItem = {
  sido: string;
  sigungu: string;
  dong: string;
  미세먼지: string;
  초미세먼지: string;
  통합대기환경지수: string;
  측정시간: string;
};

export type TempWindPointData = {
  기온: string;
  풍속: string;
  풍향: string;
  습도: string;
  "1시간강수량": string;
  강수형태: string;
};

export type TempWindNationwideItem = {
  sido: string;
  sigungu: string;
  dong: string;
  기온: string;
  풍속: string;
  풍향: string;
  습도: string;
  "1시간강수량": string;
  강수형태: string;
};

export type UvPointData = {
  uv: number;
};

export type UvNationwideItem = {
  sido: string;
  sigungu: string;
  dong: string;
  uv: number;
};

export function getPm(lat: number, lng: number): Promise<PmPointData> {
  return apiClient<PmPointData>(`/getdata/pm?lat=${lat}&lng=${lng}`);
}

export function getPmNationwide(): Promise<PmNationwideItem[]> {
  return apiClient<PmNationwideItem[]>("/getdata/pm/nationwide");
}

export function getTempWind(): Promise<TempWindPointData> {
  return apiClient<TempWindPointData>("/getdata/temperture_wind");
}

export function getTempWindNationwide(): Promise<TempWindNationwideItem[]> {
  return apiClient<TempWindNationwideItem[]>("/getdata/temperture_wind/nationwide");
}

export function getUv(): Promise<UvPointData> {
  return apiClient<UvPointData>("/getdata/uv");
}

export function getUvNationwide(): Promise<UvNationwideItem[]> {
  return apiClient<UvNationwideItem[]>("/getdata/uv/nationwide");
}
