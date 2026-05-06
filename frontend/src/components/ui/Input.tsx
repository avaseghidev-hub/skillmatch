import type { InputHTMLAttributes } from "react";
import { inputClass } from "../../styles/components/input";

export const Input = ({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`${inputClass} ${className}`}
      {...props}
    />
  );
};