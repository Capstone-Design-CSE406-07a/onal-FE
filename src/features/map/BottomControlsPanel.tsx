import { imgLayerDust, imgLayerRain, imgLayerRisk, imgLayerSun } from "./assets";
import {
  BottomPanel,
  Card,
  CardInner,
  IconSmall,
  LayerButton,
  LayerRow,
  OpacityRow,
  OpacityValue,
  Section,
  SectionTitle,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "./styles";

export default function BottomControlsPanel() {
  return (
    <BottomPanel>
      <Card>
        <CardInner>
          <Section>
            <SectionTitle>레이어 선택</SectionTitle>
            <LayerRow>
              <LayerButton $active>
                <IconSmall src={imgLayerDust} alt="" />
                <span>미세먼지</span>
              </LayerButton>
              <LayerButton>
                <IconSmall src={imgLayerSun} alt="" />
                <span>기온</span>
              </LayerButton>
              <LayerButton>
                <IconSmall src={imgLayerSun} alt="" />
                <span>자외선</span>
              </LayerButton>
              <LayerButton>
                <IconSmall src={imgLayerRain} alt="" />
                <span>강수</span>
              </LayerButton>
              <LayerButton>
                <IconSmall src={imgLayerRisk} alt="" />
                <span>복합 위험도</span>
              </LayerButton>
            </LayerRow>
          </Section>

          <Section>
            <OpacityRow>
              <SectionTitle>투명도</SectionTitle>
              <OpacityValue>70%</OpacityValue>
            </OpacityRow>
            <SliderTrack>
              <SliderFill />
              <SliderThumb />
            </SliderTrack>
          </Section>
        </CardInner>
      </Card>
    </BottomPanel>
  );
}
