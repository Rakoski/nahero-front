"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { api } from "@/lib/api-manager";

export const ExamSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  slug: z.string(),
  image_url: z.string().nullable().optional(),
  question_count: z.number(),
  time_limit: z.number(),
  passing_score: z.number(),
  difficulty_level: z.number().optional(),
  exam: z
    .object({
      title: z.string(),
      platform: z.string().optional(),
    })
    .optional(),
});

export const ExamsResponseSchema = z.array(ExamSchema);

export type Exam = z.infer<typeof ExamSchema>;

export const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    title: "AWS Certified Cloud Practitioner",
    description:
      "Validate your overall understanding of the AWS Cloud. This exam covers cloud concepts, security, technology, and billing & pricing.",
    difficulty: "Beginner",
    slug: "aws-cloud-practitioner",
    image_url:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
    question_count: 65,
    time_limit: 90,
    passing_score: 70,
    difficulty_level: 1,
    exam: {
      title: "AWS Cloud Practitioner Certification",
      platform: "AWS",
    },
  },
  {
    id: 2,
    title: "AWS Solutions Architect Associate",
    description:
      "Demonstrate your ability to design distributed systems on AWS. Covers compute, storage, database, networking, and security services.",
    difficulty: "Intermediate",
    slug: "aws-solutions-architect-associate",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    question_count: 65,
    time_limit: 130,
    passing_score: 72,
    difficulty_level: 2,
    exam: {
      title: "AWS Solutions Architect Associate",
      platform: "AWS",
    },
  },
  {
    id: 3,
    title: "Azure Fundamentals (AZ-900)",
    description:
      "Demonstrate foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
    difficulty: "Beginner",
    slug: "azure-fundamentals-az900",
    image_url:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop",
    question_count: 40,
    time_limit: 60,
    passing_score: 70,
    difficulty_level: 1,
    exam: {
      title: "Microsoft Azure Fundamentals",
      platform: "Azure",
    },
  },
  {
    id: 4,
    title: "Google Cloud Associate Engineer",
    description:
      "Deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.",
    difficulty: "Intermediate",
    slug: "gcp-associate-engineer",
    image_url:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop",
    question_count: 50,
    time_limit: 120,
    passing_score: 70,
    difficulty_level: 2,
    exam: {
      title: "Google Cloud Associate Cloud Engineer",
      platform: "Google",
    },
  },
  {
    id: 5,
    title: "AWS Developer Associate",
    description:
      "Showcase your ability to develop and maintain AWS-based applications. Covers deployment, security, and debugging.",
    difficulty: "Intermediate",
    slug: "aws-developer-associate",
    image_url:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
    question_count: 65,
    time_limit: 130,
    passing_score: 72,
    difficulty_level: 2,
    exam: {
      title: "AWS Certified Developer Associate",
      platform: "AWS",
    },
  },
  {
    id: 6,
    title: "AWS DevOps Engineer Professional",
    description:
      "Demonstrate technical expertise in provisioning, operating, and managing distributed systems on AWS.",
    difficulty: "Advanced",
    slug: "aws-devops-professional",
    image_url:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop",
    question_count: 75,
    time_limit: 180,
    passing_score: 75,
    difficulty_level: 3,
    exam: {
      title: "AWS Certified DevOps Engineer Professional",
      platform: "AWS",
    },
  },
];

export interface ExamFilters {
  search?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  platform?: string;
}

interface UseExamsReturn {
  data: Exam[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage practice exams with filtering
 * @param filters - Object containing search, difficulty, and platform filters
 * @returns Object with data, loading state, error state, and refetch function
 */
export function useExams(filters: ExamFilters = {}): UseExamsReturn {
  const [data, setData] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const fetchExams = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 500));

        let filteredData = [...MOCK_EXAMS];

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(
            (exam) =>
              exam.title.toLowerCase().includes(searchLower) ||
              exam.description?.toLowerCase().includes(searchLower) ||
              exam.exam?.title.toLowerCase().includes(searchLower)
          );
        }

        if (filters.difficulty) {
          filteredData = filteredData.filter(
            (exam) => exam.difficulty === filters.difficulty
          );
        }

        if (filters.platform) {
          filteredData = filteredData.filter(
            (exam) =>
              exam.exam?.platform?.toLowerCase() ===
              filters.platform?.toLowerCase()
          );
        }

        if (isMounted) {
          setData(filteredData);
          setIsLoading(false);
        }

        /* Uncomment this block when backend is ready:
        
        const params = new URLSearchParams();
        if (filters.search) {
          params.append("search", filters.search);
        }
        if (filters.difficulty) {
          params.append("difficulty", filters.difficulty);
        }
        if (filters.platform) {
          params.append("platform", filters.platform);
        }

        const queryString = params.toString();
        const endpoint = `/practice-exams${
          queryString ? `?${queryString}` : ""
        }`;

        const response = await api.get(endpoint, {
          signal: abortController.signal,
        });

        
        const validatedData = ExamsResponseSchema.parse(response.data);

        if (isMounted) {
          setData(validatedData);
          setIsLoading(false);
        }
        */
      } catch (err) {
        if (isMounted && err !== "canceled") {
          if (err instanceof z.ZodError) {
            setError(
              new Error(
                `Data validation failed: ${err.errors
                  .map((e) => e.message)
                  .join(", ")}`
              )
            );
          } else if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error("An unknown error occurred"));
          }
          setIsLoading(false);
        }
      }
    };

    fetchExams();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [filters.search, filters.difficulty, filters.platform, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
