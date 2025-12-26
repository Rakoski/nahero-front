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

export function formatTimeLimit(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

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
