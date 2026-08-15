"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Routes } from "@/routes/routes";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useCancelSubscription } from "@/hooks/useCancelSubscription";
import type { SubscriptionStatus } from "@/services/subscription/get-status";
import { resolveLocale } from "@/lib/locale";

type SubscriptionDict = {
  title: string;
  loading: string;
  provider_label: string;
  status_label: string;
  statuses: {
    active: string;
    canceled: string;
    past_due: string;
    free: string;
  };
  renews_on: string;
  cancels_on: string;
  canceled_on: string;
  free_tries_left: string;
  cancel_button: string;
  cancel_pending: string;
  already_canceling: string;
  cancel_dialog: {
    title: string;
    description: string;
    confirm: string;
    dismiss: string;
  };
  upgrade: {
    title: string;
    subtitle: string;
    cta: string;
  };
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default function SubscriptionPage({ params }: Props) {
  const [dict, setDict] = useState<SubscriptionDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: subscription, isLoading } = useSubscriptionStatus();
  const { mutate: cancelSub, isPending: isCanceling } = useCancelSubscription();

  useEffect(() => {
    params.then(async (p) => {
      setLang(resolveLocale(p.lang));
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(resolveLocale(p.lang));
      setDict(dictionary.subscription as unknown as SubscriptionDict);
    });
  }, [params]);

  if (!dict || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{dict?.loading ?? "Loading…"}</p>
        </div>
      </div>
    );
  }

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  const statusLabel = (status: SubscriptionStatus | null): string => {
    if (!status) return dict.statuses.free;
    switch (status) {
      case "ACTIVE":
        return dict.statuses.active;
      case "CANCELED":
        return dict.statuses.canceled;
      case "PAST_DUE":
        return dict.statuses.past_due;
    }
  };

  const statusBadgeVariant = (
    status: SubscriptionStatus | null,
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";
    switch (status) {
      case "ACTIVE":
        return "default";
      case "CANCELED":
        return "secondary";
      case "PAST_DUE":
        return "destructive";
    }
  };

  const hasSubscription = !!subscription?.status;
  const isPremium = !!subscription?.isPremium;

  const handleConfirmCancel = () => {
    cancelSub(undefined, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{dict.title}</h1>
      </header>

      {hasSubscription ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle>{statusLabel(subscription!.status)}</CardTitle>
              </div>
              <Badge variant={statusBadgeVariant(subscription!.status)}>
                {statusLabel(subscription!.status)}
              </Badge>
            </div>
            <CardDescription>
              {subscription!.cancelAtPeriodEnd
                ? dict.cancels_on.replace(
                    "{{date}}",
                    formatDate(subscription!.currentPeriodEnd),
                  )
                : subscription!.status === "CANCELED"
                  ? dict.canceled_on.replace(
                      "{{date}}",
                      formatDate(subscription!.currentPeriodEnd),
                    )
                  : dict.renews_on.replace(
                      "{{date}}",
                      formatDate(subscription!.currentPeriodEnd),
                    )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription!.provider && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {dict.provider_label}
                </span>
                <span className="font-medium">{subscription!.provider}</span>
              </div>
            )}
            {subscription!.freeTriesLeft != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {dict.free_tries_left.replace(
                    "{{count}}",
                    subscription!.freeTriesLeft.toString(),
                  )}
                </span>
              </div>
            )}

            {isPremium && !subscription!.cancelAtPeriodEnd && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setDialogOpen(true)}
                disabled={isCanceling}
              >
                {isCanceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCanceling ? dict.cancel_pending : dict.cancel_button}
              </Button>
            )}

            {subscription!.cancelAtPeriodEnd && (
              <p className="text-sm text-muted-foreground text-center">
                {dict.already_canceling}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{dict.upgrade.title}</CardTitle>
            <CardDescription>{dict.upgrade.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription?.freeTriesLeft != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {dict.free_tries_left.replace(
                    "{{count}}",
                    subscription.freeTriesLeft.toString(),
                  )}
                </span>
              </div>
            )}
            <Button asChild size="lg" className="w-full">
              <Link href={`/${lang}${Routes.Premium}`}>{dict.upgrade.cta}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.cancel_dialog.title}</DialogTitle>
            <DialogDescription>
              {dict.cancel_dialog.description.replace(
                "{{date}}",
                formatDate(subscription?.currentPeriodEnd ?? null),
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCanceling}>
                {dict.cancel_dialog.dismiss}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCanceling}
            >
              {isCanceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict.cancel_dialog.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
