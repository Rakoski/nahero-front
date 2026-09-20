"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTION_NUMBER = 1;
const TOTAL_QUESTIONS = 65;
const PAGER = [1, 2, 3, 4, 5, 6];
const START_SECONDS = 59 * 60 + 58;
const AUTOPLAY_SELECT_MS = 2600;
const AUTOPLAY_RESET_MS = 6200;

export interface QuestionDemoDict {
  timer_label: string;
  question_label: string;
  of: string;
  select_one: string;
  select_answer: string;
  question: string;
  options: readonly { text: string; correct?: boolean }[];
  explanation: string;
  correct_label: string;
  incorrect_label: string;
  aria_label: string;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function QuestionDemo({ dict }: { dict: QuestionDemoDict }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [reducedMotion, setReducedMotion] = useState(true);
  const interacted = useRef(false);

  const correctIndex = dict.options.findIndex((option) => option.correct);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : START_SECONDS));
    }, 1000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || interacted.current) return;

    const select = window.setTimeout(() => {
      if (!interacted.current) setSelected(correctIndex);
    }, AUTOPLAY_SELECT_MS);

    const reset = window.setTimeout(() => {
      if (!interacted.current) setSelected(null);
    }, AUTOPLAY_RESET_MS);

    return () => {
      window.clearTimeout(select);
      window.clearTimeout(reset);
    };
  }, [correctIndex, selected, reducedMotion]);

  const handleSelect = (index: number) => {
    interacted.current = true;
    setSelected((current) => (current === index ? null : index));
  };

  const revealed = selected !== null;
  const isRight = selected === correctIndex;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -inset-y-10 rounded-[2rem] bg-brand/8 blur-3xl"
      />

      <div
        role="group"
        aria-label={dict.aria_label}
        className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-xs">
          <span className="text-muted-foreground">
            {dict.timer_label}{" "}
            <span className="font-mono tabular-nums text-foreground">
              {formatTime(seconds)}
            </span>
          </span>
          <span className="font-mono tabular-nums text-muted-foreground">
            {QUESTION_NUMBER} / {TOTAL_QUESTIONS}
          </span>
        </div>

        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          {PAGER.map((page) => (
            <span
              key={page}
              aria-hidden="true"
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-md border text-[11px] font-medium",
                page === QUESTION_NUMBER
                  ? "border-brand/40 bg-brand/15 text-brand"
                  : "border-border text-muted-foreground",
              )}
            >
              {page}
            </span>
          ))}
          <span aria-hidden="true" className="ml-1 text-xs text-muted-foreground">
            …
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium">
              {dict.question_label} {QUESTION_NUMBER}{" "}
              <span className="font-normal text-muted-foreground">
                {dict.of} {TOTAL_QUESTIONS}
              </span>
            </p>
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              {dict.select_one}
            </span>
          </div>

          <p className="mt-3 text-base leading-relaxed text-pretty">
            {dict.question}
          </p>

          <p className="mt-5 text-xs text-muted-foreground">
            {dict.select_answer}
          </p>

          <div className="mt-2.5 space-y-2">
            {dict.options.map((option, index) => {
              const isSelected = selected === index;
              const showCorrect = revealed && index === correctIndex;
              const showWrong = revealed && isSelected && !option.correct;

              return (
                <button
                  key={option.text}
                  type="button"
                  onClick={() => handleSelect(index)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    showCorrect && "border-emerald-500/50 bg-emerald-500/10",
                    showWrong && "border-red-500/50 bg-red-500/10",
                    !showCorrect &&
                      !showWrong &&
                      "border-border hover:border-brand/40 hover:bg-white/[0.03]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                      showCorrect && "border-emerald-500 bg-emerald-500",
                      showWrong && "border-red-500 bg-red-500",
                      !showCorrect && !showWrong && "border-muted-foreground/50",
                    )}
                  >
                    {showCorrect && <Check className="h-2.5 w-2.5 text-black" />}
                    {showWrong && <X className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span className="flex-1">{option.text}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-lg border border-border bg-background/60 p-3.5">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isRight ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    {isRight ? dict.correct_label : dict.incorrect_label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {dict.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
