"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Dictionary } from "@/dictionaries";
import { Typography } from "@/components/ui/typography";
import { Routes } from "@/routes/routes";
import toast from "react-hot-toast";
import Link from "next/link";
import { useLogin } from "./useLogin";
import { useLocale } from "@/providers/locale-provider";

const createLoginSchema = (dict: Dictionary["login"]) =>
  z.object({
    identifier: z
      .string()
      .min(1, dict.validation.identifier_required)
      .refine(
        (value) => {
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          const isRA = /^\d+$/.test(value);
          return isEmail || isRA;
        },
        {
          message: dict.validation.identifier_invalid,
        },
      ),
    password: z.string().min(6, dict.validation.password_min),
  });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export default function LoginPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.login;
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const justVerified = searchParams.get("verified") === "1";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(dict)),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      const destination = callbackUrl || `/${lang}${Routes.PracticeExams}`;
      router.push(destination);
    }
  }, [session, router, callbackUrl, lang]);

  const verifiedToastShown = useRef(false);

  useEffect(() => {
    if (!justVerified || verifiedToastShown.current) return;
    verifiedToastShown.current = true;
    toast.success(dict.verified_success);
  }, [dict, justVerified]);

  const onSubmit = (data: LoginFormData) => {
    login({
      identifier: data.identifier,
      password: data.password,
    });
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
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mt-4">
                          <FormLabel>{dict.email_label}</FormLabel>
                          <FormControl>
                            <Input
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

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.password_label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={dict.password_placeholder}
                              className="h-11 pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent p-0 w-8 h-8 flex items-center justify-center"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <Link
                      href={`/${lang}${Routes.PasswordRecovery}`}
                      className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline"
                    >
                      {dict.forgot_password}
                    </Link>
                  </div>

                  {form.formState.errors.root && (
                    <p className="text-sm text-destructive text-center">
                      {form.formState.errors.root.message}
                    </p>
                  )}

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

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-11 font-bold"
                    onClick={() => router.push(`/${lang}${Routes.Register}`)}
                  >
                    {dict.new_here}{" "}
                    <span className="ml-1 text-yellow-600 hover:underline">
                      {dict.register_now}
                    </span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}
