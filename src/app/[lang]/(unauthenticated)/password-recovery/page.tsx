"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MailCheck } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Dictionary } from "@/dictionaries";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { usePasswordRecovery } from "./usePasswordRecovery";
import { useLocale } from "@/providers/locale-provider";

const createPasswordRecoverySchema = (dict: Dictionary["passwordRecovery"]) =>
  z.object({
    email: z
      .string()
      .min(1, dict.validation.email_required)
      .email(dict.validation.email_invalid),
  });

type PasswordRecoveryFormData = z.infer<
  ReturnType<typeof createPasswordRecoverySchema>
>;

export default function PasswordRecoveryPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.passwordRecovery;
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { mutate: requestRecovery, isPending } = usePasswordRecovery({
    onSent: setSentTo,
  });

  const form = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(createPasswordRecoverySchema(dict)),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: PasswordRecoveryFormData) => {
    requestRecovery({ email: data.email });
  };

  const onUseDifferentEmail = () => {
    setSentTo(null);
    form.reset();
  };

  return (
    <div className="w-full min-h-[calc(85vh-200px)] flex items-center justify-center p-5 sm:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl items-center">
        <div className="flex justify-center">
          <Image
            width={600}
            height={600}
            src="/clouds.png"
            alt="Cloud illustration"
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="w-full shadow-lg">
            {sentTo ? (
              <>
                <CardHeader className="space-y-1">
                  <div className="flex justify-center mb-2">
                    <MailCheck
                      className="h-12 w-12 text-yellow-600"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle>
                    <Typography variant="h3" styling="gradient" font="sans">
                      {dict.sent_title}
                    </Typography>
                  </CardTitle>
                  <CardDescription>
                    {dict.sent_description.replace("{{email}}", sentTo)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {dict.sent_hint}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-11 font-bold"
                    onClick={onUseDifferentEmail}
                  >
                    {dict.resend_btn}
                  </Button>

                  <div className="flex items-center justify-center text-sm">
                    <Link
                      href={`/${lang}/login`}
                      className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline"
                    >
                      {dict.back_to_login}
                    </Link>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="space-y-1">
                  <CardTitle>
                    <Typography variant="h3" styling="gradient" font="sans">
                      {dict.title}
                    </Typography>
                  </CardTitle>
                  <CardDescription>{dict.subtitle}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mt-4">
                              <FormLabel>{dict.email_label}</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  autoComplete="email"
                                  placeholder={dict.email_placeholder}
                                  className="h-11 mt-2"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 text-base font-semibold"
                        size="lg"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dict.submit_loading}
                          </>
                        ) : (
                          dict.submit_btn
                        )}
                      </Button>

                      <div className="flex items-center justify-center text-sm">
                        <Link
                          href={`/${lang}/login`}
                          className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline"
                        >
                          {dict.back_to_login}
                        </Link>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
