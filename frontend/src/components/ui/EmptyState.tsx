import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
      <h2 className="text-lg font-bold">{title}</h2>

      {description && (
        <p className="mt-2 text-sm opacity-70">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};