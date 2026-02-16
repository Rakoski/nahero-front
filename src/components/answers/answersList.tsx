"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { AnswerFilters } from "@/services/answers";
import { CheckCircle2, XCircle, Search } from "lucide-react";
import { ListAnsweredAnswersResponse } from "../../lib/dtos";

interface AnswersListProps {
  answers: ListAnsweredAnswersResponse[];
  filters: AnswerFilters;
  onFiltersChange: (filters: AnswerFilters) => void;
  isLoading: boolean;
  dict: {
    title: string;
    showAll: string;
    showCorrect: string;
    showIncorrect: string;
    searchPlaceholder: string;
    loading: string;
    questionNumber: string;
    correct: string;
    incorrect: string;
    questionAlt: string;
    alternativeAlt: string;
    explanation: string;
  };
}

export function AnswersList({
  answers,
  filters,
  onFiltersChange,
  isLoading,
  dict,
}: AnswersListProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, questionContent: searchValue || undefined });
  };

  const handleFilterCorrect = (value: boolean | undefined) => {
    onFiltersChange({ ...filters, isCorrect: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.isCorrect === undefined ? "default" : "outline"}
              onClick={() => handleFilterCorrect(undefined)}
            >
              {dict.showAll}
            </Button>
            <Button
              variant={filters.isCorrect === true ? "default" : "outline"}
              onClick={() => handleFilterCorrect(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {dict.showCorrect}
            </Button>
            <Button
              variant={filters.isCorrect === false ? "default" : "outline"}
              onClick={() => handleFilterCorrect(false)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {dict.showIncorrect}
            </Button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={dict.searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Answers List */}
      {isLoading && answers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <Card
              key={`${answer.studentAnswerId}-${index}`}
              className={
                answer.isCorrect
                  ? "border-l-4 border-l-green-500"
                  : "border-l-4 border-l-red-500"
              }
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {dict.questionNumber.replace(
                          "{{number}}",
                          String(index + 1),
                        )}
                      </h3>
                      <Badge
                        variant={answer.isCorrect ? "default" : "destructive"}
                      >
                        {answer.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        {answer.isCorrect ? dict.correct : dict.incorrect}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {answer.questionContent}
                    </p>
                    {answer.questionImageUrl && (
                      <img
                        src={answer.questionImageUrl}
                        alt={dict.questionAlt}
                        className="mt-2 rounded-lg max-w-md"
                      />
                    )}
                  </div>

                  {/* Alternatives */}
                  <div className="space-y-2">
                    {answer.alternatives.map((alt) => {
                      const isSelectedByUser =
                        alt.wasSelected ||
                        alt.alternativeId === answer.selectedAlternativeId;
                      const shouldHighlightIncorrect =
                        isSelectedByUser && !alt.isCorrect;

                      return (
                        <div
                          key={alt.alternativeId}
                          className={`p-3 rounded-lg ${
                            alt.isCorrect
                              ? "bg-green-600 dark:bg-green-900/20"
                              : shouldHighlightIncorrect
                                ? "bg-red-600 dark:bg-red-900/20"
                                : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {alt.isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-green-800 dark:text-green-200 flex-shrink-0 mt-0.5" />
                            )}
                            {shouldHighlightIncorrect && (
                              <XCircle className="w-5 h-5 text-red-800 dark:text-red-200 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p>{alt.content}</p>
                              {alt.imageUrl && (
                                <img
                                  src={alt.imageUrl}
                                  alt={dict.alternativeAlt}
                                  className="mt-2 rounded max-w-xs"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {answer.explanation && (
                    <div className="p-4 text- rounded-lg">
                      <h4 className="font-semibold mb-2">{dict.explanation}</h4>
                      <p>{answer.explanation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
