import type { SelectHTMLAttributes } from "react";
import { inputClass } from "../../styles/components/input";

// Reusable select component
export const Select = ({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select className={`${inputClass} ${className}`} {...props}>
      {children}
    </select>
  );
};