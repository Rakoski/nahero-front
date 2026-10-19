"use client";

import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInstructorPracticeExam } from "@/hooks/useInstructor";
import type { InstructorPracticeExam } from "@/services/instructor/types";

export const WIZARD_STEPS = ["exam", "practiceExam", "domains", "questions", "review"] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];

type WizardParams = {
  examId?: number;
  practiceExamId?: number;
  step?: WizardStep;
};

type PracticeExamWizardContextValue = {
  step: WizardStep;
  examId?: number;
  practiceExamId?: number;
  practiceExam?: InstructorPracticeExam;
  practiceExamQuery: ReturnType<typeof useInstructorPracticeExam>;
  isCompleted: (step: WizardStep) => boolean;
  isUnlocked: (step: WizardStep) => boolean;
  goTo: (step: WizardStep) => void;
  selectExam: (examId: number) => void;
  practiceExamCreated: (practiceExamId: number) => void;
};

const PracticeExamWizardContext = createContext<PracticeExamWizardContextValue | null>(null);

const parseId = (value: string | null) => {
  const id = Number(value);
  return value && Number.isInteger(id) && id > 0 ? id : undefined;
};

const isWizardStep = (value: string | null): value is WizardStep =>
  WIZARD_STEPS.includes(value as WizardStep);

export function PracticeExamWizardProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const practiceExamId = parseId(searchParams.get("practiceExamId"));
  const practiceExamQuery = useInstructorPracticeExam(practiceExamId);
  const practiceExam = practiceExamQuery.data;
  const examId = practiceExam?.exam?.id ?? parseId(searchParams.get("examId"));

  const completed = useMemo<Record<WizardStep, boolean>>(
    () => ({
      exam: examId !== undefined,
      practiceExam: practiceExam !== undefined,
      domains: (practiceExam?.domains.length ?? 0) > 0,
      questions: (practiceExam?.questionCount ?? 0) > 0,
      review: practiceExam?.isActive ?? false,
    }),
    [examId, practiceExam],
  );

  const isCompleted = useCallback((step: WizardStep) => completed[step], [completed]);

  const isUnlocked = useCallback(
    (step: WizardStep) => WIZARD_STEPS.slice(0, WIZARD_STEPS.indexOf(step)).every((previous) => completed[previous]),
    [completed],
  );

  const requested = searchParams.get("step");
  const firstOpen = WIZARD_STEPS.find((step) => !completed[step] && isUnlocked(step)) ?? "review";
  const step = isWizardStep(requested) && isUnlocked(requested) ? requested : firstOpen;

  const navigate = useCallback(
    (params: WizardParams) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined) next.delete(key);
        else next.set(key, String(value));
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const goTo = useCallback((step: WizardStep) => navigate({ step }), [navigate]);

  const selectExam = useCallback(
    (selectedExamId: number) => navigate({ examId: selectedExamId, step: "practiceExam" }),
    [navigate],
  );

  const practiceExamCreated = useCallback(
    (createdId: number) => navigate({ examId: undefined, practiceExamId: createdId, step: "domains" }),
    [navigate],
  );

  const value = useMemo(
    () => ({
      step,
      examId,
      practiceExamId,
      practiceExam,
      practiceExamQuery,
      isCompleted,
      isUnlocked,
      goTo,
      selectExam,
      practiceExamCreated,
    }),
    [step, examId, practiceExamId, practiceExam, practiceExamQuery, isCompleted, isUnlocked, goTo, selectExam, practiceExamCreated],
  );

  return <PracticeExamWizardContext.Provider value={value}>{children}</PracticeExamWizardContext.Provider>;
}

export function usePracticeExamWizard(): PracticeExamWizardContextValue {
  const context = useContext(PracticeExamWizardContext);
  if (!context) throw new Error("usePracticeExamWizard must be used within a PracticeExamWizardProvider");
  return context;
}
