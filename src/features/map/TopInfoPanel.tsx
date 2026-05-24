import { imgAlert, imgChat, imgDust, imgLocation, imgSun } from "./assets";

export default function TopInfoPanel() {
  return (
    <div className="relative flex w-full flex-col gap-3 px-3 pt-3 sm:gap-4 sm:px-4 sm:pt-4">
      <div className="rounded-[14px] border-[0.75px] border-black/10 bg-white p-px">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 text-sm text-[#717182]">
                <img src={imgLocation} alt="" className="h-4 w-4" />
                <span>현재 위치</span>
              </div>
              <p className="m-0 text-xl/[28px] font-medium text-[#0a0a0a]">서울시 강남구</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
              <img src={imgChat} alt="" className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <MetricCard icon={imgDust} value="45" label="미세먼지" />
            <MetricCard icon={imgSun} value="15°C" label="기온" />
            <MetricCard icon={imgSun} value="5" label="자외선" />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-[10px] border-[0.75px] border-[#d4183d]/20 bg-[#d4183d]/10 p-3 text-[#d4183d]">
        <img src={imgAlert} alt="" className="h-4 w-4" />
        <div className="flex flex-col gap-1 text-xs">
          <strong className="text-sm font-medium">오늘 오후 미세먼지 나쁨</strong>
          <span className="text-[#d4183d]/80">호흡기 민감군 주의 필요</span>
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: string;
  value: string;
  label: string;
};

function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[10px] bg-[#e9f2fb]/50 py-3 text-center">
      <img src={icon} alt="" className="h-5 w-5" />
      <p className="m-0 text-sm font-medium text-[#0a0a0a]">{value}</p>
      <p className="m-0 text-xs text-[#717182]">{label}</p>
    </div>
  );
}
