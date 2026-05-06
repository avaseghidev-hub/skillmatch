import {
  initialApplicationFilters,
  type ApplicationFilters,
} from "../../../types/applicationFilters";
import type { ApplicationStatus } from "../../../types/application";

export const getFiltersFromUrl = (): ApplicationFilters => {
  const params = new URLSearchParams(window.location.search);

  return {
    search: params.get("search") ?? initialApplicationFilters.search,
    status:
      (params.get("status") as ApplicationStatus | "") ??
      initialApplicationFilters.status,
    workMode: params.get("workMode") ?? initialApplicationFilters.workMode,
    location: params.get("location") ?? initialApplicationFilters.location,
    createdFrom:
      params.get("createdFrom") ?? initialApplicationFilters.createdFrom,
    createdTo: params.get("createdTo") ?? initialApplicationFilters.createdTo,
    updatedFrom:
      params.get("updatedFrom") ?? initialApplicationFilters.updatedFrom,
    updatedTo: params.get("updatedTo") ?? initialApplicationFilters.updatedTo,
  };
};

export const syncFiltersToUrl = (filters: ApplicationFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim() !== "") {
      params.set(key, value);
    }
  });

  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState(null, "", newUrl);
};