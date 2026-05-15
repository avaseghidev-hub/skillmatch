import type { SelectHTMLAttributes } from "react";
import { inputClass } from "../../styles/components/input";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
}

// Reusable select component with optional options support.
export const Select = ({
  className = "",
  children,
  options,
  placeholder,
  ...props
}: SelectProps) => {
  return (
    <select className={`${inputClass} ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}

      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
};