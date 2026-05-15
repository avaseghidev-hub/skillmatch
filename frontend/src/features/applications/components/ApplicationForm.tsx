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
import { JobDescriptionInput } from "./JobDescriptionInput";
import { parseJobFieldsFromText } from "../utils/jobDescriptionParser";
import {
  WORK_MODE_OPTIONS,
  APPLICATION_STATUS_OPTIONS,
} from "../constants/applicationOptions";

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
        companyName: prev.companyName || parsedFields.companyName,
        jobTitle: prev.jobTitle || parsedFields.jobTitle,
        location: prev.location || parsedFields.location,
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
          <JobDescriptionInput
            value={formData.jobDescription || ""}
            onChange={(value) => handleChange("jobDescription", value)}
            onImageUpload={handleImageUpload}
            isExtracting={isExtractingImage}
          />

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
              placeholder="Select work mode"
              options={WORK_MODE_OPTIONS}
            />

            <Select
              value={formData.status}
              onChange={(event) =>
                handleChange(
                  "status",
                  event.target.value as CreateJobApplicationRequest["status"]
                )
              }
              options={APPLICATION_STATUS_OPTIONS}
            />

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