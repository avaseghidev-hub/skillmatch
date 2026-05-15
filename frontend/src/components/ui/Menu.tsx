import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface MenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export const Menu = ({ trigger, children, align = "right" }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      {/* Trigger controls menu visibility. */}
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`
            absolute
            z-50
            mt-2
            min-w-56
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--card)]
            p-2
            shadow-xl
            ${align === "right" ? "right-0" : "left-0"}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
}

export const MenuItem = ({
  children,
  onClick,
  variant = "default",
}: MenuItemProps) => {
  const variantClass =
    variant === "danger"
      ? "text-[var(--danger-text)] hover:bg-[var(--danger-soft)]"
      : "hover:bg-[var(--muted)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${variantClass}`}
    >
      {children}
    </button>
  );
};