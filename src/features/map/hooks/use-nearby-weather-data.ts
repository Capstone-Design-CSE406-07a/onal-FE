import { useEffect, useState } from 'react';

import { weatherApi } from '@/shared/api';
import type { PmNearbyItem, TempertureWindNearbyItem, UvNearbyItem } from '@/shared/api';

export type NearbyWeatherData = {
  pm: PmNearbyItem[] | null;
  tempWind: TempertureWindNearbyItem[] | null;
  uv: UvNearbyItem[] | null;
};

type UseNearbyWeatherDataReturn = {
  nearby: NearbyWeatherData | null;
  isLoading: boolean;
};

export function useNearbyWeatherData(dong: string | null): UseNearbyWeatherDataReturn {
  const [nearby, setNearby] = useState<NearbyWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!dong) return;

    let cancelled = false;
    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const [pmRes, tempWindRes, uvRes] = await Promise.all([
          weatherApi.getPmNearby(dong),
          weatherApi.getTemperatureWindNearby(dong),
          weatherApi.getUvNearby(dong),
        ]);
        if (!cancelled) {
          setNearby({
            pm: pmRes.data,
            tempWind: tempWindRes.data,
            uv: uvRes.data,
          });
        }
      } catch {
        // nearby 실패해도 앱은 계속 동작
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [dong]);

  return { nearby, isLoading };
}
