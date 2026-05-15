import type { JobApplication } from "../../../types/application";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicationListProps {
  applications: JobApplication[];
  onAnalyze: (jobApplicationId: number) => void;
  onClearAnalysis: (applicationId: number) => void;
  onUpdate: (id: number, data: Partial<JobApplication>) => Promise<boolean>;
  loadingId: number | null;
  errorById: Record<number, string>;
  updatingId: number | null;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export const ApplicationList = ({
  applications,
  onAnalyze,
  onClearAnalysis,
  onUpdate,
  loadingId,
  errorById,
  updatingId,
  onDelete,
  deletingId,
}: ApplicationListProps) => {
  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          onAnalyze={onAnalyze}
          onClearAnalysis={onClearAnalysis}
          onUpdate={onUpdate}
          isLoading={loadingId === app.id}
          errorMessage={errorById[app.id]}
          isUpdating={updatingId === app.id}
          onDelete={onDelete}
          isDeleting={deletingId === app.id}
        />
      ))}
    </div>
  );
};