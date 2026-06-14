import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getUser } from "../api/user";
import { useUser } from "../contexts/use-user";
import { setStoredEmail } from "../lib/auth-storage";

const PUBLIC_PATHS = ["/login", "/onboarding", "/oauth/google"];

export function useAuthInit() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // 보호된 경로(메인 등)에 user 없이 진입하면 항상 /user/get을 호출한다.
    // user가 채워지면 user !== null 가드로 재호출되지 않는다.
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || user !== null) return;
    getUser()
      .then((nextUser) => {
        setUser(nextUser);
        setStoredEmail(nextUser.email);
        // 온보딩 미완료 사용자는 온보딩으로 유도 (onboarding: true = 완료)
        if (!nextUser.onboarding) navigate("/onboarding", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, [pathname, navigate, setUser, user]);
}
