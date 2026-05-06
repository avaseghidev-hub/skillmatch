type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
}

const toastVariants: Record<ToastVariant, string> = {
  success:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-200",
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  info:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
};

// Reusable toast notification
export const Toast = ({
  message,
  variant = "info",
  onClose,
}: ToastProps) => {
  return (
    <div
      className={`fixed right-6 top-6 z-50 flex items-center gap-4 rounded-xl border px-4 py-3 text-sm shadow-lg ${toastVariants[variant]}`}
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="font-bold opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
};