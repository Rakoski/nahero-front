"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { listInstructorExams } from "@/services/instructor/list-exams";
import { createExam, CreateExamRequest, CreateExamResponse } from "@/services/instructor/create-exam";
import { listInstructorPracticeExams } from "@/services/instructor/list-practice-exams";
import {
  createPracticeExam,
  CreatePracticeExamRequest,
  CreatePracticeExamResponse,
} from "@/services/instructor/create-practice-exam";
import { getInstructorPracticeExam } from "@/services/instructor/get-practice-exam";
import { updatePracticeExamStatus, UpdatePracticeExamStatusRequest } from "@/services/instructor/update-status";
import { addPracticeExamDomains, AddDomainsRequest } from "@/services/instructor/add-domains";
import { removePracticeExamDomain, RemoveDomainRequest } from "@/services/instructor/remove-domain";
import { listInstructorQuestions } from "@/services/instructor/list-questions";
import {
  createInstructorQuestions,
  CreateQuestionsRequest,
  CreateQuestionsResponse,
} from "@/services/instructor/create-questions";
import { deleteInstructorQuestion, DeleteQuestionRequest } from "@/services/instructor/delete-question";
import { retryServerErrors } from "@/hooks/useQuestionBank";

function useInvalidatePracticeExam() {
  const queryClient = useQueryClient();

  return (practiceExamId: number) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.PRACTICE_EXAM, practiceExamId] }),
      queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.PRACTICE_EXAMS] }),
    ]);
}

export function useInstructorExams() {
  return useQuery({
    queryKey: [QUERIES.INSTRUCTOR.EXAMS],
    queryFn: listInstructorExams,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
  });
}

export function useInstructorPracticeExams() {
  return useQuery({
    queryKey: [QUERIES.INSTRUCTOR.PRACTICE_EXAMS],
    queryFn: listInstructorPracticeExams,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
  });
}

export function useInstructorPracticeExam(practiceExamId: number | undefined) {
  return useQuery({
    queryKey: [QUERIES.INSTRUCTOR.PRACTICE_EXAM, practiceExamId],
    queryFn: () => getInstructorPracticeExam(practiceExamId as number),
    enabled: practiceExamId !== undefined,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
  });
}

export function useInstructorQuestions(practiceExamId: number, page: number) {
  return useQuery({
    queryKey: [QUERIES.INSTRUCTOR.QUESTIONS, practiceExamId, page],
    queryFn: () => listInstructorQuestions(practiceExamId, page),
    placeholderData: keepPreviousData,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation<CreateExamResponse, Error, CreateExamRequest>({
    mutationFn: createExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.EXAMS] }),
  });
}

export function useCreatePracticeExam() {
  const queryClient = useQueryClient();

  return useMutation<CreatePracticeExamResponse, Error, CreatePracticeExamRequest>({
    mutationFn: createPracticeExam,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.EXAMS] }),
        queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.PRACTICE_EXAMS] }),
      ]),
  });
}

export function useUpdatePracticeExamStatus() {
  const invalidate = useInvalidatePracticeExam();

  return useMutation<void, Error, UpdatePracticeExamStatusRequest>({
    mutationFn: updatePracticeExamStatus,
    onSuccess: (_, { practiceExamId }) => invalidate(practiceExamId),
  });
}

export function useAddPracticeExamDomains() {
  const invalidate = useInvalidatePracticeExam();

  return useMutation<void, Error, AddDomainsRequest>({
    mutationFn: addPracticeExamDomains,
    onSuccess: (_, { practiceExamId }) => invalidate(practiceExamId),
  });
}

export function useRemovePracticeExamDomain() {
  const invalidate = useInvalidatePracticeExam();

  return useMutation<void, Error, RemoveDomainRequest>({
    mutationFn: removePracticeExamDomain,
    onSuccess: (_, { practiceExamId }) => invalidate(practiceExamId),
  });
}

export function useCreateInstructorQuestions() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePracticeExam();

  return useMutation<CreateQuestionsResponse, Error, CreateQuestionsRequest>({
    mutationFn: createInstructorQuestions,
    onSuccess: (_, { practiceExamId }) =>
      Promise.all([
        invalidate(practiceExamId),
        queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.QUESTIONS, practiceExamId] }),
      ]),
  });
}

export function useDeleteInstructorQuestion() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePracticeExam();

  return useMutation<void, Error, DeleteQuestionRequest>({
    mutationFn: deleteInstructorQuestion,
    onSuccess: (_, { practiceExamId }) =>
      Promise.all([
        invalidate(practiceExamId),
        queryClient.invalidateQueries({ queryKey: [QUERIES.INSTRUCTOR.QUESTIONS, practiceExamId] }),
      ]),
  });
}
