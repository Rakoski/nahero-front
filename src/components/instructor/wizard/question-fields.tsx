"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Dictionary } from "@/dictionaries";
import type { InstructorDomain, InstructorQuestionType } from "@/services/instructor/types";
import { MAX_ALTERNATIVES, MIN_ALTERNATIVES, QUESTION_TYPES, type QuestionsFormData } from "./question-schema";

type QuestionsDict = Dictionary["instructor"]["wizard"]["questions"];

interface QuestionFieldsProps {
  index: number;
  domains: InstructorDomain[];
  dict: QuestionsDict;
  canRemove: boolean;
  onRemove: () => void;
}

const letter = (position: number) => String.fromCharCode(65 + position);

export function QuestionFields({ index, domains, dict, canRemove, onRemove }: QuestionFieldsProps) {
  const form = useFormContext<QuestionsFormData>();
  const alternatives = useFieldArray({ control: form.control, name: `questions.${index}.alternatives` });
  const type = useWatch({ control: form.control, name: `questions.${index}.type` });
  const alternativesError = form.formState.errors.questions?.[index]?.alternatives;
  const alternativesMessage = alternativesError?.root?.message ?? alternativesError?.message;
  const singleAnswer = type !== "MULTIPLE_CHOICE";
  const fixedAlternatives = type === "TRUE_FALSE";

  const changeType = (next: InstructorQuestionType) => {
    form.setValue(`questions.${index}.type`, next);
    if (next === "TRUE_FALSE") {
      alternatives.replace([
        { content: dict.trueLabel, isCorrect: false },
        { content: dict.falseLabel, isCorrect: false },
      ]);
    } else if (next !== "MULTIPLE_CHOICE") {
      const current = form.getValues(`questions.${index}.alternatives`);
      if (current.filter((alternative) => alternative.isCorrect).length > 1) {
        current.forEach((_, position) => form.setValue(`questions.${index}.alternatives.${position}.isCorrect`, false));
      }
    }
  };

  const markCorrect = (position: number, checked: boolean) => {
    if (singleAnswer) {
      alternatives.fields.forEach((_, other) =>
        form.setValue(`questions.${index}.alternatives.${other}.isCorrect`, other === position && checked),
      );
    } else {
      form.setValue(`questions.${index}.alternatives.${position}.isCorrect`, checked);
    }
    if (form.formState.isSubmitted) void form.trigger(`questions.${index}.alternatives`);
  };

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{dict.question.replace("{{number}}", String(index + 1))}</h3>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="mr-1 h-4 w-4" />
            {dict.removeQuestion}
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.type}</FormLabel>
              <Select value={field.value} onValueChange={(value) => changeType(value as InstructorQuestionType)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {QUESTION_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {dict.types[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`questions.${index}.domainId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.domain}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={dict.domainPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={String(domain.id)}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`questions.${index}.content`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dict.content}</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder={dict.contentPlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">{dict.alternatives}</p>
          <p className="text-xs text-muted-foreground">{dict.alternativesHint}</p>
        </div>
        {alternatives.fields.map((alternative, position) => (
          <div key={alternative.id} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`questions.${index}.alternatives.${position}.isCorrect`}
              render={({ field }) => (
                <label className="mt-2 flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type={singleAnswer ? "radio" : "checkbox"}
                    name={`question-${index}-correct`}
                    checked={field.value}
                    onChange={(event) => markCorrect(position, event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="sr-only sm:not-sr-only">{dict.correct}</span>
                </label>
              )}
            />
            <FormField
              control={form.control}
              name={`questions.${index}.alternatives.${position}.content`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={dict.alternativePlaceholder.replace("{{letter}}", letter(position))}
                      aria-label={dict.alternativePlaceholder.replace("{{letter}}", letter(position))}
                      readOnly={fixedAlternatives}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!fixedAlternatives && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={dict.removeAlternative}
                disabled={alternatives.fields.length <= MIN_ALTERNATIVES}
                onClick={() => alternatives.remove(position)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {alternativesMessage && <p className="text-sm text-destructive">{alternativesMessage}</p>}
        {!fixedAlternatives && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={alternatives.fields.length >= MAX_ALTERNATIVES}
            onClick={() => alternatives.append({ content: "", isCorrect: false })}
          >
            <Plus className="mr-1 h-4 w-4" />
            {dict.addAlternative}
          </Button>
        )}
      </div>

      <FormField
        control={form.control}
        name={`questions.${index}.explanation`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dict.explanation}</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder={dict.explanationPlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}
