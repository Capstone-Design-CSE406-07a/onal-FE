import { type ElementType, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type TypographyVariant = "h1" | "h2" | "h3" | "body1" | "body2" | "caption";

type TypographyProps = {
  variant: TypographyVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  h1: "text-[30px] font-semibold leading-none tracking-[0.02em]",
  h2: "text-2xl font-medium leading-none tracking-[0.02em]",
  h3: "text-xl font-medium leading-none tracking-[0.02em]",
  body1: "text-base font-normal leading-none tracking-[0.02em]",
  body2: "text-sm font-normal leading-none tracking-[0.02em]",
  caption: "text-xs font-normal leading-none tracking-[0.02em]",
};

const DEFAULT_TAG: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body1: "p",
  body2: "p",
  caption: "span",
};

export function Typography({ variant, as, className, children }: TypographyProps) {
  const Tag = as ?? DEFAULT_TAG[variant];
  return <Tag className={cn(VARIANT_CLASSES[variant], className)}>{children}</Tag>;
}
