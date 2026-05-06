import type { TextareaHTMLAttributes } from "react";
import { inputClass } from "../../styles/components/input";

// Reusable textarea component
export const Textarea = ({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={`w-full ${inputClass} ${className}`}
      {...props}
    />
  );
};