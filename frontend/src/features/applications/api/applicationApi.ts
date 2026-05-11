import { axiosClient } from "../../../api/axiosClient";
import type {
  CreateJobApplicationRequest,
  JobApplication,
  SkillMatchResult,
} from "../../../types/application";

/**
 * Fetch all job applications for the logged-in user.
 */
export const getApplications = async (
  userId: number
): Promise<JobApplication[]> => {
  const response = await axiosClient.get(`/job-applications/user/${userId}`);
  return response.data;
};

/**
 * Create a new job application.
 */
export const createApplication = async (
  data: CreateJobApplicationRequest
): Promise<JobApplication> => {
  const response = await axiosClient.post("/job-applications", data);
  return response.data;
};

/**
 * Analyze skill match for a selected job application.
 */
export const analyzeApplication = async (
  jobApplicationId: number
): Promise<SkillMatchResult> => {
  const response = await axiosClient.post("/skill-match-results/analyze", {
    jobApplicationId,
  });

  return response.data;
};

/**
 * Update an existing job application.
 */
export const updateApplication = async (
  id: number,
  data: Partial<CreateJobApplicationRequest>
): Promise<JobApplication> => {
  const response = await axiosClient.put(`/job-applications/${id}`, data);
  return response.data;
};

/**
 * Delete a job application by id.
 */
export const deleteApplication = async (id: number): Promise<void> => {
  await axiosClient.delete(`/job-applications/${id}`);
};