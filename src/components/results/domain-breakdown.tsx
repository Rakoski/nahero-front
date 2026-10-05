import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { DomainScore } from "@/services/student-practice-attempts/get-result";

export type DomainBreakdownDict = {
  title: string;
  weakest: string;
  score: string;
};

interface DomainBreakdownProps {
  domains: DomainScore[];
  weakestDomain: string | null;
  dict: DomainBreakdownDict;
  className?: string;
  footer?: ReactNode;
}

export function DomainBreakdown({
  domains,
  weakestDomain,
  dict,
  className,
  footer,
}: DomainBreakdownProps) {
  if (domains.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {domains.map(({ domain, correct, total }) => {
            const isWeakest = domain === weakestDomain;
            const value = total > 0 ? (correct / total) * 100 : 0;

            return (
              <li
                key={domain}
                className={cn(
                  "space-y-2 rounded-lg p-3",
                  isWeakest && "border border-red-500/40 bg-red-500/5",
                )}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium leading-snug">
                    {domain}
                  </span>
                  <div className="flex items-center gap-2">
                    {isWeakest && (
                      <Badge variant="destructive">{dict.weakest}</Badge>
                    )}
                    <span className="text-sm font-semibold tabular-nums">
                      {dict.score
                        .replace("{{correct}}", String(correct))
                        .replace("{{total}}", String(total))}
                    </span>
                  </div>
                </div>
                <Progress
                  value={value}
                  className={cn(
                    "h-2",
                    isWeakest &&
                      "bg-red-500/20 [&>[data-slot=progress-indicator]]:bg-red-500",
                  )}
                />
              </li>
            );
          })}
        </ul>
        {footer && <div className="mt-6">{footer}</div>}
      </CardContent>
    </Card>
  );
}
