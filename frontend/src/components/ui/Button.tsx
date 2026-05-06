import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonSizes, buttonVariants } from "../../styles";

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      className={`${baseClasses} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};