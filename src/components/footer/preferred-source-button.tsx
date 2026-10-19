"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

type PreferredSourceClient = {
  init: (options: { theme?: "light" | "dark"; lang?: string }) => void;
  addPreferredSource: () => void;
};

type PreferredSourceCallback = (client: PreferredSourceClient) => void;

type PreferredSourceQueue = {
  push: (callback: PreferredSourceCallback) => void;
};

declare global {
  interface Window {
    PREFERRED_SOURCE?: PreferredSourceQueue;
  }
}

interface PreferredSourceButtonProps {
  lang: string;
  label: string;
}

const preferredSourceUrl = `https://www.google.com/preferences/source?q=${new URL(getSiteUrl()).host}`;

export function PreferredSourceButton({ lang, label }: PreferredSourceButtonProps) {
  const clientRef = useRef<PreferredSourceClient | null>(null);

  useEffect(() => {
    const queue: PreferredSourceQueue = window.PREFERRED_SOURCE || ([] as PreferredSourceCallback[]);
    window.PREFERRED_SOURCE = queue;
    queue.push((client) => {
      client.init({ theme: "dark", lang });
      clientRef.current = client;
    });
  }, [lang]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!clientRef.current) return;
    event.preventDefault();
    clientRef.current.addPreferredSource();
  };

  return (
    <>
      <Script
        id="google-preferred-source"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="lazyOnload"
        preferred-sources-control="manual"
      />
      <a
        href={preferredSourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs text-stone-300 hover:border-yellow-500/50 hover:text-yellow-500 transition-colors"
      >
        <Star className="size-3.5" />
        {label}
      </a>
    </>
  );
}
