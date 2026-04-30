import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function KpiCard({ icon: Icon, label, value, hint, className }: KpiCardProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="flex items-start gap-3 px-4">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold leading-tight">{value}</span>
          {hint ? (
            <span className="text-xs text-muted-foreground mt-1">{hint}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
