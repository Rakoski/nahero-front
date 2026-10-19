"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/providers/locale-provider";
import { dismissCaptcha, solveCaptcha, useCaptchaStore } from "@/lib/captcha-store";
import { TurnstileWidget } from "./turnstile-widget";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function CaptchaChallenge() {
  const { lang, dict } = useLocale();
  const [failed, setFailed] = useState(false);

  if (!SITE_KEY) {
    return <p className="text-sm text-destructive">{dict.captcha.unavailable}</p>;
  }

  return (
    <div className="space-y-3">
      <TurnstileWidget
        siteKey={SITE_KEY}
        language={lang === "pt" ? "pt-br" : "en"}
        onToken={solveCaptcha}
        onError={() => setFailed(true)}
      />
      {failed && <p className="text-center text-sm text-destructive">{dict.captcha.error}</p>}
    </div>
  );
}

export function CaptchaDialog() {
  const { dict } = useLocale();
  const open = useCaptchaStore((state) => state.open);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismissCaptcha()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.captcha.title}</DialogTitle>
          <DialogDescription>{dict.captcha.description}</DialogDescription>
        </DialogHeader>
        {open && <CaptchaChallenge />}
      </DialogContent>
    </Dialog>
  );
}
