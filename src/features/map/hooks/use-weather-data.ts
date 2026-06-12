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

const STALE_TIME = 5 * 60 * 1000;

export function usePmNationwide() {
  return useQuery({ queryKey: ["weather", "pm", "nationwide"], queryFn: getPmNationwide, staleTime: STALE_TIME });
}

export function useTempWindNationwide() {
  return useQuery({ queryKey: ["weather", "tempWind", "nationwide"], queryFn: getTempWindNationwide, staleTime: STALE_TIME });
}

export function useUvNationwide() {
  return useQuery({ queryKey: ["weather", "uv", "nationwide"], queryFn: getUvNationwide, staleTime: STALE_TIME });
}

export function usePmAtCenter() {
  return useQuery({
    queryKey: ["weather", "pm", "center"],
    queryFn: () => getPm(DEFAULT_CENTER[1], DEFAULT_CENTER[0]),
    staleTime: STALE_TIME,
  });
}

export function useTempWind() {
  return useQuery({ queryKey: ["weather", "tempWind"], queryFn: getTempWind, staleTime: STALE_TIME });
}

export function useUv() {
  return useQuery({ queryKey: ["weather", "uv"], queryFn: getUv, staleTime: STALE_TIME });
}
