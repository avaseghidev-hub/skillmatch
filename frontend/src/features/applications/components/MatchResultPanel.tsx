import type { SkillMatchResult } from "../../../types/application";
import { Badge } from "../../../components/ui/Badge";
import {
  getScoreColorClass,
  getScoreLabel,
  getScoreTextColorClass,
  splitSkills,
} from "../utils/skillMatchUtils";

interface MatchResultPanelProps {
  analysis: SkillMatchResult;
}

export const MatchResultPanel = ({ analysis }: MatchResultPanelProps) => {
  const matchedSkills = splitSkills(analysis.matchedSkills);
  const missingSkills = splitSkills(analysis.missingSkills);

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
      
      {/* Score header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Skill Match Analysis</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {getScoreLabel(analysis.matchScore)}
          </p>
        </div>

        <p className={`text-lg font-bold ${getScoreTextColorClass(analysis.matchScore)}`}>
          {analysis.matchScore}%
        </p>
      </div>

      {/* Score progress */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreColorClass(
            analysis.matchScore
          )}`}
          style={{ width: `${analysis.matchScore}%` }}
        />
      </div>

      <div className="my-4 border-t border-[var(--border)]" />

      {/* Matched skills */}
      <div>
        <p className="font-medium">Matched Skills</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill) => (
              <Badge key={skill} variant="success">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-xs opacity-60">No matched skills</p>
          )}
        </div>
      </div>

      {/* Missing skills */}
      {missingSkills.length > 0 && (
        <div className="mt-4 rounded-xl border border-[var(--danger-border)]/40 bg-[var(--danger-soft)] p-3">
          
          <p className="font-medium text-[var(--danger-text)]">
            Missing Skills
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <Badge key={skill} variant="danger">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      {analysis.recommendation && (
        <div className="mt-4 rounded-lg bg-[var(--background)] p-3">
          <p className="text-xs font-medium opacity-70">Recommendation</p>
          <p className="mt-1 leading-6 opacity-80">
            {analysis.recommendation}
          </p>
        </div>
      )}
    </div>
  );
};