import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { createProfile } from "../api/profileApi";
import type { CreateUserProfileRequest } from "../../../types/profile";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { ResumeUploadBox } from "../../resume/components/ResumeUploadBox";

type ProfileSetupPageProps = {
  onProfileCreated: () => void;
};

/**
 * Create initial profile form state.
 */
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

/**
 * Extract simple profile hints from resume text.
 */
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

export const ProfileSetupPage = ({
  onProfileCreated,
}: ProfileSetupPageProps) => {
  const { user, userId } = useAuth();

  const safeUserId = userId ?? 0;

  const [formData, setFormData] = useState<CreateUserProfileRequest>(() =>
    createInitialFormData(safeUserId, user?.name ?? "")
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Update profile field.
   */
  const handleChange = <K extends keyof CreateUserProfileRequest>(
    field: K,
    value: CreateUserProfileRequest[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle extracted resume text and auto-fill fields.
   */
  const handleResumeTextExtracted = (resumeText: string) => {
    const parsed = parseResumeText(resumeText);

    setFormData((prev) => ({
      ...prev,
      resumeText,
      skills: prev.skills || parsed.skills,
      targetRole: prev.targetRole || parsed.targetRole,
    }));
  };

  /**
   * Create user profile.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!safeUserId) {
      setError("User is not authenticated.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await createProfile({
        ...formData,
        userId: safeUserId,
      });

      onProfileCreated();
    } catch (error) {
      console.error("Profile setup failed", error);
      setError("Failed to complete profile setup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl">
        <ResumeUploadBox onTextExtracted={handleResumeTextExtracted} />

        <Card className="p-6">
          <h1 className="text-3xl font-bold">Complete your profile</h1>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Review the extracted resume information and complete any missing
            fields.
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
              >
                <option value="">Preferred work mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </Select>
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
              placeholder="Languages"
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  Saving profile...
                </span>
              ) : (
                "Complete profile"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};