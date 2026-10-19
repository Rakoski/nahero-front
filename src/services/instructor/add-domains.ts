import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface DomainInput {
  name: string;
  minWeight?: number;
  maxWeight?: number;
}

export interface AddDomainsRequest {
  practiceExamId: number;
  domains: DomainInput[];
}

export async function addPracticeExamDomains({ practiceExamId, domains }: AddDomainsRequest): Promise<void> {
  try {
    await api.post(NAHERO_API.INSTRUCTOR.DOMAINS(practiceExamId), { domains });
  } catch (error) {
    handleError(error);
    throw error;
  }
}
