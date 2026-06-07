import { useEffect, useState } from 'react';

import { weatherApi } from '@/shared/api';
import type { PmDataResponse, TempertureWindResponse, UvDataResponse } from '@/shared/api';

type WeatherData = {
  pm: PmDataResponse | null;
  tempWind: TempertureWindResponse | null;
  uv: UvDataResponse | null;
};

type UseWeatherDataReturn = WeatherData & {
  isLoading: boolean;
  error: Error | null;
};

type Coords = { lat: number; lng: number };

export function useWeatherData(coords: Coords | null): UseWeatherDataReturn {
  const [data, setData] = useState<WeatherData>({ pm: null, tempWind: null, uv: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;

    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [pmRes, tempWindRes, uvRes] = await Promise.all([
          weatherApi.getPm(coords),
          weatherApi.getTemperatureWind(coords),
          weatherApi.getUv(coords),
        ]);
        if (!cancelled) {
          setData({ pm: pmRes.data, tempWind: tempWindRes.data, uv: uvRes.data });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('날씨 데이터를 불러오지 못했습니다.'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [coords]);

  return { ...data, isLoading, error };
}
