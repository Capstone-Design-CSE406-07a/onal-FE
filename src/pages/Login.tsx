import { Cloud, MapPin } from "lucide-react";

export function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/google`;
  };

  return (
    <div
      className="flex min-h-svh w-full items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(114.8deg, color-mix(in srgb, var(--primary) 20%, transparent) 0%, var(--background) 50%, color-mix(in srgb, var(--primary) 10%, transparent) 100%)",
      }}
    >
      <div className="flex w-full max-w-[394px] flex-col items-center gap-10">
        {/* 앱 아이콘 + 타이틀 */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Cloud className="h-10 w-10 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-[30px] font-semibold tracking-[0.6px] text-app-black">
              환경정보 앱
            </h1>
            <p className="text-base tracking-[0.32px] text-gray-dark">나만을 위한 맞춤 환경 정보</p>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="w-full rounded-[14px] border border-border bg-card px-6 py-6">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium tracking-[0.28px] text-primary-foreground transition-opacity hover:opacity-90 active:opacity-75"
            >
              <img src="/google.png" className="size-4" />
              Google로 시작하기
            </button>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-card px-3 text-xs tracking-[0.24px] text-gray-dark">
                빠르고 간편하게
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm tracking-[0.28px] text-gray-dark">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>위치 기반 실시간 환경 정보 제공</span>
            </div>
          </div>
        </div>

        {/* 약관 안내 */}
        <p className="text-center text-xs tracking-[0.24px] text-gray-dark">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
