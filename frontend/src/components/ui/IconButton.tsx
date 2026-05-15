import type { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}

export const IconButton = ({
  children,
  onClick,
  ariaLabel,
  className = "",
}: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        flex
        items-center
        justify-center
        rounded-lg
        p-2
        text-slate-500
        transition
        hover:bg-black/5
        hover:text-slate-900
        dark:text-slate-400
        dark:hover:bg-white/10
        dark:hover:text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
};