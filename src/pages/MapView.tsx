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
import { useCurrentLocation } from "../features/map/hooks/use-current-location";
import {
  usePmAtCenter,
  usePmNationwide,
  useTempWind,
  useTempWindNationwide,
  useUv,
  useUvNationwide,
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

  const { coords: userCoords, dong: gpsDong, status: locationStatus } = useCurrentLocation();

  const { data: pmPoint } = usePmAtCenter();
  const { data: tempPoint } = useTempWind();
  const { data: uvPoint } = useUv();
  const { data: pmData } = usePmNationwide();
  const { data: tempWindData } = useTempWindNationwide();
  const { data: uvData } = useUvNationwide();

  const weatherInput = useMemo(
    () => ({
      aqiIndex: pmPoint?.통합대기환경지수 ? parseInt(pmPoint.통합대기환경지수, 10) : undefined,
      temperature: tempPoint?.기온 ? parseFloat(tempPoint.기온.replace("°C", "")) : undefined,
      uvIndex: uvPoint?.uv,
      rainMm: tempPoint?.["1시간강수량"]
        ? parseFloat(tempPoint["1시간강수량"].replace("mm", ""))
        : undefined,
    }),
    [pmPoint, tempPoint, uvPoint],
  );

  const geoJsonData = useMemo(() => {
    if (activeLayer === "air" && pmData) return buildPmHeatmap(pmData);
    if (activeLayer === "temp" && tempWindData) return buildTempHeatmap(tempWindData);
    if (activeLayer === "uv" && uvData) return buildUvHeatmap(uvData);
    if (activeLayer === "rain" && tempWindData) return buildRainHeatmap(tempWindData);
    if (activeLayer === "risk" && pmData && uvData) return buildRiskHeatmap(pmData, uvData);
    return undefined;
  }, [activeLayer, pmData, tempWindData, uvData]);

  const personalizedData = useMemo(
    () => buildPersonalizedMapData(user, timeOffset, weatherInput),
    [timeOffset, user, weatherInput],
  );
  const interestPlaces = useMemo(() => buildInterestPlacesFromUser(user), [user]);

  return (
    <div className="flex min-h-full w-full justify-center bg-white" data-node-id="42:1139">
      <div className="relative flex min-h-full w-full flex-col gap-3 bg-white">
        <TopInfoPanel
          data={personalizedData}
          currentDong={gpsDong ?? personalizedData.currentDong}
          locatingDong={locationStatus === "locating"}
        />
        <MapHeatmap
          activeLayer={activeLayer}
          timeOffset={timeOffset}
          opacity={opacity}
          interestPlaces={interestPlaces}
          layerScores={personalizedData.layerScores}
          geoJsonData={geoJsonData}
          userCoords={userCoords}
          locating={locationStatus === "locating"}
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
