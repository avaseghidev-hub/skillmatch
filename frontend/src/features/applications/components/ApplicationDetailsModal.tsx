import { useState } from "react";
import type { ReactNode } from "react";
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
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<JobApplication>(application);

  // Check if form data has changed before saving
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
    setIsSaving(true);

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

    setIsSaving(false);

    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <Modal title="Application Details" onClose={onClose} size={isEditing ? "xl" : "lg"}
>
      {isEditing ? (
        <div className="space-y-5 text-sm">
            {/* Edit mode notice */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
            You are editing this application. Save changes when finished.
            </div>

            {/* Basic information */}
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
                onChange={(event) => handleChange("jobTitle", event.target.value)}
                placeholder="Job title"
                />

                <Input
                value={formData.location || ""}
                onChange={(event) => handleChange("location", event.target.value)}
                placeholder="Location"
                />

                <Select
                value={formData.workMode || ""}
                onChange={(event) => handleChange("workMode", event.target.value)}
                >
                <option value="">Select work mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
                </Select>

                <Select
                value={formData.status}
                onChange={(event) =>
                    handleChange("status", event.target.value as ApplicationStatus)
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
                value={formData.source || ""}
                onChange={(event) => handleChange("source", event.target.value)}
                placeholder="Source"
                />
            </div>
            </section>

            {/* Job URL */}
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

            {/* Description and notes */}
            <section className="space-y-3">
            <div>
                <h3 className="font-semibold">Description & Notes</h3>
                <p className="mt-1 text-xs opacity-60">
                Job description and your personal notes.
                </p>
            </div>

            <Textarea
                value={formData.jobDescription || ""}
                onChange={(event) =>
                handleChange("jobDescription", event.target.value)
                }
                placeholder="Job description"
                rows={4}
            />

            <Textarea
                value={formData.notes || ""}
                onChange={(event) => handleChange("notes", event.target.value)}
                placeholder="Notes"
                rows={3}
            />
            </section>

            {/* Edit actions */}
            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
            </Button>

            <Button onClick={handleSave} disabled={isUpdating || !hasChanges}>
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
              <h3 className="text-2xl font-bold">
                {application.companyName}
              </h3>
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

          <DetailBlock
            label="Job Description"
            value={application.jobDescription}
          />

          <DetailBlock label="Notes" value={application.notes} />

          <div className="flex justify-end gap-2">
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

interface DetailBlockProps {
  label: string;
  value?: string;
}

const DetailBlock = ({ label, value }: DetailBlockProps) => {
  return (
    <div>
      <p className="mb-2 font-medium">{label}</p>
      <div className="min-h-20 whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 leading-6 opacity-80">
        {value || "-"}
      </div>
    </div>
  );
};