import type { BadgeVariant } from "../../../components/ui/Badge";
import type { ApplicationStatus } from "../../../types/application";

// Returns badge variant based on application status
export const getStatusBadgeVariant = (
  status: ApplicationStatus
): BadgeVariant => {
  switch (status) {
    case "APPLIED":
      return "info";
    case "IN_PROGRESS":
    case "INTERVIEW":
      return "warning";
    case "OFFER":
      return "success";
    case "REJECTED":
      return "danger";
    case "SAVED":
    default:
      return "neutral";
  }
};

// Converts status value to readable text
export const formatApplicationStatus = (status: ApplicationStatus): string =>
  status.replace("_", " ");