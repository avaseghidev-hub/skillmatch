import { useState } from "react";
import type { ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  className = "",
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={`
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        ${className}
      `}
    >
      {/* Section header toggles the content visibility. */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-3
          px-4
          py-3
          text-left
          font-medium
        "
      >
        <span>{title}</span>

        <span
          className={`
            text-sm
            opacity-60
            transition-transform
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        >
          ▾
        </span>
      </button>

      {/* Content is conditionally rendered to keep the DOM simple. */}
      {isOpen && (
        <div className="border-t border-[var(--border)] px-4 py-4">
          {children}
        </div>
      )}
    </section>
  );
};