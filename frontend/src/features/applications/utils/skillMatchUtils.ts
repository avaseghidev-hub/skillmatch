// Converts comma-separated skills into a clean array
export const splitSkills = (skills?: string): string[] =>
  skills
    ? skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

// Returns a readable label based on match score
export const getScoreLabel = (score: number): string => {
  if (score >= 80) return "Strong Match";
  if (score >= 50) return "Medium Match";
  return "Low Match";
};

// Returns progress bar color based on match score
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

// Returns score text color based on match score
export const getScoreTextColorClass = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};