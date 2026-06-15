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
// 떴던 데이터가 사라지지 않는다. (외부 API 429 부담도 최소화)
const CACHE_FOREVER = { staleTime: Infinity, gcTime: Infinity } as const;

// 요약 카드용 단건(point) 호출은 가벼우므로, 429로 실패해도 영구히 빈 채로 남지 않게
// 간격을 둔 재시도를 허용한다(버스트가 가라앉으면 성공 → 영구 캐시).
const POINT_OPTIONS = {
  ...CACHE_FOREVER,
  retry: 4,
  retryDelay: (attempt: number) => Math.min(1500 * 2 ** attempt, 10000),
} as const;

// nationwide 호출은 백엔드가 250개 지역에 외부 API를 쏘는 무거운 요청이라,
// 활성 레이어에 필요한 것만 enabled 로 조건부 로드해 429(요청량 초과)를 줄인다.
export function usePmNationwide(enabled = true) {
  return useQuery({
    queryKey: ["weather", "pm", "nationwide"],
    queryFn: getPmNationwide,
    ...CACHE_FOREVER,
    enabled,
  });
}

export function useTempWindNationwide(enabled = true) {
  return useQuery({
    queryKey: ["weather", "tempWind", "nationwide"],
    queryFn: getTempWindNationwide,
    ...CACHE_FOREVER,
    enabled,
  });
}

export function useUvNationwide(enabled = true) {
  return useQuery({
    queryKey: ["weather", "uv", "nationwide"],
    queryFn: getUvNationwide,
    ...CACHE_FOREVER,
    enabled,
  });
}

export function usePmAtCenter() {
  return useQuery({
    queryKey: ["weather", "pm", "center"],
    queryFn: () => getPm(DEFAULT_CENTER[1], DEFAULT_CENTER[0]),
    ...POINT_OPTIONS,
  });
}

export function useTempWind() {
  return useQuery({ queryKey: ["weather", "tempWind"], queryFn: getTempWind, ...POINT_OPTIONS });
}

export function useUv() {
  return useQuery({ queryKey: ["weather", "uv"], queryFn: getUv, ...POINT_OPTIONS });
}
