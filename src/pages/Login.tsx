import { Cloud, MapPin } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/google`;
  };

  return (
    <div
      className="flex min-h-svh w-full items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(114.8deg, rgba(190,211,238,0.2) 0%, #ffffff 50%, rgba(190,211,238,0.1) 100%)",
      }}
    >
      <div className="flex w-full max-w-[394px] flex-col items-center gap-10">
        {/* 앱 아이콘 + 타이틀 */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#bed3ee]">
            <Cloud className="h-10 w-10 text-[#1a3a52]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-[30px] font-semibold tracking-[0.6px] text-[#0a0a0a]">
              환경정보 앱
            </h1>
            <p className="text-base tracking-[0.32px] text-[#717182]">나만을 위한 맞춤 환경 정보</p>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="w-full rounded-[14px] border border-black/10 bg-white px-6 py-6">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#bed3ee] text-sm font-medium tracking-[0.28px] text-[#1a3a52] transition-opacity hover:opacity-90 active:opacity-75"
            >
              <GoogleIcon />
              Google로 시작하기
            </button>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-black/10" />
              <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 text-xs tracking-[0.24px] text-[#717182]">
                빠르고 간편하게
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm tracking-[0.28px] text-[#717182]">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>위치 기반 실시간 환경 정보 제공</span>
            </div>
          </div>
        </div>

        {/* 약관 안내 */}
        <p className="text-center text-xs tracking-[0.24px] text-[#717182]">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
