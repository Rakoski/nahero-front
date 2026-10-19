import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface RemoveDomainRequest {
  practiceExamId: number;
  domainId: number;
}

export async function removePracticeExamDomain({ practiceExamId, domainId }: RemoveDomainRequest): Promise<void> {
  try {
    await api.delete(NAHERO_API.INSTRUCTOR.DOMAIN(practiceExamId, domainId));
  } catch (error) {
    handleError(error);
    throw error;
  }
}
