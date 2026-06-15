import { useMemo, useState } from "react";

import BottomControlsPanel from "../features/map/BottomControlsPanel";
import type { LayerKey } from "../features/map/constants";
import {
  buildPmHeatmap,
  buildRainHeatmap,
  buildRiskHeatmap,
  buildTempHeatmap,
  buildUvHeatmap,
} from "../features/map/heatmap-builder";
import { useCurrentLocation } from "../shared/hooks/use-current-location";
import {
  usePmAtCenter,
  usePmNationwide,
  useUv,
  useUvNationwide,
  useTempWind,
  useTempWindNationwide,
} from "../features/map/hooks/use-weather-data";
import MapHeatmap from "../features/map/MapHeatmap";
import {
  buildInterestPlacesFromUser,
  buildPersonalizedMapData,
} from "../features/map/personalization";
import TopInfoPanel from "../features/map/TopInfoPanel";
import { useUser } from "../shared/contexts/use-user";

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
  const { data: pmData } = usePmNationwide(true);
  const { data: tempWindData } = useTempWindNationwide(true);
  const { data: uvData } = useUvNationwide(true);

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

  // 활성 레이어 데이터가 준비되기 전엔 가짜 데이터 대신 로딩 화면을 띄운다.
  const heatmapLoading = geoJsonData === undefined;

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
        <MapHeatmap
          activeLayer={activeLayer}
          timeOffset={timeOffset}
          opacity={opacity}
          interestPlaces={interestPlaces}
          geoJsonData={geoJsonData}
          userCoords={userCoords}
          locating={locationStatus === "locating"}
          dataLoading={heatmapLoading}
        />
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
