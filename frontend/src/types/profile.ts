/**
 * Profile data returned by backend.
 */
export type UserProfile = {
  id: number;
  userId: number;
  fullName: string;
  targetRole: string;
  location: string;
  preferredWorkMode: string;
  skills: string;
  languages: string;
  resumeText: string;
};

/**
 * Create profile request payload.
 */
export type CreateUserProfileRequest = {
  userId: number;
  fullName: string;
  targetRole: string;
  location: string;
  preferredWorkMode: string;
  skills: string;
  languages: string;
  resumeText: string;
};

/**
 * Update profile request payload.
 */
export type UpdateUserProfileRequest = Partial<
  Omit<CreateUserProfileRequest, "userId">
>;