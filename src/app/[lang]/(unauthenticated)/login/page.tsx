"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
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
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { Routes } from "@/routes/routes";
import { setCookie } from "@/storages/cookies";
import Link from "next/link";

type LoginDict = {
  title: string;
  subtitle: string;
  email_label: string;
  email_placeholder: string;
  password_label: string;
  password_placeholder: string;
  forgot_password: string;
  instructor_link: string;
  submit_btn: string;
  submit_loading: string;
  new_here: string;
  register_now: string;
  validation: {
    identifier_required: string;
    identifier_invalid: string;
    password_min: string;
  };
  errors: {
    invalid_credentials: string;
    unexpected_error: string;
  };
};

const createLoginSchema = (dict: LoginDict) =>
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
        }
      ),
    password: z.string().min(6, dict.validation.password_min),
  });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export default function LoginPage({ params }: Props) {
  const [dict, setDict] = useState<LoginDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.login);
    });
  }, [params]);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: dict ? zodResolver(createLoginSchema(dict)) : undefined,
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      const destination = callbackUrl || Routes.Home;
      router.push(destination);
    }
  }, [session, router, callbackUrl]);

  const onSubmit = async (data: LoginFormData) => {
    if (!dict) return;
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        form.setError("root", {
          type: "manual",
          message: dict.errors.invalid_credentials,
        });
      } else if (result?.ok) {
        if (session?.user?.accessToken) {
          setCookie("@nahero:accessToken", session.user.accessToken, 90);
        }
        if (session?.user?.refreshToken) {
          setCookie("@nahero:refreshToken", session.user.refreshToken, 90);
        }

        const destination = callbackUrl || Routes.Home;
        router.push(destination);
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: dict.errors.unexpected_error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!dict) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-5 sm:p-10">
      <div className="flex flex-col items-center justify-center md:flex-row gap-12">
        <div className="flex w-full max-w-xl justify-center">
          <Image
            width={600}
            height={600}
            src="/clouds.png"
            alt="Login Banner"
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full max-w-md">
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
                      href={Routes.PasswordRecovery}
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
                    disabled={isLoading}
                    className="w-full h-11 text-base font-semibold"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {dict.submit_loading}
                      </>
                    ) : (
                      dict.submit_btn
                    )}
                  </Button>

                  <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                      {dict.new_here}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-11 font-bold"
                    onClick={() => router.push(Routes.Register)}
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
