import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { CreateUserProfileRequest, UserProfile } from "../../../types/profile";
import { calculateProfileCompletion } from "../utils/profileCompletionUtils";

interface ProfileCompletionCardProps {
  profile: UserProfile | CreateUserProfileRequest | null;
}

export const ProfileCompletionCard = ({
  profile,
}: ProfileCompletionCardProps) => {
  const { percentage, missingItems } = calculateProfileCompletion(profile);

  return (
    <Card className="mb-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Profile Completion</h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {percentage === 100
                ? "Your profile is complete and ready for AI-powered job matching."
                : "Complete your profile to improve resume and job matching accuracy."}
          </p>
        </div>

        <Badge>{percentage}%</Badge>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
            className={`h-full rounded-full transition-all duration-300 ${
                percentage === 100
                ? "bg-[var(--success)]"
                : "bg-[var(--primary)]"
            }`}
            style={{ width: `${percentage}%` }}
        />
      </div>

      {missingItems.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">Missing information:</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {missingItems.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};