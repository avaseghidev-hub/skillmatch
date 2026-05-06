import type { ReactNode } from "react";

interface FilterFieldProps {
  label: string;
  children: ReactNode;
}

export const FilterField = ({ label, children }: FilterFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </label>
      {children}
    </div>
  );
};