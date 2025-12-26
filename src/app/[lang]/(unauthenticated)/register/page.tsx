"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Typography } from "@/components/ui/typography";
import { Routes } from "@/routes/routes";
import Link from "next/link";

type RegisterDict = {
  title: string;
  subtitle: string;
  name_label: string;
  name_placeholder: string;
  email_label: string;
  email_placeholder: string;
  password_label: string;
  password_placeholder: string;
  confirm_password_label: string;
  confirm_password_placeholder: string;
  back_to_login: string;
  submit_btn: string;
  submit_loading: string;
  validation: {
    name_required: string;
    name_min: string;
    email_required: string;
    email_invalid: string;
    password_min: string;
    confirm_password_required: string;
    passwords_must_match: string;
  };
  errors: {
    registration_failed: string;
    unexpected_error: string;
  };
};

const createRegisterSchema = (dict: RegisterDict) =>
  z
    .object({
      name: z
        .string()
        .min(1, dict.validation.name_required)
        .min(2, dict.validation.name_min),
      email: z
        .string()
        .min(1, dict.validation.email_required)
        .email(dict.validation.email_invalid),
      password: z.string().min(6, dict.validation.password_min),
      confirmPassword: z
        .string()
        .min(1, dict.validation.confirm_password_required),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.validation.passwords_must_match,
      path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

type Props = {
  params: Promise<{ lang: "en" | "pt" }>;
};

export default function RegisterPage({ params }: Props) {
  const [dict, setDict] = useState<RegisterDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.register);
    });
  }, [params]);

  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: dict ? zodResolver(createRegisterSchema(dict)) : undefined,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      router.push(Routes.Home);
    }
  }, [session, router]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!dict) return;
    setIsLoading(true);

    try {
      // TODO: Implement registration API call
      console.log("Registration data:", data);

      // Placeholder for registration logic
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }

      // After successful registration, redirect to login
      // router.push(`/${lang}/login`);

      form.setError("root", {
        type: "manual",
        message: dict.errors.registration_failed,
      });
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
    <div className="w-full min-h-[calc(85vh-200px)] flex items-center justify-center p-5 sm:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl items-center">
        <div className="flex justify-center">
          <Image
            width={600}
            height={600}
            src="/clouds.png"
            alt="Register Banner"
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mt-4">
                          <FormLabel>{dict.name_label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={dict.name_placeholder}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.email_label}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={dict.email_placeholder}
                            className="h-11 mt-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.confirm_password_label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={dict.confirm_password_placeholder}
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
          </div>
        </div>
      </div>
    </div>
  );
}
