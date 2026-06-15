import { lazy, Suspense, useMemo, useState } from "react";

import BottomControlsPanel from "../features/map/BottomControlsPanel";
import type { LayerKey } from "../features/map/constants";
import {
  buildPmHeatmap,
  buildRainHeatmap,
  buildRiskHeatmap,
  buildTempHeatmap,
  buildUvHeatmap,
} from "../features/map/heatmap-builder";
import {
  usePmAtCenter,
  usePmNationwide,
  useTempWind,
  useTempWindNationwide,
  useUv,
  useUvNationwide,
} from "../features/map/hooks/use-weather-data";
import {
  buildInterestPlacesFromUser,
  buildPersonalizedMapData,
} from "../features/map/personalization";
import TopInfoPanel from "../features/map/TopInfoPanel";
import { useUser } from "../shared/contexts/use-user";
import { useCurrentLocation } from "../shared/hooks/use-current-location";

// mapbox-gl(~1MB)을 끌어오는 무거운 컴포넌트라 별도 청크로 분리한다.
// 페이지 셸(요약 카드·컨트롤)이 먼저 그려지고 지도는 뒤이어 로드된다.
const MapHeatmap = lazy(() => import("../features/map/MapHeatmap"));

export default function MapView() {
  const { user } = useUser();
  const [activeLayer, setActiveLayer] = useState<LayerKey>("air");
  const [timeOffset, setTimeOffset] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  const { coords: userCoords, siGu: gpsSiGu, status: locationStatus } = useCurrentLocation();

  const { data: pmPoint } = usePmAtCenter();
  const { data: tempPoint } = useTempWind();
  const { data: uvPoint } = useUv();

  // 모든 레이어 데이터를 진입 시 한 번에 선로딩한다. 각 nationwide 호출은 백엔드가
  // 격자 단위로 KMA를 병렬 호출 + 5분 캐싱하는 일괄 엔드포인트라 요청 1건씩이면 충분하고,
  // 프런트도 영구 캐시하므로 레이어 전환이 즉시 이뤄져 빈 화면 이탈을 막는다.
  const pmQuery = usePmNationwide(true);
  const tempWindQuery = useTempWindNationwide(true);
  const uvQuery = useUvNationwide(true);
  const pmData = pmQuery.data;
  const tempWindData = tempWindQuery.data;
  const uvData = uvQuery.data;

  const weatherInput = useMemo(
    () => ({
      aqiIndex: pmPoint?.통합대기환경지수 ? parseInt(pmPoint.통합대기환경지수, 10) : undefined,
      temperature: tempPoint?.기온 ? parseFloat(tempPoint.기온.replace("°C", "")) : undefined,
      humidity: tempPoint?.습도 ? parseFloat(tempPoint.습도.replace("%", "")) : undefined,
      windMs: tempPoint?.풍속 ? parseFloat(tempPoint.풍속.replace("m/s", "")) : undefined,
      precipForm: tempPoint?.강수형태,
      uvIndex: uvPoint?.uv,
      rainMm: tempPoint?.["1시간강수량"]
        ? parseFloat(tempPoint["1시간강수량"].replace("mm", ""))
        : undefined,
    }),
    [pmPoint, tempPoint, uvPoint],
  );

  const geoJsonData = useMemo(() => {
    if (activeLayer === "air") return pmData ? buildPmHeatmap(pmData) : undefined;
    if (activeLayer === "temp") return tempWindData ? buildTempHeatmap(tempWindData) : undefined;
    if (activeLayer === "rain") return tempWindData ? buildRainHeatmap(tempWindData) : undefined;
    if (activeLayer === "uv") return uvData ? buildUvHeatmap(uvData) : undefined;
    if (activeLayer === "risk")
      return pmData && tempWindData && uvData
        ? buildRiskHeatmap(pmData, tempWindData, uvData)
        : undefined;
    return undefined;
  }, [activeLayer, pmData, tempWindData, uvData]);

  // 활성 레이어 데이터가 준비되기 전엔 로딩 화면을 띄우되, 재시도까지 모두 실패(429 등)해
  // 쿼리가 에러로 끝나면 로딩을 거두고 빈 히트맵을 보여준다(무한 로딩 방지).
  const heatmapLoading = useMemo(() => {
    if (geoJsonData !== undefined) return false;
    if (activeLayer === "air") return pmQuery.isPending;
    if (activeLayer === "temp" || activeLayer === "rain") return tempWindQuery.isPending;
    if (activeLayer === "uv") return uvQuery.isPending;
    // risk: 셋 중 하나라도 아직 받는 중이면 로딩
    return pmQuery.isPending || tempWindQuery.isPending || uvQuery.isPending;
  }, [geoJsonData, activeLayer, pmQuery.isPending, tempWindQuery.isPending, uvQuery.isPending]);

  // 로딩도 아닌데 데이터가 없으면 = 외부 API 한도 초과 등으로 못 받은 상태.
  // (pm 429 시 대기질·복합 위험도가 여기 해당) → 빈 지도 대신 안내를 띄운다.
  const heatmapUnavailable = !heatmapLoading && geoJsonData === undefined;

  const personalizedData = useMemo(
    () => buildPersonalizedMapData(user, timeOffset, weatherInput),
    [timeOffset, user, weatherInput],
  );
  const interestPlaces = useMemo(() => buildInterestPlacesFromUser(user), [user]);

  return (
    <div className="flex min-h-full w-full justify-center bg-white" data-node-id="42:1139">
      <div className="relative flex min-h-full w-full flex-col gap-3 bg-white pb-24">
        <TopInfoPanel
          data={personalizedData}
          currentDong={gpsSiGu ?? personalizedData.currentDong}
          locatingDong={locationStatus === "locating"}
        />
        <Suspense fallback={<div className="min-h-80 flex-1 animate-pulse bg-gray-light" />}>
          <MapHeatmap
            activeLayer={activeLayer}
            timeOffset={timeOffset}
            opacity={opacity}
            interestPlaces={interestPlaces}
            geoJsonData={geoJsonData}
            userCoords={userCoords}
            locating={locationStatus === "locating"}
            dataLoading={heatmapLoading}
            dataUnavailable={heatmapUnavailable}
          />
        </Suspense>
        <BottomControlsPanel
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          opacity={opacity}
          onOpacityChange={setOpacity}
          timeOffset={timeOffset}
          onTimeOffsetChange={setTimeOffset}
        />
      </div>
    </div>
  );
}
