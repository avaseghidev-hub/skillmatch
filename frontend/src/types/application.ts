export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "IN_PROGRESS"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export interface JobApplication {
  id: number;
  userId: number;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  workMode?: string;
  source?: string;
  jobDescription?: string;
  notes?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;

  // Persisted analysis result from backend
  skillMatchResult?: SkillMatchResult | null;
}

export interface CreateJobApplicationRequest {
  userId: number;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  workMode?: string;
  source?: string;
  jobDescription?: string;
  notes?: string;
  status: ApplicationStatus; 
}

// Skill match analysis result from backend
export interface SkillMatchResult {
  id: number;
  jobApplicationId: number;
  skillsFoundInJob: string;
  matchedSkills: string;
  missingSkills: string;
  matchScore: number;
  recommendation: string;
}

