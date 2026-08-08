"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_COLORS: Record<string, string> = {
  completed: "var(--primary)",
  timed_out: "#f59e0b",
  abandoned: "#ef4444",
  in_progress: "#64748b",
};

export interface StatusBreakdownChartProps {
  data: Record<string, number>;
  dict: {
    title: string;
    description: string;
    empty: string;
    labels: {
      completed: string;
      timed_out: string;
      abandoned: string;
      in_progress: string;
    };
  };
}

export function StatusBreakdownChart({ data, dict }: StatusBreakdownChartProps) {
  const order: Array<keyof typeof dict.labels> = [
    "completed",
    "timed_out",
    "abandoned",
    "in_progress",
  ];
  const chartData = order
    .map((key) => ({
      key,
      label: dict.labels[key],
      value: data[key] ?? 0,
      color: STATUS_COLORS[key],
    }))
    .filter((d) => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            {dict.empty}
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-45 w-45">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2 text-sm">
              {chartData.map((entry) => (
                <li key={entry.key} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: entry.color }}
                  />
                  <span className="flex-1">{entry.label}</span>
                  <span className="font-medium tabular-nums">
                    {entry.value}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    ({Math.round((entry.value / total) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
