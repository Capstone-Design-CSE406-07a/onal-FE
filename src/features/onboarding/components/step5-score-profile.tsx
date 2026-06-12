import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/utils";

import { SCORE_QUESTIONS, type ScoreProfile } from "../constants";

type Step5ScoreProfileProps = {
  value: ScoreProfile;
  onChange: (next: ScoreProfile) => void;
};

export function Step5ScoreProfile({ value, onChange }: Step5ScoreProfileProps) {
  function select(key: keyof ScoreProfile, optValue: string) {
    onChange({ ...value, [key]: optValue });
  }

  return (
    <Card>
      <CardHeader>
        <Typography variant="body1" className="font-semibold text-app-black">
          종합 체감 프로파일
        </Typography>
        <Typography variant="body2" className="text-gray-dark">
          아래 항목에 답변하면 더 정확한 맞춤 환경 정보를 제공할 수 있어요
        </Typography>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {SCORE_QUESTIONS.map((q) => {
            const selected = value[q.key];
            return (
              <div key={q.key} className="flex flex-col gap-3">
                <Typography variant="body2" className="font-medium text-app-black">
                  {q.label}
                </Typography>
                <div className="flex gap-2">
                  {q.options.map((opt) => {
                    const active = selected === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => select(q.key, opt.value)}
                        className={cn(
                          "flex flex-1 items-center justify-center rounded-[10px] border py-3 text-sm font-medium transition-colors",
                          active
                            ? "border-primary bg-primary/10 text-primary-foreground shadow-sm"
                            : "border-black/10 bg-white text-app-black",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
