import { NAHERO_API } from "../../constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import {
  PageResponse,
  ListQuestionsByStudentResponse,
  PracticeExamsPageableResponse,
} from "@/lib/dtos";

export interface ListQuestionsRequest {
  attemptId: string | number;
  size?: number;
  page?: number;
}

/**
 * List questions by student for a specific attempt
 * @param request - Contains attemptId (path param), size and page (query params)
 * @returns Paginated response with questions
 */
export async function listQuestionsByStudent(
  request: ListQuestionsRequest
): Promise<PageResponse<ListQuestionsByStudentResponse>> {
  try {
    const path = `${NAHERO_API.QUESTITONS.LIST_STUDENT}/${request.attemptId}`;

    const queryParams = new URLSearchParams();

    if (request.page !== undefined) {
      queryParams.append("page", request.page.toString());
    }
    if (request.size !== undefined) {
      queryParams.append("size", request.size.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${path}?${queryString}` : path;

    const response = await api.get<
      PageResponse<ListQuestionsByStudentResponse>
    >(url);

    return response.data;
  } catch (error) {
    handleError(error);

    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: request.size || 10,
      number: 0,
      first: true,
      last: true,
      empty: true,
    };
  }
}
