"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, BookOpen, Clock, Target, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import {
  useExams,
  type Exam,
  type ExamFilters,
} from "@/services/exams/use-exams";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-6 w-20 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  );
}

function getDifficultyLabel(level: number): string {
  const labels: Record<number, string> = {
    1: "Foundation",
    2: "Associate",
    3: "Professional",
    4: "Specialty",
  };
  return labels[level] || "Unknown";
}

function formatTimeLimit(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

interface ExamCardProps {
  exam: Exam;
  onStartExam: (examId: number) => void;
  isLoading: boolean;
}

function ExamCard({ exam, onStartExam, isLoading }: ExamCardProps) {
  const difficultyColors = {
    Beginner: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    Intermediate: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Advanced: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{exam.title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {exam.exam?.title || "Practice Exam"}
            </CardDescription>
          </div>
          <Badge
            className={cn("ml-2 shrink-0", difficultyColors[exam.difficulty])}
          >
            {exam.difficulty_level
              ? getDifficultyLabel(exam.difficulty_level)
              : exam.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {exam.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Time Limit:</span>
            </div>
            <span className="font-medium text-foreground">
              {formatTimeLimit(exam.time_limit)}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Minimum Score:</span>
            </div>
            <span className="font-medium text-foreground">
              {exam.passing_score}%
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Questions:</span>
            </div>
            <span className="font-medium text-foreground">
              {exam.question_count}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end mt-auto border-t pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Start Exam</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Practice Exam</DialogTitle>
              <DialogDescription>
                Check the practice exam information before starting.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">{exam.title}</h4>
                {exam.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {exam.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Difficulty Level
                  </p>
                  <p className="font-medium">
                    {exam.difficulty_level
                      ? getDifficultyLabel(exam.difficulty_level)
                      : exam.difficulty}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="font-medium">
                    {formatTimeLimit(exam.time_limit)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{exam.question_count}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Passing Score</p>
                  <p className="font-medium">{exam.passing_score}%</p>
                </div>
              </div>

              {exam.exam?.platform && (
                <div>
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p className="font-medium">{exam.exam.platform}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => onStartExam(exam.id)} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default function PracticeExamsPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ExamFilters>({});
  const [isStartingExam, setIsStartingExam] = useState(false);

  const { data: exams, isLoading, error } = useExams(filters);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDifficultyChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulty:
        value === "all"
          ? undefined
          : (value as "Beginner" | "Intermediate" | "Advanced"),
    }));
  };

  const handlePlatformChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      platform: value === "all" ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({});
  };

  const handleStartExam = async (examId: number) => {
    try {
      setIsStartingExam(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(`${Routes.PracticeExams}/${examId}/attempt`);
    } catch (error) {
      console.error("Failed to start exam:", error);
    } finally {
      setIsStartingExam(false);
    }
  };

  const hasActiveFilters =
    filters.search || filters.difficulty || filters.platform;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <FadeIn>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Practice Exams</h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge and prepare for certification exams with our
            comprehensive practice tests.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search certifications..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.difficulty || "all"}
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger className="w-full md:w-45">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.platform || "all"}
              onValueChange={handlePlatformChange}
            >
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
                <SelectItem value="Azure">Azure</SelectItem>
                <SelectItem value="Google">Google Cloud</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>

            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full md:w-auto"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      {error && (
        <FadeIn delay={0.2}>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-destructive font-medium">
              Failed to load practice exams
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          </div>
        </FadeIn>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Exams Grid */}
      {!isLoading && !error && exams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <FadeIn key={exam.id} delay={0.05 * index}>
              <ExamCard
                exam={exam}
                onStartExam={handleStartExam}
                isLoading={isStartingExam}
              />
            </FadeIn>
          ))}
        </div>
      )}

      {!isLoading && !error && exams.length === 0 && (
        <FadeIn delay={0.2}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No exams found</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms to find more practice exams."
                : "There are currently no practice exams available."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
