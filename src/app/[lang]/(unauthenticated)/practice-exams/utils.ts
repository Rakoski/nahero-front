import { DifficultyLevels } from "@/constants/difficulty-levels";

export function getDifficultyLabel(
  level: DifficultyLevels,
  dict: {
    beginner: string;
    intermediate: string;
    advanced: string;
    expert: string;
  }
): string {
  const labels: Record<DifficultyLevels, string> = {
    [DifficultyLevels.EASY]: dict.beginner,
    [DifficultyLevels.MEDIUM]: dict.intermediate,
    [DifficultyLevels.HARD]: dict.advanced,
    [DifficultyLevels.EXPERT]: dict.expert,
  };
  return labels[level] || "Unknown";
}

export function formatTimeLimit(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

export function getDifficultyColors(difficulty: DifficultyLevels): string {
  const colors: Record<DifficultyLevels, string> = {
    [DifficultyLevels.EASY]: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    [DifficultyLevels.MEDIUM]: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    [DifficultyLevels.HARD]: "bg-chart-5/20 text-chart-5 border-chart-5/30",
    [DifficultyLevels.EXPERT]: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  };
  return colors[difficulty];
}
