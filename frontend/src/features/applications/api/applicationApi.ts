import { axiosClient } from "../../../api/axiosClient";
import type {
  CreateJobApplicationRequest,
  JobApplication,
  SkillMatchResult,
} from "../../../types/application";

export const getApplications = async (): Promise<JobApplication[]> => {
  const response = await axiosClient.get("/job-applications/user/1");
  return response.data;
};

// Create a new job application
export const createApplication = async (
  data: CreateJobApplicationRequest
): Promise<JobApplication> => {
  const response = await axiosClient.post("/job-applications", data);
  return response.data;
};

// Call backend to analyze skill match
export const analyzeApplication = async (
  jobApplicationId: number
): Promise<SkillMatchResult> => {
  const response = await axiosClient.post("/skill-match-results/analyze", {
    jobApplicationId,
  });

  return response.data;
};

export const updateApplication = async (
  id: number,
  data: Partial<CreateJobApplicationRequest>
): Promise<JobApplication> => {
  const response = await axiosClient.put(`/job-applications/${id}`, data);
  return response.data;
};

// Delete job application
export const deleteApplication = async (id: number): Promise<void> => {
  await axiosClient.delete(`/job-applications/${id}`);
};