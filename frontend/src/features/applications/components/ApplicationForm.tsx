import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateJobApplicationRequest } from "../../../types/application";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Spinner } from "../../../components/ui/Spinner";

interface ApplicationFormProps {
  onSubmit: (data: CreateJobApplicationRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const initialFormData: CreateJobApplicationRequest = {
  userId: 1,
  companyName: "",
  jobTitle: "",
  jobUrl: "",
  location: "",
  workMode: "",
  source: "",
  jobDescription: "",
  notes: "",
  status: "SAVED",
};

export const ApplicationForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ApplicationFormProps) => {
  const [formData, setFormData] =
    useState<CreateJobApplicationRequest>(initialFormData);

  const [formError, setFormError] = useState("");

  // Update field value
  const handleChange = <K extends keyof CreateJobApplicationRequest>(
    field: K,
    value: CreateJobApplicationRequest[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate required fields
  const validateForm = () => {
    if (!formData.companyName.trim()) return "Company name is required.";
    if (!formData.jobTitle.trim()) return "Job title is required.";
    return "";
  };

  // Submit form data
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    await onSubmit(formData);
    setFormData(initialFormData);
    onCancel();
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
        <fieldset disabled={isSubmitting} className="space-y-4">
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

          <Textarea
            value={formData.jobDescription}
            onChange={(event) =>
              handleChange("jobDescription", event.target.value)
            }
            placeholder="Job description"
            rows={4}
          />

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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Saving...
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