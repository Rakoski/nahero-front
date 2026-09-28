"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const BASE_STREAK = 6;
const AVERAGE_SCORE = 72;
const BEST_SCORE = 88;
const PASS_RATE = 67;
const PASSING_SCORE = 70;
const SCORES = [48, 55, 52, 63, 70, 66, 78, 88];
const AUTOPLAY_FILL_MS = 2600;
const AUTOPLAY_RESET_MS = 6200;

export interface DashboardDemoDict {
  tag: string;
  title: string;
  description: string;
  streak_label: string;
  today_done: string;
  keep_going: string;
  tap_hint: string;
  weekdays: readonly string[];
  average_score: string;
  best_score: string;
  pass_rate: string;
  score_over_time: string;
  passing_label: string;
  aria_label: string;
}

const CHART_WIDTH = 240;
const CHART_HEIGHT = 72;

function toPoint(score: number, index: number) {
  const x = (index / (SCORES.length - 1)) * CHART_WIDTH;
  const y = CHART_HEIGHT - (score / 100) * CHART_HEIGHT;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

export function DashboardDemo({ dict }: { dict: DashboardDemoDict }) {
  const [practicedToday, setPracticedToday] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const interacted = useRef(false);

  useEffect(() => {
    if (reducedMotion || interacted.current) return;

    const fill = window.setTimeout(() => {
      if (!interacted.current) setPracticedToday(true);
    }, AUTOPLAY_FILL_MS);

    const reset = window.setTimeout(() => {
      if (!interacted.current) setPracticedToday(false);
    }, AUTOPLAY_RESET_MS);

    return () => {
      window.clearTimeout(fill);
      window.clearTimeout(reset);
    };
  }, [practicedToday, reducedMotion]);

  const toggleToday = () => {
    interacted.current = true;
    setPracticedToday((value) => !value);
  };

  const streak = BASE_STREAK + (practicedToday ? 1 : 0);
  const todayIndex = dict.weekdays.length - 1;
  const passingY = CHART_HEIGHT - (PASSING_SCORE / 100) * CHART_HEIGHT;

  const metrics = [
    { label: dict.average_score, value: AVERAGE_SCORE },
    { label: dict.best_score, value: BEST_SCORE },
    { label: dict.pass_rate, value: PASS_RATE },
  ];

  return (
    <div
      role="group"
      aria-label={dict.aria_label}
      className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40"
    >
      <div className="border-b border-orange-500/20 bg-linear-to-br from-orange-500/15 via-card to-card p-5">
        <div className="flex items-center gap-4">
          <motion.div
            key={streak}
            initial={reducedMotion ? false : { scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
          >
            <Flame className="h-14 w-14 fill-orange-500 text-orange-400" />
          </motion.div>
          <div>
            <p className="text-5xl font-extrabold leading-none text-orange-400 tabular-nums">
              {streak}
            </p>
            <p className="mt-1 text-sm font-semibold">{dict.streak_label}</p>
            <p className="text-xs text-muted-foreground">
              {practicedToday ? dict.today_done : dict.keep_going}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-between gap-1.5">
          {dict.weekdays.map((weekday, index) => {
            const isToday = index === todayIndex;
            const active = isToday ? practicedToday : true;
            const circle = (
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  active ? "bg-orange-500" : "bg-muted",
                  isToday &&
                    "ring-2 ring-orange-400 ring-offset-2 ring-offset-card",
                )}
              >
                {active && <Flame className="h-4 w-4 fill-white text-white" />}
              </span>
            );

            return (
              <div
                key={`${weekday}-${index}`}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "text-[11px] text-muted-foreground",
                    isToday && "font-bold text-foreground",
                  )}
                >
                  {weekday}
                </span>
                {isToday ? (
                  <button
                    type="button"
                    onClick={toggleToday}
                    aria-pressed={practicedToday}
                    aria-label={dict.tap_hint}
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {circle}
                  </button>
                ) : (
                  circle
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          {dict.tap_hint}
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-semibold tabular-nums">
                  {metric.value}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  initial={{ width: reducedMotion ? `${metric.value}%` : 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            {dict.score_over_time}
          </p>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="mt-2 h-20 w-full overflow-visible"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="0"
              x2={CHART_WIDTH}
              y1={passingY}
              y2={passingY}
              className="stroke-muted-foreground/40"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
            <motion.polyline
              points={SCORES.map(toPoint).join(" ")}
              fill="none"
              className="stroke-brand"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <p className="mt-1 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-4 border-t border-dashed border-muted-foreground/60" />
            {dict.passing_label} {PASSING_SCORE}%
          </p>
        </div>
      </div>
    </div>
  );
}
