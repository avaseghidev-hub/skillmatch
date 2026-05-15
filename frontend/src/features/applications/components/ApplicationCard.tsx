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
      <ApplicationCardHeader application={application} />

      <ApplicationCardMeta application={application} />

      <ApplicationCardActions
        application={application}
        hasAnalysis={Boolean(analysis)}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onViewDetails={() => setIsDetailsOpen(true)}
        onAnalyze={() => onAnalyze(application.id)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {errorMessage && (
        <ApplicationErrorMessage
          message={errorMessage}
          onRetry={() => onAnalyze(application.id)}
        />
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

interface ApplicationCardSectionProps {
  application: JobApplication;
}

const ApplicationCardHeader = ({ application }: ApplicationCardSectionProps) => {
  return (
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
  );
};

const ApplicationCardMeta = ({ application }: ApplicationCardSectionProps) => {
  return (
    <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
      <p>📍 {application.location || "-"}</p>
      <p>💼 {application.workMode || "-"}</p>
    </div>
  );
};

interface ApplicationCardActionsProps {
  application: JobApplication;
  hasAnalysis: boolean;
  isLoading?: boolean;
  isDeleting?: boolean;
  onViewDetails: () => void;
  onAnalyze: () => void;
  onDelete: () => void;
}

const ApplicationCardActions = ({
  hasAnalysis,
  isLoading,
  isDeleting,
  onViewDetails,
  onAnalyze,
  onDelete,
}: ApplicationCardActionsProps) => {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Button variant="primary" onClick={onViewDetails}>
        View Details
      </Button>

      <Button variant="secondary" onClick={onAnalyze} disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner />
            Analyzing...
          </span>
        ) : hasAnalysis ? (
          "Re-analyze"
        ) : (
          "Analyze"
        )}
      </Button>

      <Button variant="secondary" onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

interface ApplicationErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ApplicationErrorMessage = ({
  message,
  onRetry,
}: ApplicationErrorMessageProps) => {
  return (
    <div className="mt-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>

        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-medium underline hover:opacity-80"
        >
          Retry
        </button>
      </div>
    </div>
  );
};