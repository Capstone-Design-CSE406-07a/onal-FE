import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getUser } from "../api/user";
import { useUser } from "../contexts/use-user";

const PUBLIC_PATHS = ["/login", "/onboarding", "/oauth/google"];

export function useAuthInit() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || user !== null) return;
    getUser()
      .then((nextUser) => {
        setUser(nextUser);
        // 온보딩 미완료 사용자는 온보딩으로 유도 (onboarding: true = 완료)
        if (!nextUser.onboarding) navigate("/onboarding", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, [pathname, navigate, setUser, user]);
}
