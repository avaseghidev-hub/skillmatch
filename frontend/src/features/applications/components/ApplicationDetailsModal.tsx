import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../../types/application";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import {
  formatApplicationStatus,
  getStatusBadgeVariant,
} from "../utils/applicationStatusUtils";
import { Spinner } from "../../../components/ui/Spinner";
import { ScrollableContent } from "../../../components/ui/ScrollableContent";
import { CollapsibleSection } from "../../../components/ui/CollapsibleSection";
import { extractJobDescriptionFromImage } from "../api/jobDescriptionApi";
import { JobDescriptionInput } from "./JobDescriptionInput";
import {
  WORK_MODE_OPTIONS,
  APPLICATION_STATUS_OPTIONS,
} from "../constants/applicationOptions";

interface ApplicationDetailsModalProps {
  application: JobApplication;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<JobApplication>) => Promise<boolean>;
  isUpdating?: boolean;
}

export const ApplicationDetailsModal = ({
  application,
  onClose,
  onUpdate,
  isUpdating = false,
}: ApplicationDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JobApplication>(application);
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [formError, setFormError] = useState("");

  const hasChanges =
    formData.companyName !== application.companyName ||
    formData.jobTitle !== application.jobTitle ||
    formData.location !== application.location ||
    formData.workMode !== application.workMode ||
    formData.status !== application.status ||
    formData.jobUrl !== application.jobUrl ||
    formData.source !== application.source ||
    formData.jobDescription !== application.jobDescription ||
    formData.notes !== application.notes;

  const handleChange = <K extends keyof JobApplication>(
    field: K,
    value: JobApplication[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancelEdit = () => {
    setFormData(application);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const success = await onUpdate(application.id, {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      jobUrl: formData.jobUrl,
      location: formData.location,
      workMode: formData.workMode,
      source: formData.source,
      jobDescription: formData.jobDescription,
      notes: formData.notes,
      status: formData.status,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  /**
   * Extract text from uploaded image while editing an application.
   */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setFormError("");
      setIsExtractingImage(true);

      const extractedText = await extractJobDescriptionFromImage(file);

      setFormData((prev) => ({
        ...prev,
        jobDescription: extractedText,
      }));
    } catch (error) {
      console.error("Image OCR failed", error);
      setFormError("Failed to extract text from image. Please try again.");
    } finally {
      setIsExtractingImage(false);
      event.target.value = "";
    }
  };

  return (
    <Modal title="Application Details" onClose={onClose} size="xl">
      {isEditing ? (
        <div className="space-y-5 text-sm">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
            You are editing this application. Save changes when finished.
          </div>

          {/* Error message */}
          {formError && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </p>
          )}

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Basic Information</h3>
              <p className="mt-1 text-xs opacity-60">
                Main job and company details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formData.companyName}
                onChange={(event) =>
                  handleChange("companyName", event.target.value)
                }
                placeholder="Company name"
              />

              <Input
                value={formData.jobTitle}
                onChange={(event) =>
                  handleChange("jobTitle", event.target.value)
                }
                placeholder="Job title"
              />

              <Input
                value={formData.location || ""}
                onChange={(event) =>
                  handleChange("location", event.target.value)
                }
                placeholder="Location"
              />

              <Select
                value={formData.workMode || ""}
                onChange={(event) => handleChange("workMode", event.target.value)}
                placeholder="Select work mode"
                options={WORK_MODE_OPTIONS}
              />

              <Select
                value={formData.status}
                onChange={(event) =>
                  handleChange("status", event.target.value as ApplicationStatus)
                }
                options={APPLICATION_STATUS_OPTIONS}
              />

              <Input
                value={formData.source || ""}
                onChange={(event) => handleChange("source", event.target.value)}
                placeholder="Source"
              />
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Job Link</h3>
              <p className="mt-1 text-xs opacity-60">
                Link to the original job posting.
              </p>
            </div>

            <Input
              value={formData.jobUrl || ""}
              onChange={(event) => handleChange("jobUrl", event.target.value)}
              placeholder="Job URL"
            />
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Description & Notes</h3>
              <p className="mt-1 text-xs opacity-60">
                Job description and your personal notes.
              </p>
            </div>

            <JobDescriptionInput
              value={formData.jobDescription || ""}
              onChange={(value) => handleChange("jobDescription", value)}
              onImageUpload={handleImageUpload}
              isExtracting={isExtractingImage}
            />

            <Textarea
              value={formData.notes || ""}
              onChange={(event) => handleChange("notes", event.target.value)}
              placeholder="Notes"
              rows={3}
            />
          </section>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <Button variant="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={isUpdating || isExtractingImage || !hasChanges}
            >             
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">{application.companyName}</h3>
              <p className="mt-1 opacity-70">{application.jobTitle}</p>
            </div>

            <Badge variant={getStatusBadgeVariant(application.status)}>
              {formatApplicationStatus(application.status)}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem label="Location" value={application.location} />
            <DetailItem label="Work Mode" value={application.workMode} />
            <DetailItem label="Source" value={application.source} />
            <DetailItem
              label="Job URL"
              value={
                application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline"
                  >
                    Open job link
                  </a>
                ) : (
                  "-"
                )
              }
            />
          </div>

          <CollapsibleSection
            title="Job Description"
            defaultOpen
          >
            <ScrollableContent
              content={application.jobDescription}
              maxHeight="max-h-80"
            />
          </CollapsibleSection>

          <CollapsibleSection title="Notes">
            <ScrollableContent
              content={application.notes}
              maxHeight=""
            />
          </CollapsibleSection>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>

            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

interface DetailItemProps {
  label: string;
  value?: ReactNode;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
      <p className="text-xs font-medium uppercase opacity-60">{label}</p>
      <div className="mt-1 break-words">{value || "-"}</div>
    </div>
  );
};