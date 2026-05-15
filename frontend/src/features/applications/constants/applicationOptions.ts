import type { ApplicationStatus } from "../../../types/application";
import { formatApplicationStatus } from "../utils/applicationStatusUtils";

export const WORK_MODE_OPTIONS = [
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Onsite", label: "Onsite" },
];

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "IN_PROGRESS",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export const APPLICATION_STATUS_OPTIONS = APPLICATION_STATUSES.map((status) => ({
  value: status,
  label: formatApplicationStatus(status),
}));