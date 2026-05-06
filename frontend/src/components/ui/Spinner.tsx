interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className = "" }: SpinnerProps) => {
  return (
    <span
      className={`h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
};