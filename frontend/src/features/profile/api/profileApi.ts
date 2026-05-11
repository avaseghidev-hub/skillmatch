import { axiosClient } from "../../../api/axiosClient";
import type {
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
  UserProfile,
} from "../../../types/profile";

/**
 * Create a user profile.
 */
export const createProfile = async (
  data: CreateUserProfileRequest
): Promise<UserProfile> => {
  const response = await axiosClient.post("/profiles", data);
  return response.data;
};

/**
 * Get profile by logged-in user id.
 */
export const getProfileByUserId = async (
  userId: number
): Promise<UserProfile> => {
  const response = await axiosClient.get(`/profiles/user/${userId}`);
  return response.data;
};

/**
 * Update profile by user id.
 */
export const updateProfile = async (
  userId: number,
  data: UpdateUserProfileRequest
): Promise<UserProfile> => {
  const response = await axiosClient.put(`/profiles/user/${userId}`, data);
  return response.data;
};

/**
 * Upload resume PDF and update profile with extracted text and skills.
 */
export const uploadResume = async (
  userId: number,
  file: File
): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(
    `/profiles/user/${userId}/resume`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};