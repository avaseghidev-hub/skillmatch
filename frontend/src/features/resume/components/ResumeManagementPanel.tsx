import { useState } from "react";
import type { ChangeEvent } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Spinner } from "../../../components/ui/Spinner";
import { extractResumeText } from "../api/resumeApi";

type ResumeManagementPanelProps = {
  resumeText: string;
  skills: string;
  onReplaceResume: (resumeText: string) => void;
  onRemoveResume: () => void;
};

export const ResumeManagementPanel = ({
  resumeText,
  skills,
  onReplaceResume,
  onRemoveResume,
}: ResumeManagementPanelProps) => {
  const [isReplacing, setIsReplacing] = useState(false);
  const [error, setError] = useState("");

  const detectedSkills = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const handleReplaceFile = async (
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
      setIsReplacing(true);

      const extractedText = await extractResumeText(file);
      onReplaceResume(extractedText);
    } catch (error) {
      console.error("Resume replacement failed", error);
      setError("Failed to replace resume. Please try again.");
    } finally {
      setIsReplacing(false);
      event.target.value = "";
    }
  };

  if (!resumeText.trim()) {
    return null;
  }

  return (
    <Card className="mb-6 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Resume status</h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Resume text has been extracted and is ready for matching.
          </p>
        </div>

        <Badge variant="success">Parsed</Badge>
      </div>

      {detectedSkills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Detected skills</p>

          <div className="flex flex-wrap gap-2">
            {detectedSkills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2 border-t border-[var(--border)] pt-4">
        <label className="min-w-[140px] cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--card-foreground)] hover:bg-slate-100 dark:hover:bg-slate-800">
          {isReplacing ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Replacing...
            </span>
          ) : (
            "Replace resume"
          )}

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleReplaceFile}
            className="hidden"
            disabled={isReplacing}
          />
        </label>

        <Button
          type="button"
          variant="danger"
          onClick={onRemoveResume}
          className="min-w-[140px]"
        >
          Remove resume
        </Button>
      </div>
    </Card>
  );
};