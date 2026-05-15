import type {
  CreateUserProfileRequest,
  UserProfile,
} from "../../../types/profile";

type ProfileCompletionSource = UserProfile | CreateUserProfileRequest;

export interface ProfileCompletionResult {
  percentage: number;
  missingItems: string[];
}

const hasValue = (value?: string | null) => Boolean(value?.trim());

export const calculateProfileCompletion = (
  profile: ProfileCompletionSource | null
): ProfileCompletionResult => {
  if (!profile) {
    return {
      percentage: 0,
      missingItems: [
        "Full name",
        "Target role",
        "Location",
        "Preferred work mode",
        "Skills",
        "Languages",
        "Resume text",
      ],
    };
  }

  let score = 0;
  const missingItems: string[] = [];

  if (hasValue(profile.fullName)) {
    score += 15;
  } else {
    missingItems.push("Full name");
  }

  if (hasValue(profile.targetRole)) {
    score += 15;
  } else {
    missingItems.push("Target role");
  }

  if (hasValue(profile.location)) {
    score += 10;
  } else {
    missingItems.push("Location");
  }

  if (hasValue(profile.preferredWorkMode)) {
    score += 10;
  } else {
    missingItems.push("Preferred work mode");
  }

  if (hasValue(profile.skills)) {
    score += 25;
  } else {
    missingItems.push("Skills");
  }

  if (hasValue(profile.languages)) {
    score += 10;
  } else {
    missingItems.push("Languages");
  }

  if (hasValue(profile.resumeText)) {
    score += 15;
  } else {
    missingItems.push("Resume text");
  }

  return {
    percentage: score,
    missingItems,
  };
};