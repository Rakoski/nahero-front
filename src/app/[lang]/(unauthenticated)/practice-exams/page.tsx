import { practiceExamsService } from "@/services/practice-exams";
import { PracticeExamsList } from "./practice-exams-list";

export default async function PracticeExamsPage() {
  const initialPage = await practiceExamsService.listFirstPracticeExamsPage();

  return <PracticeExamsList initialPage={initialPage} />;
}
