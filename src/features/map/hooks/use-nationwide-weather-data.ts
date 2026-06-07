import { useEffect, useState } from 'react';

import { weatherApi } from '@/shared/api';
import type { PmNationwideItem, TempertureWindNationwideItem, UvNationwideItem } from '@/shared/api';

export type NationwideWeatherData = {
  pm: PmNationwideItem[];
  tempWind: TempertureWindNationwideItem[];
  uv: UvNationwideItem[];
};

type UseNationwideWeatherDataReturn = {
  nationwide: NationwideWeatherData | null;
  isLoading: boolean;
};

export function useNationwideWeatherData(): UseNationwideWeatherDataReturn {
  const [nationwide, setNationwide] = useState<NationwideWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [pmRes, tempWindRes, uvRes] = await Promise.all([
          weatherApi.getPmNationwide(),
          weatherApi.getTemperatureWindNationwide(),
          weatherApi.getUvNationwide(),
        ]);
        if (!cancelled) {
          setNationwide({
            pm: pmRes.data,
            tempWind: tempWindRes.data,
            uv: uvRes.data,
          });
        }
      } catch {
        // nationwide 실패해도 앱은 계속 동작
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return { nationwide, isLoading };
}
