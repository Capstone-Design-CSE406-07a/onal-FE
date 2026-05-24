import { useState } from "react";

import BottomControlsPanel from "../features/map/BottomControlsPanel";
import type { LayerKey } from "../features/map/constants";
import MapHeatmap from "../features/map/MapHeatmap";
import TopInfoPanel from "../features/map/TopInfoPanel";

export default function MapView() {
  const [activeLayer, setActiveLayer] = useState<LayerKey>("air");
  const [timeOffset, setTimeOffset] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  return (
    <div className="flex min-h-full w-full justify-center bg-white" data-node-id="42:1139">
      <div className="relative flex min-h-full w-full flex-col gap-3 bg-white">
        <TopInfoPanel />
        <MapHeatmap activeLayer={activeLayer} timeOffset={timeOffset} opacity={opacity} />
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
