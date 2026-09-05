"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { verifyEmail } from "@/services/auth/verify-email";
import { Routes } from "@/routes/routes";
import { resolveLocale, type Locale } from "@/lib/locale";
import { useResendVerification } from "./useResendVerification";

export type VerifyEmailDict = {
  pending_title: string;
  pending_subtitle: string;
  email_placeholder: string;
  resend_btn: string;
  resend_cooldown: string;
  resend_success: string;
  confirm_title: string;
  confirm_subtitle: string;
  confirm_loading: string;
  invalid_title: string;
  invalid_subtitle: string;
  request_new_link: string;
  back_to_login: string;
};

type Props = { params: Promise<{ lang: string }> };

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(85vh-200px)] flex items-center justify-center p-5 sm:p-10">
      <div className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle>
            <Typography variant="h3" styling="gradient" font="sans">
              {title}
            </Typography>
          </CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </div>
    </div>
  );
}

function PendingView({
  dict,
  initialEmail,
  justSent,
}: {
  dict: VerifyEmailDict;
  initialEmail: string;
  justSent: boolean;
}) {
  const [email, setEmail] = useState(initialEmail);
  const {
    mutate: resend,
    cooldown,
    canResend,
    isPending,
  } = useResendVerification(justSent ? 60 : 0, dict.resend_success);

  return (
    <Shell
      title={dict.pending_title}
      subtitle={
        initialEmail ? (
          <>
            {dict.pending_subtitle} <strong>{initialEmail}</strong>
          </>
        ) : (
          dict.pending_subtitle
        )
      }
    >
      {!initialEmail && (
        <Input
          type="email"
          placeholder={dict.email_placeholder}
          className="h-11 mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      <Button
        onClick={() => resend(email)}
        disabled={!canResend || !email}
        className="w-full h-11 text-base font-semibold mt-2"
        size="lg"
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {cooldown > 0
          ? dict.resend_cooldown.replace("{seconds}", String(cooldown))
          : dict.resend_btn}
      </Button>
    </Shell>
  );
}

function ConfirmView({
  dict,
  lang,
  token,
}: {
  dict: VerifyEmailDict;
  lang: Locale;
  token: string;
}) {
  const router = useRouter();
  const { mutate, isError } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => router.replace(`/${lang}${Routes.Login}?verified=1`),
  });

  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    mutate(token);
  }, [mutate, token]);

  if (isError) {
    return (
      <Shell title={dict.invalid_title} subtitle={dict.invalid_subtitle}>
        <Button
          onClick={() => router.replace(`/${lang}${Routes.VerifyEmail}`)}
          className="w-full h-11 text-base font-semibold mt-2"
          size="lg"
        >
          {dict.request_new_link}
        </Button>
      </Shell>
    );
  }

  return (
    <Shell title={dict.confirm_title} subtitle={dict.confirm_subtitle}>
      <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">{dict.confirm_loading}</span>
      </div>
    </Shell>
  );
}

function VerifyEmailContent({ params }: Props) {
  const [dict, setDict] = useState<VerifyEmailDict | null>(null);
  const [lang, setLang] = useState<Locale>("en");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";
  const justSent = searchParams.get("sent") === "1";

  useEffect(() => {
    params.then(async (p) => {
      const locale = resolveLocale(p.lang);
      setLang(locale);
      const { getDictionary } = await import("@/dictionaries");
      setDict((await getDictionary(locale)).verifyEmail);
    });
  }, [params]);

  if (!dict) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  return token ? (
    <ConfirmView dict={dict} lang={lang} token={token} />
  ) : (
    <PendingView dict={dict} initialEmail={email} justSent={justSent} />
  );
}

export default function VerifyEmailPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent {...props} />
    </Suspense>
  );
}
