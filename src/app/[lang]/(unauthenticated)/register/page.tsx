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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Routes } from "@/routes/routes";
import Link from "next/link";
import { useRegister } from "./useRegister";
import type { Dictionary } from "@/dictionaries";
import { useLocale } from "@/providers/locale-provider";

const createRegisterSchema = (dict: Dictionary["register"]) =>
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

export default function RegisterPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.register;
  const { data: session } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: register, isPending } = useRegister(lang);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(dict)),
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

  const onSubmit = (data: RegisterFormData) => {
    register(data);
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

                  {/* 3. Use isPending state */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
