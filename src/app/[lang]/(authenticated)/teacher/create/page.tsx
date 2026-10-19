"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PracticeExamWizardProvider } from "@/components/instructor/wizard/practice-exam-wizard-provider";
import { PracticeExamWizard } from "@/components/instructor/wizard/practice-exam-wizard";

export default function CreatePracticeExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PracticeExamWizardProvider>
        <PracticeExamWizard />
      </PracticeExamWizardProvider>
    </Suspense>
  );
}
