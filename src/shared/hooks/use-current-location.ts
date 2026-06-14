import { useEffect, useState } from "react";

export type LocationStatus = "idle" | "locating" | "ready" | "error";

export type CurrentLocation = {
  coords: [number, number] | null;
  /** "OO시 OO구" 형태. 상단 요약 패널 표시용. */
  siGu: string | null;
  /** "OO동"/"OO읍"/"OO면" 형태. AI 질문 컨텍스트용. */
  dong: string | null;
  status: LocationStatus;
};

const normalizeAddressParts = (parts: string[]) =>
  parts
    .flatMap((part) => part.split(/[,\s]+/))
    .map((part) => part.trim())
    .filter((part) => part && part !== "대한민국");

/**
 * 역지오코딩 결과에서 "OO시 OO구" 형태를 만든다.
 * 시: 시로 끝나는 토큰, 구: 구/군으로 끝나는 토큰.
 */
const formatSiGu = (addressParts: string[]): string | null => {
  const si = addressParts.find((p) => p.endsWith("시"));
  const gu = addressParts.find((p) => p.endsWith("구") || p.endsWith("군"));

  if (si && gu) return `${si} ${gu}`;
  if (si) return si;
  if (gu) return gu;
  return addressParts[0] ?? null;
};

/**
 * 역지오코딩 결과에서 동 단위("OO동"/"OO읍"/"OO면") 토큰을 뽑는다.
 * 동을 못 찾으면 구/군 → 시 순으로 폴백한다.
 */
const formatDong = (addressParts: string[]): string | null => {
  const dong = addressParts.find(
    (p) => p.endsWith("동") || p.endsWith("읍") || p.endsWith("면"),
  );
  if (dong) return dong;

  const gu = addressParts.find((p) => p.endsWith("구") || p.endsWith("군"));
  if (gu) return gu;

  const si = addressParts.find((p) => p.endsWith("시"));
  if (si) return si;

  return addressParts[0] ?? null;
};

type GeocodedLocation = { siGu: string | null; dong: string | null };

const reverseGeocode = async (
  lng: number,
  lat: number,
  token: string,
): Promise<GeocodedLocation> => {
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
    `?access_token=${token}&language=ko&types=neighborhood,locality,place,district,region&limit=1`;

  const res = await fetch(url);
  if (!res.ok) {
    return { siGu: null, dong: null };
  }

  const data = (await res.json()) as {
    features?: Array<{
      text?: string;
      place_name?: string;
      context?: Array<{ id: string; text: string }>;
    }>;
  };

  const feature = data.features?.[0];
  if (!feature) {
    return { siGu: null, dong: null };
  }

  // feature.text + context의 모든 행정구역 토큰을 모아 시/구·동을 각각 추출한다.
  const parts = [feature.text, ...(feature.context ?? []).map((c) => c.text)].filter(
    (p): p is string => Boolean(p),
  );
  const addressParts = normalizeAddressParts(parts);

  return {
    siGu: formatSiGu(addressParts) ?? feature.place_name ?? null,
    dong: formatDong(addressParts) ?? null,
  };
};

export function useCurrentLocation(): CurrentLocation {
  const supported = Boolean(import.meta.env.VITE_MAPBOX_TOKEN) && "geolocation" in navigator;

  const [state, setState] = useState<CurrentLocation>(() => ({
    coords: null,
    siGu: null,
    dong: null,
    status: supported ? "locating" : "error",
  }));

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
    if (!token || !("geolocation" in navigator)) {
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        let location: GeocodedLocation = { siGu: null, dong: null };
        try {
          location = await reverseGeocode(coords[0], coords[1], token);
        } catch (err) {
          console.warn("Reverse geocoding failed:", err);
        }
        if (!cancelled) {
          setState({ coords, ...location, status: "ready" });
        }
      },
      (err) => {
        console.warn(
          `Geolocation failed (code ${err.code}): ${err.message}. Falling back to default.`,
        );
        if (!cancelled) {
          setState((prev) => ({ ...prev, status: "error" }));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
