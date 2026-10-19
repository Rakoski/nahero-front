"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowRight, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InlineError } from "@/components/shared";
import { useLocale } from "@/providers/locale-provider";
import { useAddPracticeExamDomains, useRemovePracticeExamDomain } from "@/hooks/useInstructor";
import type { Dictionary } from "@/dictionaries";
import type { InstructorDomain } from "@/services/instructor/types";
import { usePracticeExamWizard } from "./practice-exam-wizard-provider";

type DomainsDict = Dictionary["instructor"]["wizard"]["domains"];

const MAX_ROWS = 30;

const isWeight = (value: string) => value === "" || (/^\d+(\.\d+)?$/.test(value) && Number(value) <= 100);

const createSchema = (dict: DomainsDict) =>
  z
    .object({
      domains: z
        .array(
          z
            .object({
              name: z.string().trim().min(1, dict.nameRequired).max(160, dict.tooLong),
              minWeight: z.string().trim().refine(isWeight, dict.weightInvalid),
              maxWeight: z.string().trim().refine(isWeight, dict.weightInvalid),
            })
            .refine(
              (row) => row.minWeight === "" || row.maxWeight === "" || Number(row.minWeight) <= Number(row.maxWeight),
              { message: dict.weightRange, path: ["maxWeight"] },
            ),
        )
        .min(1)
        .max(MAX_ROWS),
    })
    .superRefine(({ domains }, context) => {
      const seen = new Set<string>();
      domains.forEach((row, index) => {
        const key = row.name.trim().toLowerCase();
        if (!key) return;
        if (seen.has(key)) {
          context.addIssue({ code: "custom", message: dict.duplicate, path: ["domains", index, "name"] });
        }
        seen.add(key);
      });
    });

type DomainsFormData = z.infer<ReturnType<typeof createSchema>>;

const emptyRow = () => ({ name: "", minWeight: "", maxWeight: "" });

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

function CurrentDomains({ practiceExamId, domains }: { practiceExamId: number; domains: InstructorDomain[] }) {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.domains;
  const removeDomain = useRemovePracticeExamDomain();

  if (domains.length === 0) {
    return <p className="rounded-lg border p-4 text-sm text-muted-foreground">{dict.empty}</p>;
  }

  return (
    <div className="space-y-2">
      <ul className="divide-y rounded-lg border">
        {domains.map((domain) => {
          const removing = removeDomain.isPending && removeDomain.variables?.domainId === domain.id;
          const inUse = domain.questionCount > 0;

          return (
            <li key={domain.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="font-medium break-words">{domain.name}</p>
                <p className="text-xs text-muted-foreground">
                  {domain.minWeight != null &&
                    `${dict.weights
                      .replace("{{min}}", String(domain.minWeight))
                      .replace("{{max}}", String(domain.maxWeight ?? domain.minWeight))} · `}
                  {dict.questionCount.replace("{{count}}", String(domain.questionCount))}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={dict.remove}
                title={inUse ? dict.inUse : dict.remove}
                disabled={inUse || removeDomain.isPending}
                onClick={() =>
                  removeDomain.mutate(
                    { practiceExamId, domainId: domain.id },
                    { onSuccess: () => toast.success(dict.removed) },
                  )
                }
              >
                {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </li>
          );
        })}
      </ul>
      <InlineError error={removeDomain.error} />
    </div>
  );
}

export function DomainsStep() {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.domains;
  const { practiceExam, goTo } = usePracticeExamWizard();
  const domains = practiceExam?.domains ?? [];
  const { mutate, isPending, error } = useAddPracticeExamDomains();
  const form = useForm<DomainsFormData>({
    resolver: zodResolver(createSchema(dict)),
    defaultValues: { domains: [emptyRow()] },
  });
  const rows = useFieldArray({ control: form.control, name: "domains" });

  if (!practiceExam) return null;

  const submit = (values: DomainsFormData) =>
    mutate(
      {
        practiceExamId: practiceExam.id,
        domains: values.domains.map((row) => ({
          name: row.name,
          minWeight: toNumber(row.minWeight),
          maxWeight: toNumber(row.maxWeight),
        })),
      },
      {
        onSuccess: () => {
          toast.success(dict.saved);
          form.reset({ domains: [emptyRow()] });
        },
      },
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-medium">{dict.current}</h3>
          <CurrentDomains practiceExamId={practiceExam.id} domains={domains} />
        </section>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            {rows.fields.map((row, index) => (
              <div key={row.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_6rem_6rem_auto] sm:items-start">
                <FormField
                  control={form.control}
                  name={`domains.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.name}</FormLabel>
                      <FormControl>
                        <Input placeholder={dict.namePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`domains.${index}.minWeight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.minWeight}</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`domains.${index}.maxWeight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.maxWeight}</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={rows.fields.length === 1}
                  onClick={() => rows.remove(index)}
                  className="justify-self-end sm:mt-6"
                >
                  <X className="h-4 w-4 sm:mr-0" />
                  <span className="sm:sr-only">{dict.removeRow}</span>
                </Button>
              </div>
            ))}

            <p className="text-sm text-muted-foreground">{dict.weightHint}</p>

            <InlineError error={error} />

            <div className="flex flex-wrap justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={rows.fields.length >= MAX_ROWS}
                onClick={() => rows.append(emptyRow())}
              >
                <Plus className="mr-2 h-4 w-4" />
                {dict.addRow}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dict.submit}
              </Button>
            </div>
          </form>
        </Form>

        <div className="flex justify-end border-t pt-4">
          <Button disabled={domains.length === 0} onClick={() => goTo("questions")}>
            {dictionary.instructor.wizard.continue}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
