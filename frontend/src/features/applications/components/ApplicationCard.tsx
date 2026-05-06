import { useState } from "react";
import type { JobApplication } from "../../../types/application";
import { MatchResultPanel } from "./MatchResultPanel";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import {
  formatApplicationStatus,
  getStatusBadgeVariant,
} from "../utils/applicationStatusUtils";
import { Spinner } from "../../../components/ui/Spinner";
import { ApplicationDetailsModal } from "./ApplicationDetailsModal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

interface ApplicationCardProps {
  application: JobApplication;
  onAnalyze: (jobApplicationId: number) => void;
  onClearAnalysis: (applicationId: number) => void;
  onUpdate: (id: number, data: Partial<JobApplication>) => Promise<boolean>;
  isLoading?: boolean;
  errorMessage?: string;
  isUpdating?: boolean;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const ApplicationCard = ({
  application,
  onAnalyze,
  onClearAnalysis,
  onUpdate,
  isLoading,
  errorMessage,
  isUpdating,
  onDelete,
  isDeleting,
}: ApplicationCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const analysis = application.skillMatchResult;

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{application.companyName}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {application.jobTitle}
          </p>
        </div>

        <Badge variant={getStatusBadgeVariant(application.status)}>
          {formatApplicationStatus(application.status)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
        <p>📍 {application.location || "-"}</p>
        <p>💼 {application.workMode || "-"}</p>
      </div>

      <div className="mt-5 flex gap-2">
        <Button variant="primary" onClick={() => setIsDetailsOpen(true)}>
          View Details
        </Button>

        <Button
          variant="secondary"
          onClick={() => onAnalyze(application.id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Analyzing...
            </span>
          ) : analysis ? (
            "Re-analyze"
          ) : (
            "Analyze"
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setIsDeleteOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
          <div className="flex items-center justify-between gap-4">
            <span>{errorMessage}</span>

            <button
              onClick={() => onAnalyze(application.id)}
              className="text-xs font-medium underline hover:opacity-80"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-4">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => onClearAnalysis(application.id)}
              className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Hide result
            </button>
          </div>

          <MatchResultPanel analysis={analysis} />
        </div>
      )}

      {isDetailsOpen && (
        <ApplicationDetailsModal
          application={application}
          onClose={() => setIsDetailsOpen(false)}
          onUpdate={onUpdate}
          isUpdating={isUpdating}
        />
      )}

      {isDeleteOpen && (
        <ConfirmModal
          title="Delete Application"
          description="Are you sure you want to delete this application? This action cannot be undone."
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            onDelete(application.id);
            setIsDeleteOpen(false);
          }}
          isLoading={isDeleting}
        />
      )}
    </Card>
  );
};