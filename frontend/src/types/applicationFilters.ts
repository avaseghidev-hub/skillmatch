import type { ApplicationStatus } from "./application";

// Filter state for applications list
export interface ApplicationFilters {
  search: string;
  status: ApplicationStatus | "";
  workMode: string | "";
  location: string | "";
  createdFrom: string;
  createdTo: string;
  updatedFrom: string;
  updatedTo: string;
}

export const initialApplicationFilters: ApplicationFilters = {
  search: "",
  status: "",
  workMode: "",
  location: "",
  createdFrom: "",
  createdTo: "",
  updatedFrom: "",
  updatedTo: "",
};