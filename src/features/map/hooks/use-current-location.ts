import { useEffect, useState } from "react";

export type LocationStatus = "idle" | "locating" | "ready" | "error";

export type CurrentLocation = {
  coords: [number, number] | null;
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
const formatSiGu = (parts: string[]): string | null => {
  const addressParts = normalizeAddressParts(parts);
  const si = addressParts.find((p) => p.endsWith("시"));
  const gu = addressParts.find((p) => p.endsWith("구") || p.endsWith("군"));

  if (si && gu) return `${si} ${gu}`;
  if (si) return si;
  if (gu) return gu;
  return addressParts[0] ?? null;
};

const reverseGeocode = async (lng: number, lat: number, token: string): Promise<string | null> => {
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
    `?access_token=${token}&language=ko&types=place,locality,district,region&limit=1`;

  const res = await fetch(url);
  if (!res.ok) {
    return null;
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
    return null;
  }

  // feature.text + context의 모든 행정구역 토큰을 모아 시/구를 추출한다.
  const parts = [feature.text, ...(feature.context ?? []).map((c) => c.text)].filter(
    (p): p is string => Boolean(p),
  );

  return formatSiGu(parts) ?? feature.place_name ?? null;
};

export function useCurrentLocation(): CurrentLocation {
  const supported = Boolean(import.meta.env.VITE_MAPBOX_TOKEN) && "geolocation" in navigator;

  const [state, setState] = useState<CurrentLocation>(() => ({
    coords: null,
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
        let dong: string | null = null;
        try {
          dong = await reverseGeocode(coords[0], coords[1], token);
        } catch (err) {
          console.warn("Reverse geocoding failed:", err);
        }
        if (!cancelled) {
          setState({ coords, dong, status: "ready" });
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
