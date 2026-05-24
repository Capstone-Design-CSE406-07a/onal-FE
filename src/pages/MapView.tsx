import BottomControlsPanel from "../features/map/BottomControlsPanel";
import MapHeatmap from "../features/map/MapHeatmap";
import TopInfoPanel from "../features/map/TopInfoPanel";

export default function MapView() {
  return (
    <div className="flex min-h-full w-full justify-center bg-white" data-node-id="42:1139">
      <div className="relative flex min-h-full w-full flex-col gap-3 bg-white">
        <TopInfoPanel />
        <MapHeatmap />
        <BottomControlsPanel />
      </div>
    </div>
  );
}
