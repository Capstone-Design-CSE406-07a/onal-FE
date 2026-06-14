import type { FeatureCollection, Point } from "geojson";

import type {
  PmNationwideItem,
  TempWindNationwideItem,
  UvNationwideItem,
} from "@/shared/api/weather";

import {
  airHazard,
  compositeHazard,
  heatHazard,
  rainHazard,
  uvHazard,
} from "./composite-risk";
import type { LayerKey } from "./constants";

// sigungu centroid lookup — key: "${sido}_${sigungu}"
const SIGUNGU_COORDS: Record<string, [number, number]> = {
  // 서울특별시 25구
  "서울특별시_종로구": [126.9784, 37.5720],
  "서울특별시_중구": [126.9979, 37.5633],
  "서울특별시_용산구": [126.9647, 37.5326],
  "서울특별시_성동구": [127.0370, 37.5633],
  "서울특별시_광진구": [127.0822, 37.5397],
  "서울특별시_동대문구": [127.0404, 37.5744],
  "서울특별시_중랑구": [127.0938, 37.6066],
  "서울특별시_성북구": [127.0171, 37.5894],
  "서울특별시_강북구": [127.0114, 37.6398],
  "서울특별시_도봉구": [127.0469, 37.6688],
  "서울특별시_노원구": [127.0568, 37.6542],
  "서울특별시_은평구": [126.9234, 37.6026],
  "서울특별시_서대문구": [126.9361, 37.5791],
  "서울특별시_마포구": [126.9019, 37.5663],
  "서울특별시_양천구": [126.8587, 37.5170],
  "서울특별시_강서구": [126.8495, 37.5509],
  "서울특별시_구로구": [126.8885, 37.4954],
  "서울특별시_금천구": [126.8956, 37.4566],
  "서울특별시_영등포구": [126.8963, 37.5264],
  "서울특별시_동작구": [126.9397, 37.5124],
  "서울특별시_관악구": [126.9514, 37.4784],
  "서울특별시_서초구": [127.0324, 37.4836],
  "서울특별시_강남구": [127.0473, 37.5172],
  "서울특별시_송파구": [127.1055, 37.5145],
  "서울특별시_강동구": [127.1238, 37.5302],
  // 부산광역시
  "부산광역시_중구": [129.0300, 35.1061],
  "부산광역시_서구": [129.0231, 35.0978],
  "부산광역시_동구": [129.0435, 35.1294],
  "부산광역시_영도구": [129.0658, 35.0885],
  "부산광역시_부산진구": [129.0506, 35.1598],
  "부산광역시_동래구": [129.0854, 35.2042],
  "부산광역시_남구": [129.0798, 35.1367],
  "부산광역시_북구": [129.0257, 35.1977],
  "부산광역시_해운대구": [129.1649, 35.1631],
  "부산광역시_사하구": [128.9724, 35.0999],
  "부산광역시_금정구": [129.0926, 35.2442],
  "부산광역시_강서구": [128.9047, 35.2123],
  "부산광역시_연제구": [129.0825, 35.1762],
  "부산광역시_수영구": [129.1128, 35.1452],
  "부산광역시_사상구": [128.9924, 35.1496],
  "부산광역시_기장군": [129.2219, 35.2440],
  // 대구광역시
  "대구광역시_중구": [128.5910, 35.8714],
  "대구광역시_동구": [128.6417, 35.8867],
  "대구광역시_서구": [128.5593, 35.8723],
  "대구광역시_남구": [128.5974, 35.8511],
  "대구광역시_북구": [128.5820, 35.8850],
  "대구광역시_수성구": [128.6312, 35.8564],
  "대구광역시_달서구": [128.5337, 35.8313],
  "대구광역시_달성군": [128.4313, 35.7747],
  // 인천광역시
  "인천광역시_중구": [126.6217, 37.4738],
  "인천광역시_동구": [126.6424, 37.4747],
  "인천광역시_미추홀구": [126.6511, 37.4636],
  "인천광역시_연수구": [126.6800, 37.4100],
  "인천광역시_남동구": [126.7273, 37.4473],
  "인천광역시_부평구": [126.7218, 37.5009],
  "인천광역시_계양구": [126.7374, 37.5371],
  "인천광역시_서구": [126.6760, 37.5448],
  "인천광역시_강화군": [126.4869, 37.7416],
  "인천광역시_옹진군": [126.6305, 37.5500],
  // 광주광역시
  "광주광역시_동구": [126.9230, 35.1399],
  "광주광역시_서구": [126.8901, 35.1523],
  "광주광역시_남구": [126.9026, 35.1268],
  "광주광역시_북구": [126.9124, 35.1745],
  "광주광역시_광산구": [126.7936, 35.1396],
  // 대전광역시
  "대전광역시_동구": [127.4547, 36.3121],
  "대전광역시_중구": [127.4149, 36.3244],
  "대전광역시_서구": [127.3837, 36.3551],
  "대전광역시_유성구": [127.3565, 36.3622],
  "대전광역시_대덕구": [127.4151, 36.3467],
  // 울산광역시
  "울산광역시_중구": [129.3243, 35.5690],
  "울산광역시_남구": [129.3312, 35.5390],
  "울산광역시_동구": [129.4166, 35.5052],
  "울산광역시_북구": [129.3598, 35.5843],
  "울산광역시_울주군": [129.2408, 35.5220],
  // 세종특별자치시
  "세종특별자치시_세종시": [127.2890, 36.4800],
  // 경기도
  "경기도_수원시 장안구": [127.0194, 37.2989],
  "경기도_수원시 권선구": [127.0040, 37.2591],
  "경기도_수원시 팔달구": [127.0080, 37.2814],
  "경기도_수원시 영통구": [127.0467, 37.2687],
  "경기도_성남시 수정구": [127.1443, 37.4467],
  "경기도_성남시 중원구": [127.1413, 37.4310],
  "경기도_성남시 분당구": [127.1219, 37.3837],
  "경기도_고양시 덕양구": [126.8361, 37.6343],
  "경기도_고양시 일산동구": [126.7727, 37.6547],
  "경기도_고양시 일산서구": [126.7494, 37.6725],
  "경기도_용인시 처인구": [127.2006, 37.2343],
  "경기도_용인시 기흥구": [127.1134, 37.2760],
  "경기도_용인시 수지구": [127.0571, 37.3223],
  "경기도_부천시": [126.7831, 37.5035],
  "경기도_안산시 단원구": [126.8220, 37.3219],
  "경기도_안산시 상록구": [126.8540, 37.3055],
  "경기도_안양시 만안구": [126.9248, 37.3960],
  "경기도_안양시 동안구": [126.9489, 37.3897],
  "경기도_남양주시": [127.2129, 37.6364],
  "경기도_의정부시": [127.0340, 37.7382],
  "경기도_평택시": [127.1122, 36.9920],
  "경기도_시흥시": [126.8024, 37.3800],
  "경기도_파주시": [126.7878, 37.7597],
  "경기도_김포시": [126.7156, 37.6154],
  "경기도_광주시": [127.2541, 37.4295],
  "경기도_하남시": [127.2149, 37.5398],
  "경기도_군포시": [126.9348, 37.3624],
  "경기도_오산시": [127.0770, 37.1501],
  "경기도_이천시": [127.4358, 37.2723],
  "경기도_양주시": [127.0460, 37.7855],
  "경기도_구리시": [127.1296, 37.5943],
  "경기도_광명시": [126.8646, 37.4779],
  "경기도_화성시": [126.8316, 37.1996],
  "경기도_의왕시": [126.9689, 37.3447],
  "경기도_과천시": [126.9879, 37.4292],
  "경기도_동두천시": [127.0600, 37.9037],
  "경기도_양평군": [127.4914, 37.4914],
  "경기도_여주시": [127.6361, 37.2985],
  "경기도_가평군": [127.5103, 37.8315],
  "경기도_포천시": [127.2003, 37.8949],
  "경기도_연천군": [127.0746, 38.0968],
};

// deterministic scatter within sigungu — keeps same dong at same offset across re-renders
function dongOffset(dong: string): [number, number] {
  let h = 0;
  for (let i = 0; i < dong.length; i++) {
    h = (h * 31 + dong.charCodeAt(i)) & 0xffffff;
  }
  return [((h & 0xff) - 128) / 25000, (((h >> 8) & 0xff) - 128) / 25000];
}

function buildFeatures<T extends { sido: string; sigungu: string; dong: string }>(
  items: T[],
  weightFn: (item: T) => number,
): FeatureCollection<Point, { weight: number }>["features"] {
  return items.flatMap((item) => {
    const base = SIGUNGU_COORDS[`${item.sido}_${item.sigungu}`];
    if (!base) return [];
    const [dLng, dLat] = dongOffset(item.dong);
    return [
      {
        type: "Feature" as const,
        properties: { weight: weightFn(item) },
        geometry: { type: "Point" as const, coordinates: [base[0] + dLng, base[1] + dLat] },
      },
    ];
  });
}

function toGeoJson(
  features: FeatureCollection<Point, { weight: number }>["features"],
): FeatureCollection<Point, { weight: number }> {
  return { type: "FeatureCollection", features };
}

export function buildPmHeatmap(data: PmNationwideItem[]): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(
    buildFeatures(data, (item) => {
      const idx = parseInt(item.통합대기환경지수, 10);
      return isNaN(idx) ? 0 : Math.min(1, (idx - 1) / 3);
    }),
  );
}

export function buildTempHeatmap(
  data: TempWindNationwideItem[],
): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(
    buildFeatures(data, (item) => {
      const temp = parseFloat(item.기온.replace("°C", ""));
      return isNaN(temp) ? 0 : Math.min(1, Math.max(0, (temp + 20) / 60));
    }),
  );
}

export function buildUvHeatmap(data: UvNationwideItem[]): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(buildFeatures(data, (item) => Math.min(1, item.uv / 11)));
}

export function buildRainHeatmap(
  data: TempWindNationwideItem[],
): FeatureCollection<Point, { weight: number }> {
  return toGeoJson(
    buildFeatures(data, (item) => {
      if (item.강수형태 === "0") return 0;
      const mm = parseFloat(item["1시간강수량"].replace("mm", ""));
      return isNaN(mm) ? 0.4 : Math.min(1, mm / 10 + 0.4);
    }),
  );
}

export function buildRiskHeatmap(
  pmData: PmNationwideItem[],
  tempWindData: TempWindNationwideItem[],
  uvData: UvNationwideItem[],
): FeatureCollection<Point, { weight: number }> {
  const key = (i: { sido: string; sigungu: string; dong: string }) =>
    `${i.sido}_${i.sigungu}_${i.dong}`;
  const uvByKey = new Map(uvData.map((u) => [key(u), u.uv]));
  const tempByKey = new Map(tempWindData.map((t) => [key(t), t]));

  return toGeoJson(
    buildFeatures(pmData, (item) => {
      const tw = tempByKey.get(key(item));
      const air = airHazard(parseInt(item.통합대기환경지수, 10));
      const heat = tw
        ? heatHazard(
            parseFloat(tw.기온.replace("°C", "")),
            parseFloat(tw.습도.replace("%", "")),
            parseFloat(tw.풍속.replace("m/s", "")),
          )
        : 0;
      const rain = tw ? rainHazard(tw.강수형태, parseFloat(tw["1시간강수량"].replace("mm", ""))) : 0;
      const uv = uvHazard(uvByKey.get(key(item)) ?? 0);
      return compositeHazard({ air, heat, rain, uv });
    }),
  );
}

/** 레이어별 일주기 피크 시각 (시뮬레이션용). */
const LAYER_PEAK_HOUR: Record<LayerKey, number> = {
  air: 8, // 출퇴근 시간대 대기질 악화
  temp: 15, // 한낮 최고 기온
  uv: 13, // 정오 자외선 최대
  rain: 16, // 오후 소나기 경향
  risk: 14,
};

/** 시각 h(0~24)에서의 일주기 강도 (0~1). */
function diurnal(hour: number, peak: number): number {
  return 0.5 + 0.5 * Math.cos((2 * Math.PI * (hour - peak)) / 24);
}

/**
 * 실측 스냅샷(현재값)에 시간대별 일주기 변화를 입힌다.
 * timeOffset === 0 이면 배율 1 → 원본 그대로, ±시간이면 시뮬레이션 예보.
 *
 * ⚠️ 기상청/에어코리아 nationwide API는 현재 시각 스냅샷만 제공하므로
 *    ±12시간 값은 실측이 아닌 일주기 패턴 기반 추정치다.
 */
export function modulateByTime(
  data: FeatureCollection<Point, { weight: number }>,
  layer: LayerKey,
  timeOffset: number,
): FeatureCollection<Point, { weight: number }> {
  if (timeOffset === 0) return data;

  const peak = LAYER_PEAK_HOUR[layer];
  const nowHour = new Date().getHours();
  const targetHour = (((nowHour + timeOffset) % 24) + 24) % 24;
  const base = 0.6 + 0.8 * diurnal(nowHour, peak);
  const target = 0.6 + 0.8 * diurnal(targetHour, peak);
  const factor = target / base;

  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      properties: {
        weight: Math.min(1, Math.max(0, (feature.properties?.weight ?? 0) * factor)),
      },
    })),
  };
}
