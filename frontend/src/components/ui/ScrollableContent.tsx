interface ScrollableContentProps {
  content?: string;
  maxHeight?: string;
  emptyMessage?: string;
  className?: string;
}

export const ScrollableContent = ({
  content,
  maxHeight = "max-h-80",
  emptyMessage = "-",
  className = "",
}: ScrollableContentProps) => {
  return (
    <div
      className={`
        overflow-y-auto
        whitespace-pre-wrap
        break-words
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--background)]
        p-4
        leading-6
        text-sm
        opacity-90
        ${maxHeight}
        ${className}
      `}
    >
      {content?.trim() || emptyMessage}
    </div>
  );
};