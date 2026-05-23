import { useState } from "react";
import type { ChangeEvent } from "react";
import { Card } from "../../../components/ui/Card";
import { Spinner } from "../../../components/ui/Spinner";
import { extractResumeText } from "../api/resumeApi";

type ResumeUploadBoxProps = {
  onTextExtracted: (resumeText: string) => void;
};

/**
 * Upload a resume PDF and extract its text.
 */
export const ResumeUploadBox = ({
  onTextExtracted,
}: ResumeUploadBoxProps) => {
  const [fileName, setFileName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Send selected PDF file to backend for text extraction.
   */
  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      setError("");
      setFileName(file.name);
      setIsExtracting(true);

      const extractedText = await extractResumeText(file);

      onTextExtracted(extractedText);
    } catch (error) {
      console.error("Resume extraction failed", error);
      setError("Failed to extract resume text. Please try again.");
    } finally {
      setIsExtracting(false);
      event.target.value = "";
    }
  };

  return (
    <Card className="mb-6 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Upload resume</h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Upload your PDF resume to extract text and prepare skill analysis.
          </p>

          {fileName && (
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Selected file: {fileName}
            </p>
          )}
        </div>

        <label className="cursor-pointer rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]">
          {isExtracting ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Extracting...
            </span>
          ) : (
            "Choose PDF"
          )}

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isExtracting}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
          {error}
        </p>
      )}
    </Card>
  );
};