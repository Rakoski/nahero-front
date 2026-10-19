"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { Dictionary } from "@/dictionaries";

type PracticeDialogDict = Dictionary["questionBank"]["practiceDialog"];

const createSchema = (dict: PracticeDialogDict, max: number) =>
  z.object({
    count: z
      .string()
      .trim()
      .refine(
        (value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= max,
        dict.countInvalid.replace("{{max}}", String(max)),
      ),
    random: z.boolean(),
    onlyUnanswered: z.boolean(),
  });

type PracticeSetupFormData = z.infer<ReturnType<typeof createSchema>>;

export interface PracticeOptions {
  count: number;
  random: boolean;
  onlyUnanswered: boolean;
}

interface PracticeSetupDialogProps {
  open: boolean;
  max: number;
  dict: PracticeDialogDict;
  onStart: (options: PracticeOptions) => Promise<boolean>;
  onClose: () => void;
}

export function PracticeSetupDialog({ open, max, dict, onStart, onClose }: PracticeSetupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>{dict.description}</DialogDescription>
        </DialogHeader>
        {open && <PracticeSetupForm max={max} dict={dict} onStart={onStart} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function PracticeSetupForm({ max, dict, onStart, onClose }: Omit<PracticeSetupDialogProps, "open">) {
  const [noneLeft, setNoneLeft] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const form = useForm<PracticeSetupFormData>({
    resolver: zodResolver(createSchema(dict, max)),
    defaultValues: { count: String(max), random: true, onlyUnanswered: false },
  });

  const submit = async (values: PracticeSetupFormData) => {
    setNoneLeft(false);
    setError(null);
    try {
      const started = await onStart({
        count: Number(values.count),
        random: values.random,
        onlyUnanswered: values.onlyUnanswered,
      });
      setNoneLeft(!started);
    } catch (startError) {
      setError(startError);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormField
          control={form.control}
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.count}</FormLabel>
              <FormControl>
                <Input inputMode="numeric" autoFocus {...field} />
              </FormControl>
              <FormDescription>{dict.countHint.replace("{{max}}", String(max))}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="random"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} />
              </FormControl>
              <FormLabel className="font-normal">{dict.random}</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="onlyUnanswered"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} />
              </FormControl>
              <FormLabel className="font-normal">{dict.onlyUnanswered}</FormLabel>
            </FormItem>
          )}
        />

        {noneLeft && <p className="text-sm text-muted-foreground">{dict.none}</p>}
        <InlineError error={error} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {dict.cancel}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dict.start}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
