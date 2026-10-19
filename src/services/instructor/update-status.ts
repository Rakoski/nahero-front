import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface UpdatePracticeExamStatusRequest {
  practiceExamId: number;
  active: boolean;
}

export async function updatePracticeExamStatus({ practiceExamId, active }: UpdatePracticeExamStatusRequest): Promise<void> {
  try {
    await api.patch(NAHERO_API.INSTRUCTOR.PRACTICE_EXAM_STATUS(practiceExamId), { active });
  } catch (error) {
    handleError(error);
    throw error;
  }
}
