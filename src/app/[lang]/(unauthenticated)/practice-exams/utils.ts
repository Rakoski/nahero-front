/**
 * Utility functions for practice exams
 */

/**
 * Get the difficulty label based on the difficulty level number
 * @param level - Difficulty level (1-4)
 * @param dict - Dictionary object for translations
 * @returns Localized difficulty label
 */
export function getDifficultyLabel(
  level: number,
  dict: {
    foundation: string;
    associate: string;
    professional: string;
    specialty: string;
  }
): string {
  const labels: Record<number, string> = {
    1: dict.foundation,
    2: dict.associate,
    3: dict.professional,
    4: dict.specialty,
  };
  return labels[level] || "Unknown";
}

/**
 * Format time limit from minutes to a readable string
 * @param minutes - Time in minutes
 * @returns Formatted time string (e.g., "2h", "1h 30m", "45m")
 */
export function formatTimeLimit(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

/**
 * Get Tailwind CSS classes for difficulty badges
 * @param difficulty - Difficulty level (Beginner, Intermediate, Advanced)
 * @returns Tailwind CSS classes for the badge
 */
export function getDifficultyColors(
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): string {
  const colors = {
    Beginner: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    Intermediate: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Advanced: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  };
  return colors[difficulty];
}
