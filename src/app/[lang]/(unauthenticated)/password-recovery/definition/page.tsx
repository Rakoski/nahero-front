"use client";

import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";
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
import { getDictionary } from "@/dictionaries";
import { Typography } from "@/components/ui/typography";
import { Routes } from "@/routes/routes";
import Link from "next/link";
import { useResetPassword } from "./useResetPassword";

type PasswordRecoveryDefinitionDict = {
  title: string;
  subtitle: string;
  password_label: string;
  password_placeholder: string;
  confirm_password_label: string;
  confirm_password_placeholder: string;
  submit_btn: string;
  submit_loading: string;
  back_to_login: string;
  success_title: string;
  success_description: string;
  go_to_login: string;
  missing_token_title: string;
  missing_token_description: string;
  invalid_token_description: string;
  request_new_link: string;
  validation: {
    password_required: string;
    password_min: string;
    confirm_password_required: string;
    passwords_must_match: string;
  };
};

const createResetPasswordSchema = (dict: PasswordRecoveryDefinitionDict) =>
  z
    .object({
      password: z
        .string()
        .min(1, dict.validation.password_required)
        .min(6, dict.validation.password_min),
      confirmPassword: z
        .string()
        .min(1, dict.validation.confirm_password_required),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.validation.passwords_must_match,
      path: ["confirmPassword"],
    });

type ResetPasswordFormData = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export default function PasswordRecoveryDefinitionPage({ params }: Props) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PasswordRecoveryDefinitionContent params={params} />
    </Suspense>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
    </div>
  );
}

function PasswordRecoveryDefinitionContent({ params }: Props) {
  const [dict, setDict] = useState<PasswordRecoveryDefinitionDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isTokenRejected, setIsTokenRejected] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.passwordRecoveryDefinition);
    });
  }, [params]);

  const { mutate: submitNewPassword, isPending } = useResetPassword({
    onDone: () => setIsDone(true),
    onTokenRejected: () => setIsTokenRejected(true),
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: dict ? zodResolver(createResetPasswordSchema(dict)) : undefined,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;

    submitNewPassword({
      resetToken: token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  if (!dict) return <PageLoader />;

  const isTokenUnusable = !token || isTokenRejected;

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
            {isDone ? (
              <>
                <CardHeader className="space-y-1">
                  <div className="flex justify-center mb-2">
                    <CheckCircle2
                      className="h-12 w-12 text-yellow-600"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle>
                    <Typography variant="h3" styling="gradient" font="sans">
                      {dict.success_title}
                    </Typography>
                  </CardTitle>
                  <CardDescription className="mb-2">
                    {dict.success_description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link href={`/${lang}${Routes.Login}`}>
                    <Button
                      type="button"
                      className="w-full h-11 text-base font-semibold"
                      size="lg"
                    >
                      {dict.go_to_login}
                    </Button>
                  </Link>
                </CardContent>
              </>
            ) : isTokenUnusable ? (
              <>
                <CardHeader className="space-y-1">
                  <div className="flex justify-center mb-2">
                    <TriangleAlert
                      className="h-12 w-12 text-destructive"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle>
                    <Typography variant="h3" styling="gradient" font="sans">
                      {dict.missing_token_title}
                    </Typography>
                  </CardTitle>
                  <CardDescription classname="mb-2">
                    {isTokenRejected
                      ? dict.invalid_token_description
                      : dict.missing_token_description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 mt-2">
                  <Link href={`/${lang}${Routes.PasswordRecovery}`}>
                    <Button
                      type="button"
                      className="w-full h-11 text-base font-semibold mb-4"
                      size="lg"
                    >
                      {dict.request_new_link}
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center text-sm">
                    <Link
                      href={`/${lang}${Routes.Login}`}
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mt-4">
                              <FormLabel>{dict.password_label}</FormLabel>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder={dict.password_placeholder}
                                    className="h-11 pr-10"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    variant="ghost"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent p-0 w-8 h-8 flex items-center justify-center"
                                    aria-label={
                                      showPassword
                                        ? "Hide password"
                                        : "Show password"
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
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{dict.confirm_password_label}</FormLabel>
                            <FormControl>
                              <div className="relative mt-2">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  autoComplete="new-password"
                                  placeholder={
                                    dict.confirm_password_placeholder
                                  }
                                  className="h-11 pr-10"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  variant="ghost"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent p-0 w-8 h-8 flex items-center justify-center"
                                  aria-label={
                                    showConfirmPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  {showConfirmPassword ? (
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

                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 text-base font-semibold mt-2 mb-4"
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
                          href={`/${lang}${Routes.Login}`}
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
