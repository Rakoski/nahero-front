import { CheckCheck, ListChecks, Timer, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EffortCardProps {
  totalAttempts: number;
  completedAttempts: number;
  totalStudyMinutes: number;
  dict: {
    title: string;
    description: string;
    total_attempts: string;
    completed_attempts: string;
    time_studied: string;
  };
  className?: string;
}

function formatHours(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

interface StatProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
      <div className="rounded-md bg-yellow-500/10 p-2 text-yellow-500">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold leading-tight">{value}</span>
      </div>
    </div>
  );
}

export function EffortCard({
  totalAttempts,
  completedAttempts,
  totalStudyMinutes,
  dict,
  className,
}: EffortCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-3">
        <Stat
          icon={Timer}
          label={dict.time_studied}
          value={formatHours(totalStudyMinutes)}
        />
        <Stat
          icon={CheckCheck}
          label={dict.completed_attempts}
          value={completedAttempts.toString()}
        />
        <Stat
          icon={ListChecks}
          label={dict.total_attempts}
          value={totalAttempts.toString()}
        />
      </CardContent>
    </Card>
  );
}
