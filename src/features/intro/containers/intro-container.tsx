import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

import { IntroCarousel } from "../components/intro-carousel";
import { INTRO_SLIDES } from "../constants";

export function IntroContainer() {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-svh w-full items-center justify-center px-6 py-10"
      style={{
        background:
          "linear-gradient(114.8deg, color-mix(in srgb, var(--primary) 20%, transparent) 0%, var(--background) 50%, color-mix(in srgb, var(--primary) 10%, transparent) 100%)",
      }}
    >
      <div className="flex w-full max-w-98.5 flex-col items-center gap-12">
        <IntroCarousel slides={INTRO_SLIDES} />
        <Button
          className="h-12 w-full text-base"
          onClick={() => {
            navigate("/login");
          }}
        >
          <Typography variant="body2">로그인하고 시작하기</Typography>
        </Button>
      </div>
    </div>
  );
}
