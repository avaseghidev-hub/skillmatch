import { useEffect } from "react";
import type { ReactNode } from "react";
import { modalStyles } from "../../styles/components/modal";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl"; // controls modal size 
}

export const Modal = ({ title, children, onClose, size }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // choose width based on mode (view/edit)
  const sizeClass = {
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  }[size || "lg"];

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div
        className={`${modalStyles.panel} w-full ${sizeClass}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className={modalStyles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};