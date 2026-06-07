import { useEffect } from "react";
import { Cloud, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getUser } from "@/shared/api/user";
import { useUser } from "@/shared/contexts/use-user";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

export function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const status = searchParams.get("status");
  const isLoginFailed = status === "LOGIN_FAIL";

  useEffect(() => {
    if (status === "USER_NOT_FOUND") {
      navigate("/onboarding", { replace: true });
    } else if (status === "LOGIN_SUCCESS") {
      getUser()
        .then((user) => {
          setUser(user);
          navigate("/", { replace: true });
        })
        .catch(() => navigate("/login?status=LOGIN_FAIL", { replace: true }));
    }
  }, [status, navigate, setUser]);

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
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Typography variant="h1" className="text-app-black">
              환경정보 앱
            </Typography>
            <Typography variant="body1" className="text-gray-dark">
              나만을 위한 맞춤 환경 정보
            </Typography>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="w-full rounded-[14px] border border-border bg-card px-6 py-6">
          <div className="flex flex-col gap-4">
            {isLoginFailed && (
              <Typography variant="caption" className="text-center text-red-500">
                로그인에 실패했습니다. 다시 시도해 주세요.
              </Typography>
            )}
            <Button
              variant="secondary"
              onClick={handleGoogleLogin}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-app-white border-2 transition-opacity"
            >
              <img src="/google.png" className="size-4" />
              <Typography variant="body2" className="text-primary-foreground">
                Google로 시작하기
              </Typography>
            </Button>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <Typography
                variant="caption"
                as="span"
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-card px-3 text-gray-dark"
              >
                빠르고 간편하게
              </Typography>
            </div>

            <div className="flex items-center gap-2 text-gray-dark">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <Typography variant="body2" className="text-gray-dark">
                위치 기반 실시간 환경 정보 제공
              </Typography>
            </div>
          </div>
        </div>

        {/* 약관 안내 */}
        <Typography variant="caption" className="text-center text-gray-dark">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </Typography>
      </div>
    </div>
  );
}
