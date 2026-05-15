import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
} from "../api/profileApi";
import type {
  CreateUserProfileRequest,
  UserProfile,
} from "../../../types/profile";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { ResumeUploadBox } from "../../resume/components/ResumeUploadBox";
import { WORK_MODE_OPTIONS } from "../../applications/constants/applicationOptions";
import { ProfileCompletionCard } from "../components/ProfileCompletionCard";
import { ResumeManagementPanel } from "../../resume/components/ResumeManagementPanel";

type ProfileSetupPageProps = {
  onProfileSaved: () => void;
};

const createInitialFormData = (
  userId: number,
  fullName: string
): CreateUserProfileRequest => ({
  userId,
  fullName,
  targetRole: "",
  location: "",
  preferredWorkMode: "",
  skills: "",
  languages: "",
  resumeText: "",
});

const mapProfileToFormData = (
  profile: UserProfile,
  userId: number
): CreateUserProfileRequest => ({
  userId,
  fullName: profile.fullName || "",
  targetRole: profile.targetRole || "",
  location: profile.location || "",
  preferredWorkMode: profile.preferredWorkMode || "",
  skills: profile.skills || "",
  languages: profile.languages || "",
  resumeText: profile.resumeText || "",
});

const parseResumeText = (resumeText: string) => {
  const detectedSkills: string[] = [];

  const knownSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Java",
    "Spring Boot",
    "REST APIs",
    "SQL",
    "PostgreSQL",
    "Docker",
    "Git",
  ];

  for (const skill of knownSkills) {
    if (resumeText.toLowerCase().includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  }

  const suggestedRole =
    resumeText.match(
      /(Frontend Developer|Backend Developer|Full[- ]Stack Developer|Software Engineer|Java Developer)/i
    )?.[0] ?? "";

  return {
    skills: detectedSkills.join(", "),
    targetRole: suggestedRole,
  };
};

export const ProfileSetupPage = ({ onProfileSaved }: ProfileSetupPageProps) => {
  const { user, userId } = useAuth();
  const navigate = useNavigate();

  const safeUserId = userId ?? 0;

  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(
    null
  );
  const [formData, setFormData] = useState<CreateUserProfileRequest>(() =>
    createInitialFormData(safeUserId, user?.name ?? "")
  );

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(existingProfile);

  useEffect(() => {
    if (!safeUserId) return;

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setError("");

        const profile = await getProfileByUserId(safeUserId);

        setExistingProfile(profile);
        setFormData(mapProfileToFormData(profile, safeUserId));
      } catch {
        setExistingProfile(null);
        setFormData(createInitialFormData(safeUserId, user?.name ?? ""));
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [safeUserId, user?.name]);

  const handleChange = <K extends keyof CreateUserProfileRequest>(
    field: K,
    value: CreateUserProfileRequest[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResumeTextExtracted = (resumeText: string) => {
    const parsed = parseResumeText(resumeText);

    setFormData((prev) => ({
      ...prev,
      resumeText,
      skills: prev.skills || parsed.skills,
      targetRole: prev.targetRole || parsed.targetRole,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!safeUserId) {
      setError("User is not authenticated.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      if (isEditMode) {
        await updateProfile(safeUserId, formData);
      } else {
        await createProfile({
          ...formData,
          userId: safeUserId,
        });
      }

      onProfileSaved();
      navigate("/");
    } catch (error) {
      console.error("Profile save failed", error);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({
      ...prev,
      resumeText: "",
      skills: "",
    }));
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl">
        {formData.resumeText.trim() ? (
          <ResumeManagementPanel
            resumeText={formData.resumeText}
            skills={formData.skills}
            onRemoveResume={handleRemoveResume}
            onReplaceResume={handleResumeTextExtracted}
          />
        ) : (
          <ResumeUploadBox onTextExtracted={handleResumeTextExtracted} />
        )}

        <ProfileCompletionCard profile={formData} />

        <Card className="p-6">
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit your profile" : "Complete your profile"}
          </h1>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {isEditMode
              ? "Update your profile information and resume details."
              : "Review the extracted resume information and complete any missing fields."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formData.fullName}
                onChange={(event) =>
                  handleChange("fullName", event.target.value)
                }
                placeholder="Full name"
                required
              />

              <Input
                value={formData.targetRole}
                onChange={(event) =>
                  handleChange("targetRole", event.target.value)
                }
                placeholder="Target role"
              />

              <Input
                value={formData.location}
                onChange={(event) =>
                  handleChange("location", event.target.value)
                }
                placeholder="Location"
              />

              <Select
                value={formData.preferredWorkMode}
                onChange={(event) =>
                  handleChange("preferredWorkMode", event.target.value)
                }
                placeholder="Preferred work mode"
                options={WORK_MODE_OPTIONS}
              />
            </div>

            <Textarea
              value={formData.skills}
              onChange={(event) => handleChange("skills", event.target.value)}
              placeholder="Skills (comma separated)"
              rows={3}
            />

            <Textarea
              value={formData.languages}
              onChange={(event) =>
                handleChange("languages", event.target.value)
              }
              placeholder="Languages (e.g. English, German)"
              rows={2}
            />

            <Textarea
              value={formData.resumeText}
              onChange={(event) =>
                handleChange("resumeText", event.target.value)
              }
              placeholder="Extracted resume text"
              rows={6}
            />

            {error && (
              <p className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger-text)]">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              {isEditMode && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    Saving profile...
                  </span>
                ) : isEditMode ? (
                  "Save profile"
                ) : (
                  "Complete profile"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};