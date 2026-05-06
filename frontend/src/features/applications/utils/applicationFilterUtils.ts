import type { JobApplication } from "../../../types/application";
import type { ApplicationFilters } from "../../../types/applicationFilters";

export const filterApplications = (
  applications: JobApplication[],
  filters: ApplicationFilters
): JobApplication[] => {
  const search = filters.search.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();

  return applications.filter((app) => {
    const matchesSearch =
      search === "" ||
      app.companyName.toLowerCase().includes(search) ||
      app.jobTitle.toLowerCase().includes(search);

    const matchesStatus = filters.status === "" || app.status === filters.status;

    const matchesWorkMode =
      filters.workMode === "" || app.workMode === filters.workMode;

    const matchesLocation =
      location === "" || (app.location ?? "").toLowerCase().includes(location);

    const createdAt = new Date(app.createdAt);
    const updatedAt = new Date(app.updatedAt);

    const matchesCreatedFrom =
      filters.createdFrom === "" || createdAt >= new Date(filters.createdFrom);

    const matchesCreatedTo =
      filters.createdTo === "" || createdAt <= new Date(filters.createdTo);

    const matchesUpdatedFrom =
      filters.updatedFrom === "" || updatedAt >= new Date(filters.updatedFrom);

    const matchesUpdatedTo =
      filters.updatedTo === "" || updatedAt <= new Date(filters.updatedTo);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesWorkMode &&
      matchesLocation &&
      matchesCreatedFrom &&
      matchesCreatedTo &&
      matchesUpdatedFrom &&
      matchesUpdatedTo
    );
  });
};

export const hasActiveFilters = (filters: ApplicationFilters): boolean => {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "" ||
    filters.workMode !== "" ||
    filters.location.trim() !== "" ||
    filters.createdFrom !== "" ||
    filters.createdTo !== "" ||
    filters.updatedFrom !== "" ||
    filters.updatedTo !== ""
  );
};