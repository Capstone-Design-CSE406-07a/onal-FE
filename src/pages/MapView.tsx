import BottomControlsPanel from "../features/map/BottomControlsPanel";
import MapHeatmap from "../features/map/MapHeatmap";
import { MainFrame, Page } from "../features/map/styles";
import TopInfoPanel from "../features/map/TopInfoPanel";

export default function MapView() {
  return (
    <Page data-node-id="42:1139">
      <MainFrame>
        <TopInfoPanel />
        <MapHeatmap />
        <BottomControlsPanel />
      </MainFrame>
    </Page>
  );
}
