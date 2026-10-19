"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InlineError } from "@/components/shared";
import { useLocale } from "@/providers/locale-provider";
import { useCreateQuestionList } from "@/hooks/useQuestionLists";
import type { CreateQuestionListResponse } from "@/services/question-lists/create";
import type { QuestionBankFilter } from "@/services/question-bank/list";
import type { Dictionary } from "@/dictionaries";

const MAX_LIST_SIZE = 200;

type CreateListDict = Dictionary["questionBank"]["createDialog"];

const createSchema = (dict: CreateListDict) =>
  z.object({
    name: z.string().trim().min(1, dict.nameRequired).max(120, dict.nameTooLong),
    count: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" ||
          (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= MAX_LIST_SIZE),
        dict.countInvalid,
      ),
  });

type CreateListFormData = z.infer<ReturnType<typeof createSchema>>;

export type CreateListSource =
  | { kind: "selection"; questionIds: number[] }
  | { kind: "filters"; filter: QuestionBankFilter };

interface CreateListDialogProps {
  source: CreateListSource | null;
  onClose: () => void;
  onCreated?: (created: CreateQuestionListResponse) => void;
}

export function CreateListDialog({ source, onClose, onCreated }: CreateListDialogProps) {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.questionBank.createDialog;
  const { mutate, isPending, error, reset: resetMutation } = useCreateQuestionList();
  const form = useForm<CreateListFormData>({
    resolver: zodResolver(createSchema(dict)),
    defaultValues: { name: "", count: "" },
  });

  useEffect(() => {
    if (source) {
      form.reset({ name: "", count: "" });
      resetMutation();
    }
  }, [source, form, resetMutation]);

  const submit = (values: CreateListFormData) => {
    if (!source) return;

    mutate(
      source.kind === "selection"
        ? { name: values.name, questionIds: source.questionIds }
        : {
            name: values.name,
            filter: { ...source.filter, limit: values.count ? Number(values.count) : undefined },
          },
      {
        onSuccess: (created) => {
          onCreated?.(created);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={source !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>
            {source?.kind === "selection"
              ? dict.fromSelection.replace("{{count}}", String(source.questionIds.length))
              : dict.fromFilters}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.name}</FormLabel>
                  <FormControl>
                    <Input placeholder={dict.namePlaceholder} autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {source?.kind === "filters" && (
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.count}</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder={String(MAX_LIST_SIZE)} {...field} />
                    </FormControl>
                    <FormDescription>{dict.countHint}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <InlineError error={error} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {dict.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dict.submit}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
