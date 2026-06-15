import { useQuery } from "@tanstack/react-query";

import {
  getPm,
  getPmNationwide,
  getTempWind,
  getTempWindNationwide,
  getUv,
  getUvNationwide,
} from "@/shared/api/weather";
import { DEFAULT_CENTER } from "../constants";

// 한 번 성공적으로 받으면 세션 내내 캐시 유지 — 레이어를 오가도 다시 부르지 않고,
// 떴던 데이터가 사라지지 않는다.
//
// 재시도는 일부러 끈다(전역 retry:false 유지). pm 429는 백엔드가 끌어오는 외부
// 에어코리아 API의 호출 한도 초과라, 재시도해도 한도가 풀리기 전엔 회복되지 않고
// 외부 한도만 더 소모해 역효과다. 대신 한도 초과로 비는 레이어는 상위(MapView)에서
// 에러로 감지해 안내 화면을 띄운다.
const WEATHER_OPTIONS = { staleTime: Infinity, gcTime: Infinity } as const;

// nationwide 호출은 백엔드가 250개 지역에 외부 API를 쏘는 무거운 요청이라,
// 활성 레이어에 필요한 것만 enabled 로 조건부 로드해 429(요청량 초과)를 줄인다.
export function usePmNationwide(enabled = true) {
  return useQuery({
    queryKey: ["weather", "pm", "nationwide"],
    queryFn: getPmNationwide,
    ...WEATHER_OPTIONS,
    enabled,
  });
}

export function useTempWindNationwide(enabled = true) {
  return useQuery({
    queryKey: ["weather", "tempWind", "nationwide"],
    queryFn: getTempWindNationwide,
    ...WEATHER_OPTIONS,
    enabled,
  });
}

export function useUvNationwide(enabled = true) {
  return useQuery({
    queryKey: ["weather", "uv", "nationwide"],
    queryFn: getUvNationwide,
    ...WEATHER_OPTIONS,
    enabled,
  });
}

export function usePmAtCenter() {
  return useQuery({
    queryKey: ["weather", "pm", "center"],
    queryFn: () => getPm(DEFAULT_CENTER[1], DEFAULT_CENTER[0]),
    ...WEATHER_OPTIONS,
  });
}

export function useTempWind() {
  return useQuery({ queryKey: ["weather", "tempWind"], queryFn: getTempWind, ...WEATHER_OPTIONS });
}

export function useUv() {
  return useQuery({ queryKey: ["weather", "uv"], queryFn: getUv, ...WEATHER_OPTIONS });
}
