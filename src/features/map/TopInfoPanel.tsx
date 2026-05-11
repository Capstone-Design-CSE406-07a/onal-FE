import { imgAlert, imgChat, imgDust, imgLocation, imgSun } from "./assets";
import {
  AlertCard,
  AlertText,
  Card,
  CardInner,
  ChatButton,
  IconSmall,
  LocationBlock,
  LocationHeader,
  LocationLabel,
  LocationTitle,
  MetricCard,
  MetricIcon,
  MetricLabel,
  MetricsRow,
  MetricValue,
  TopPanel,
} from "./styles";

export default function TopInfoPanel() {
  return (
    <TopPanel>
      <Card>
        <CardInner>
          <LocationHeader>
            <LocationBlock>
              <LocationLabel>
                <IconSmall src={imgLocation} alt="" />
                <span>현재 위치</span>
              </LocationLabel>
              <LocationTitle>서울시 강남구</LocationTitle>
            </LocationBlock>
            <ChatButton>
              <IconSmall src={imgChat} alt="" />
            </ChatButton>
          </LocationHeader>

          <MetricsRow>
            <MetricCard>
              <MetricIcon src={imgDust} alt="" />
              <MetricValue>45</MetricValue>
              <MetricLabel>미세먼지</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricIcon src={imgSun} alt="" />
              <MetricValue>15°C</MetricValue>
              <MetricLabel>기온</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricIcon src={imgSun} alt="" />
              <MetricValue>5</MetricValue>
              <MetricLabel>자외선</MetricLabel>
            </MetricCard>
          </MetricsRow>
        </CardInner>
      </Card>

      <AlertCard>
        <IconSmall src={imgAlert} alt="" />
        <AlertText>
          <strong>오늘 오후 미세먼지 나쁨</strong>
          <span>호흡기 민감군 주의 필요</span>
        </AlertText>
      </AlertCard>
    </TopPanel>
  );
}
