import type { HTMLAttributes, ReactNode } from "react";
import { cardStyles } from "../../styles";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div className={`${cardStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};