"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BACK_SENTINEL = "__back__";

export function useLeaveConfirmation(enabled: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const allowNavigationRef = useRef(false);
  const enabledRef = useRef(enabled);
  const sentinelPushedRef = useRef(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!enabledRef.current) return;
      if (allowNavigationRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      if (allowNavigationRef.current) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      if (href === window.location.pathname + window.location.search) return;

      e.preventDefault();
      e.stopPropagation();
      setPendingHref(href);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!enabledRef.current) return;
      if (allowNavigationRef.current) return;
      window.history.pushState(null, "", window.location.href);
      setPendingHref(BACK_SENTINEL);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    if (!enabled || sentinelPushedRef.current) return;
    window.history.pushState(null, "", window.location.href);
    sentinelPushedRef.current = true;
  }, [enabled]);

  const allowNext = useCallback(() => {
    allowNavigationRef.current = true;
  }, []);

  const confirmLeave = useCallback(() => {
    if (!pendingHref) return;
    allowNavigationRef.current = true;
    if (pendingHref === BACK_SENTINEL) {
      window.history.go(-2);
    } else {
      router.push(pendingHref);
    }
    setPendingHref(null);
  }, [pendingHref, router]);

  const cancelLeave = useCallback(() => setPendingHref(null), []);

  return {
    isLeaveDialogOpen: pendingHref !== null,
    confirmLeave,
    cancelLeave,
    allowNext,
  };
}
