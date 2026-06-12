import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

type FadeSlideProps = {
  visible: boolean;
  delay: number;
  children: React.ReactNode;
};

function FadeSlide({ visible, delay, children }: FadeSlideProps) {
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

export function OnboardingComplete() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-white px-8">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-8 text-center">
        <FadeSlide visible={visible} delay={0}>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <CircleCheck className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
        </FadeSlide>

        <FadeSlide visible={visible} delay={150}>
          <Typography variant="h2" className="text-app-black">
            응답해주셔서 감사해요
          </Typography>
        </FadeSlide>

        <FadeSlide visible={visible} delay={300}>
          <Typography variant="body1" className="text-gray-dark">
            사용자의 데이터를 바탕으로
            <br />
            맞춤형 환경 정보를 제공해드릴게요
          </Typography>
        </FadeSlide>

        <FadeSlide visible={visible} delay={500}>
          <Button
            onClick={() => navigate("/")}
            className="h-14 w-full rounded-xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
          >
            홈으로 돌아가기
          </Button>
        </FadeSlide>
      </div>
    </div>
  );
}
