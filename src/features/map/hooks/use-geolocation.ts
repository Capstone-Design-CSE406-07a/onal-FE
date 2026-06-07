import { useEffect, useState } from 'react';

type GeolocationState = {
  locationName: string;
  dong: string | null;
  coords: { lat: number; lng: number } | null;
  isLoading: boolean;
};

type ReverseGeocodeResult = {
  displayName: string;
  dong: string | null;
};

async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    { headers: { 'Accept-Language': 'ko' } },
  );
  const data = await res.json();
  const addr = data.address ?? {};
  const city = addr.city ?? addr.county ?? addr.state ?? '';
  const district = addr.city_district ?? addr.suburb ?? addr.quarter ?? '';
  // suburb / quarter 가 동(洞)에 해당
  const dong: string | null = addr.suburb ?? addr.quarter ?? null;
  const displayName = city && district ? `${city} ${district}` : (city || data.display_name?.split(',')[0] || '현재 위치');
  return { displayName, dong };
}

export function useGeolocation(): GeolocationState {
  const [locationName, setLocationName] = useState('위치 확인 중...');
  const [dong, setDong] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName('현재 위치');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        try {
          const { displayName, dong: resolvedDong } = await reverseGeocode(lat, lng);
          setLocationName(displayName);
          setDong(resolvedDong);
        } catch {
          setLocationName('현재 위치');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setLocationName('현재 위치');
        setIsLoading(false);
      },
    );
  }, []);

  return { locationName, dong, coords, isLoading };
}
