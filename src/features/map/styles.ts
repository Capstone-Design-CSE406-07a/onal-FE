import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: #ffffff;
`;

export const MainFrame = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MapSurface = styled.div`
  position: relative;
  flex: 1;
  min-height: 320px;
  background: linear-gradient(
    114.4deg,
    rgba(190, 211, 238, 0.05) 0%,
    rgba(190, 211, 238, 0.1) 50%,
    rgba(190, 211, 238, 0.05) 100%
  );
  overflow: hidden;
`;

export const HeatmapLayer = styled.div`
  position: absolute;
  inset: 0;
`;

export const MapCenter = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #717182;
`;

export const CenterIcon = styled.img`
  width: clamp(72px, 24vw, 96px);
  height: clamp(72px, 24vw, 96px);
`;

export const CenterTitle = styled.p`
  font-size: clamp(14px, 4vw, 16px);
  line-height: 24px;
  margin: 0;
`;

export const CenterSubtitle = styled.p`
  font-size: clamp(12px, 3.6vw, 14px);
  line-height: 20px;
  margin: 0;
`;

export const PinGroup = styled.div`
  position: absolute;
  width: clamp(24px, 7vw, 32px);
  height: clamp(24px, 7vw, 32px);
`;

export const PinHalo = styled.div`
  position: absolute;
  left: -110%;
  top: -110%;
  width: 320%;
  height: 320%;
  border-radius: 999px;
  background: rgba(190, 211, 238, 0.2);
  opacity: 0.4;
`;

export const PinIcon = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

export const TopPanel = styled.div`
  position: relative;
  width: 100%;
  padding: clamp(12px, 4vw, 16px) clamp(12px, 4vw, 16px) 0;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 4vw, 16px);
`;

export const BottomPanel = styled.div`
  position: relative;
  width: 100%;
  padding: 0 clamp(12px, 4vw, 16px) clamp(12px, 4vw, 16px);
`;

export const Card = styled.div`
  background: #ffffff;
  border: 0.75px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  padding: 1px;
`;

export const CardInner = styled.div`
  padding: clamp(12px, 4vw, 16px);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 4vw, 16px);
`;

export const LocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const LocationBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LocationLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #717182;
`;

export const LocationTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #0a0a0a;
  line-height: 28px;
`;

export const ChatButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(8px, 3vw, 12px);
`;

export const MetricCard = styled.div`
  background: rgba(233, 242, 251, 0.5);
  border-radius: 10px;
  padding: 12px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const MetricIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const MetricValue = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #0a0a0a;
`;

export const MetricLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: #717182;
`;

export const AlertCard = styled.div`
  background: rgba(212, 24, 61, 0.1);
  border: 0.75px solid rgba(212, 24, 61, 0.2);
  border-radius: 10px;
  display: flex;
  gap: 8px;
  padding: 12px 13px;
  align-items: flex-start;
  color: #d4183d;
`;

export const AlertText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;

  strong {
    font-size: 14px;
    font-weight: 500;
  }

  span {
    color: rgba(212, 24, 61, 0.8);
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #0a0a0a;
`;

export const LayerRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 999px;
  }

  @media (max-width: 360px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

export const LayerButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  font-size: clamp(13px, 4vw, 16px);
  font-weight: 500;
  color: #0a0a0a;
  white-space: nowrap;

  ${({ $active }) =>
    $active &&
    `
    background: rgba(190, 211, 238, 0.1);
    border-color: #bed3ee;
    color: #bed3ee;
  `}
`;

export const OpacityRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OpacityValue = styled.p`
  margin: 0;
  font-size: 14px;
  color: #717182;
`;

export const SliderTrack = styled.div`
  position: relative;
  height: 16px;
  background: #ececf0;
  border-radius: 999px;
  overflow: hidden;
`;

export const SliderFill = styled.div`
  position: absolute;
  inset: 0;
  width: 70%;
  background: #bed3ee;
`;

export const SliderThumb = styled.div`
  position: absolute;
  left: 67%;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  border: 0.75px solid #bed3ee;
  box-shadow:
    0px 1px 3px rgba(0, 0, 0, 0.1),
    0px 1px 2px rgba(0, 0, 0, 0.1);
`;

export const IconSmall = styled.img`
  width: 16px;
  height: 16px;
`;
