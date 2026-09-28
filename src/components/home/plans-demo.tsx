"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AUTOPLAY_TOGGLE_MS = 3200;

type Mode = "free" | "premium";

export interface PlansDemoDict {
  title: string;
  description: string;
  free_label: string;
  premium_label: string;
  levels: readonly string[];
  unlimited: string;
  locked: string;
  free_note: string;
  premium_note: string;
  aria_label: string;
}

export function PlansDemo({ dict }: { dict: PlansDemoDict }) {
  const [mode, setMode] = useState<Mode>("free");
  const reducedMotion = usePrefersReducedMotion();
  const interacted = useRef(false);

  useEffect(() => {
    if (reducedMotion || interacted.current) return;

    const id = window.setTimeout(() => {
      if (!interacted.current) {
        setMode((current) => (current === "free" ? "premium" : "free"));
      }
    }, AUTOPLAY_TOGGLE_MS);

    return () => window.clearTimeout(id);
  }, [mode, reducedMotion]);

  const choose = (next: Mode) => {
    interacted.current = true;
    setMode(next);
  };

  const isPremium = mode === "premium";

  return (
    <div
      role="group"
      aria-label={dict.aria_label}
      className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40"
    >
      <div className="border-b border-border p-4">
        <div className="relative grid grid-cols-2 rounded-lg border border-border bg-background/60 p-1 text-sm font-medium">
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-brand"
            animate={{ x: isPremium ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
          {(["free", "premium"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              aria-pressed={mode === option}
              className={cn(
                "relative z-10 rounded-md py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                mode === option
                  ? "text-brand-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "free" ? dict.free_label : dict.premium_label}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-border">
        {dict.levels.map((level, index) => {
          const unlocked = isPremium || index === 0;
          return (
            <li
              key={level}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <span className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border font-mono text-[11px] text-muted-foreground">
                  {index + 1}
                </span>
                {level}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={unlocked ? "open" : "locked"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    unlocked
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {unlocked ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  {unlocked ? dict.unlimited : dict.locked}
                </motion.span>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border bg-background/40 px-5 py-3 text-center text-xs text-muted-foreground">
        {isPremium ? dict.premium_note : dict.free_note}
      </div>
    </div>
  );
}
