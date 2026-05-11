import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { CreateJobApplicationRequest } from "../../../types/application";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Spinner } from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/context/AuthContext";
import { extractJobDescriptionFromImage } from "../api/jobDescriptionApi";

interface ApplicationFormProps {
  onSubmit: (data: CreateJobApplicationRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Create empty form data for the logged-in user.
 */
const createInitialFormData = (userId: number): CreateJobApplicationRequest => ({
  userId,
  companyName: "",
  jobTitle: "",
  jobUrl: "",
  location: "",
  workMode: "",
  source: "",
  jobDescription: "",
  notes: "",
  status: "SAVED",
});

/**
 * Try to detect basic job fields from extracted OCR text.
 */
const parseJobFieldsFromText = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const jobTitle =
    lines.find((line) =>
      /engineer|developer|frontend|backend|fullstack|software/i.test(line)
    ) ?? "";

  const workMode = /remote/i.test(text)
    ? "Remote"
    : /hybrid/i.test(text)
    ? "Hybrid"
    : /onsite|on-site/i.test(text)
    ? "Onsite"
    : "";

  return {
    jobTitle,
    workMode,
  };
};

export const ApplicationForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ApplicationFormProps) => {
  const { userId } = useAuth();

  const safeUserId = userId ?? 0;

  const [formData, setFormData] = useState<CreateJobApplicationRequest>(() =>
    createInitialFormData(safeUserId)
  );

  const [formError, setFormError] = useState("");
  const [isExtractingImage, setIsExtractingImage] = useState(false);

  /**
   * Update a single form field.
   */
  const handleChange = <K extends keyof CreateJobApplicationRequest>(
    field: K,
    value: CreateJobApplicationRequest[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Extract text from uploaded job image and auto-fill detected fields.
   */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setFormError("");
      setIsExtractingImage(true);

      const extractedText = await extractJobDescriptionFromImage(file);
      const parsedFields = parseJobFieldsFromText(extractedText);

      setFormData((prev) => ({
        ...prev,
        jobDescription: extractedText,
        jobTitle: prev.jobTitle || parsedFields.jobTitle,
        workMode: prev.workMode || parsedFields.workMode,
      }));
    } catch (error) {
      console.error("Image OCR failed", error);
      setFormError("Failed to extract text from image. Please try again.");
    } finally {
      setIsExtractingImage(false);
      event.target.value = "";
    }
  };

  /**
   * Validate required fields before submitting.
   */
  const validateForm = () => {
    if (!safeUserId) return "User is not authenticated.";
    if (!formData.companyName.trim()) return "Company name is required.";
    if (!formData.jobTitle.trim()) return "Job title is required.";
    return "";
  };

  /**
   * Submit job application data.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");

    await onSubmit({
      ...formData,
      userId: safeUserId,
    });

    setFormData(createInitialFormData(safeUserId));
  };

  return (
    <Card className="mb-6 p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Add Job Application</h2>
        <p className="mt-1 text-sm opacity-70">
          Save a new job opportunity for tracking and skill analysis.
        </p>
      </div>

      {formError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset
          disabled={isSubmitting || isExtractingImage}
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={formData.companyName}
              onChange={(event) =>
                handleChange("companyName", event.target.value)
              }
              placeholder="Company name *"
              required
            />

            <Input
              value={formData.jobTitle}
              onChange={(event) =>
                handleChange("jobTitle", event.target.value)
              }
              placeholder="Job title *"
              required
            />

            <Input
              value={formData.location}
              onChange={(event) =>
                handleChange("location", event.target.value)
              }
              placeholder="Location"
            />

            <Select
              value={formData.workMode}
              onChange={(event) =>
                handleChange("workMode", event.target.value)
              }
            >
              <option value="">Select work mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </Select>

            <Select
              value={formData.status}
              onChange={(event) =>
                handleChange(
                  "status",
                  event.target.value as CreateJobApplicationRequest["status"]
                )
              }
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </Select>

            <Input
              value={formData.jobUrl}
              onChange={(event) => handleChange("jobUrl", event.target.value)}
              placeholder="Job URL"
              className="md:col-span-2"
            />

            <Input
              value={formData.source}
              onChange={(event) => handleChange("source", event.target.value)}
              placeholder="Source"
              className="md:col-span-2"
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Job description</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Paste the job description text or upload an image to extract
                  it.
                </p>
              </div>

              <label className="cursor-pointer rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]">
                {isExtractingImage ? "Extracting..." : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <Textarea
              value={formData.jobDescription}
              onChange={(event) =>
                handleChange("jobDescription", event.target.value)
              }
              placeholder="Paste job description here..."
              rows={6}
            />
          </div>

          <Textarea
            value={formData.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            placeholder="Notes"
            rows={3}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting || isExtractingImage}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Saving...
                </span>
              ) : isExtractingImage ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Extracting...
                </span>
              ) : (
                "Save Application"
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Card>
  );
};