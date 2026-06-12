import { LAYER_CONFIG, type LayerKey } from "../constants";

export type KmaHeatmapPoint = {
  position: [number, number];
  temperature: number | null;
  precipitation: number | null;
};

export const KOREA_MIN_LNG = 124.5;
export const KOREA_MAX_LNG = 132.0;
export const KOREA_MIN_LAT = 33.0;
export const KOREA_MAX_LAT = 38.8;

export const KOREA_IMAGE_COORDINATES: [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
] = [
  [KOREA_MIN_LNG, KOREA_MAX_LAT],
  [KOREA_MAX_LNG, KOREA_MAX_LAT],
  [KOREA_MAX_LNG, KOREA_MIN_LAT],
  [KOREA_MIN_LNG, KOREA_MIN_LAT],
];

function parseRgba(str: string): [number, number, number, number] {
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!m) return [0, 0, 0, 0];
  return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1];
}

function interpolateColor(
  ramp: Array<[number, string]>,
  weight: number,
): [number, number, number, number] {
  if (weight <= ramp[0][0]) return parseRgba(ramp[0][1]);
  const last = ramp[ramp.length - 1];
  if (weight >= last[0]) return parseRgba(last[1]);
  for (let i = 0; i < ramp.length - 1; i++) {
    const [w0, c0] = ramp[i];
    const [w1, c1] = ramp[i + 1];
    if (weight >= w0 && weight <= w1) {
      const t = (weight - w0) / (w1 - w0);
      const [r0, g0, b0, a0] = parseRgba(c0);
      const [r1, g1, b1, a1] = parseRgba(c1);
      return [
        Math.round(r0 + t * (r1 - r0)),
        Math.round(g0 + t * (g1 - g0)),
        Math.round(b0 + t * (b1 - b0)),
        a0 + t * (a1 - a0),
      ];
    }
  }
  return [0, 0, 0, 0];
}

// 한국 계절 범위 기준 절댓값 매핑 (정규화 금지)
// temp:  0°C → 0.0,  35°C → 1.0  (겨울 파랑 / 여름 빨강)
// rain:  0mm → 0.0,  20mm+ → 1.0
function calcWeight(p: KmaHeatmapPoint, layer: LayerKey): number {
  if (layer === "temp" || layer === "risk") {
    if (p.temperature === null) return 0;
    return Math.min(1, Math.max(0, p.temperature / 35));
  }
  if (layer === "rain") {
    if (p.precipitation === null) return 0;
    return Math.min(1, p.precipitation / 20);
  }
  return 0.5;
}

function idwInterpolate(
  knownPoints: Array<{ position: [number, number]; weight: number }>,
  lng: number,
  lat: number,
): number {
  let numerator = 0;
  let denominator = 0;
  const cosLat = Math.cos((lat * Math.PI) / 180);
  for (const p of knownPoints) {
    const dx = (p.position[0] - lng) * cosLat;
    const dy = p.position[1] - lat;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < 1e-10) return p.weight;
    const w = 1 / dist2;
    numerator += w * p.weight;
    denominator += w;
  }
  return denominator === 0 ? 0 : numerator / denominator;
}

export function generateHeatmapImageUrl(
  kmaData: KmaHeatmapPoint[],
  layer: LayerKey,
): string | null {
  const knownPoints = kmaData
    .filter((p) => p.temperature !== null)
    .map((p) => ({ position: p.position, weight: calcWeight(p, layer) }));

  if (knownPoints.length === 0) return null;

  const SIZE = 256;

  // 1차 패스: 전체 그리드 IDW 값 계산
  const lngRange = KOREA_MAX_LNG - KOREA_MIN_LNG;
  const latRange = KOREA_MAX_LAT - KOREA_MIN_LAT;
  const rawValues = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) {
    const lat = KOREA_MAX_LAT - (y / SIZE) * latRange;
    for (let x = 0; x < SIZE; x++) {
      const lng = KOREA_MIN_LNG + (x / SIZE) * lngRange;
      rawValues[y * SIZE + x] = idwInterpolate(knownPoints, lng, lat);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.createImageData(SIZE, SIZE);
  const ramp = LAYER_CONFIG[layer].ramp;

  for (let i = 0; i < SIZE * SIZE; i++) {
    const [r, g, b, a] = interpolateColor(ramp, rawValues[i]);
    const idx = i * 4;
    imageData.data[idx] = r;
    imageData.data[idx + 1] = g;
    imageData.data[idx + 2] = b;
    imageData.data[idx + 3] = Math.round(a * 255);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}
