import type { HTMLAttributes, ReactNode } from "react";
import { badgeVariants } from "../../styles";

export type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

export const Badge = ({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};