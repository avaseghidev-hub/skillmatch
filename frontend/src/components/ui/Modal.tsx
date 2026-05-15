import type { ReactNode } from "react";
import { IconButton } from "./IconButton";

interface ModalProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export const Modal = ({
  title,
  children,
  onClose,
  size = "lg",
}: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Modal container */}
      <div
        className={`
          relative
          flex
          max-h-[90vh]
          w-full
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          shadow-2xl
          ${sizeClasses[size]}
        `}
      >
        {/* Sticky modal header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 py-5">
          <h2 className="text-2xl font-bold">{title}</h2>

          <IconButton
            onClick={onClose}
            ariaLabel="Close modal"
          >
            <span className="text-xl leading-none">×</span>
          </IconButton>
        </div>

        {/* Scrollable modal content */}
        <div className="overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};