import { Award, CheckCircle2, TrendingUp, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PerformanceCardProps {
  averageScore: number | null;
  bestScore: number | null;
  passRate: number | null;
  dict: {
    title: string;
    description: string;
    average_score: string;
    best_score: string;
    pass_rate: string;
    no_data: string;
  };
  className?: string;
}

interface MetricProps {
  icon: LucideIcon;
  label: string;
  percent: number | null;
  noData: string;
}

function Metric({ icon: Icon, label, percent, noData }: MetricProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4 text-yellow-500" />
          {label}
        </span>
        <span className="text-2xl font-bold">
          {percent == null ? noData : `${percent}%`}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-yellow-500 transition-all"
          style={{ width: `${percent ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export function PerformanceCard({
  averageScore,
  bestScore,
  passRate,
  dict,
  className,
}: PerformanceCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-5">
        <Metric
          icon={TrendingUp}
          label={dict.average_score}
          percent={averageScore == null ? null : Math.round(averageScore)}
          noData={dict.no_data}
        />
        <Metric
          icon={Award}
          label={dict.best_score}
          percent={bestScore}
          noData={dict.no_data}
        />
        <Metric
          icon={CheckCircle2}
          label={dict.pass_rate}
          percent={passRate == null ? null : Math.round(passRate * 100)}
          noData={dict.no_data}
        />
      </CardContent>
    </Card>
  );
}
