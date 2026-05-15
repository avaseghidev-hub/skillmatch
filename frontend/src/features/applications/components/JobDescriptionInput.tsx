import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";
import { Spinner } from "../../../components/ui/Spinner";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isExtracting?: boolean;
}

/**
 * Reusable job description input with image OCR upload support.
 */
export const JobDescriptionInput = ({
  value,
  onChange,
  onImageUpload,
  isExtracting = false,
}: JobDescriptionInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Open hidden file input from the visible upload button.
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Job description</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Upload a job screenshot or paste the job description manually.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
            disabled={isExtracting}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={handleUploadClick}
            disabled={isExtracting}
          >
            {isExtracting ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Extracting...
              </span>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste job description here..."
        rows={7}
      />
    </div>
  );
};