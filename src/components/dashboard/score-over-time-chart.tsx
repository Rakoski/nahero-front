"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ScorePoint } from "@/services/student-practice-attempts/get-dashboard-summary";

export interface ScoreOverTimeChartProps {
  data: ScorePoint[];
  passingScoreReference?: number | null;
  dict: {
    title: string;
    description: string;
    score_label: string;
    passing_label: string;
    empty: string;
  };
}

export function ScoreOverTimeChart({
  data,
  passingScoreReference,
  dict,
}: ScoreOverTimeChartProps) {
  const chartData = data.map((p) => ({
    ...p,
    label: format(parseISO(p.endTime), "MMM d"),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            {dict.empty}
          </p>
        ) : (
          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, dict.score_label]}
                />
                {typeof passingScoreReference === "number" ? (
                  <ReferenceLine
                    y={passingScoreReference}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    label={{
                      value: dict.passing_label,
                      position: "insideTopLeft",
                      fontSize: 10,
                      fill: "var(--muted-foreground)",
                    }}
                  />
                ) : null}
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
