"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { UserNav } from "./user-nav";
import { SubscriptionHeaderWidget } from "./subscription-header-widget";
import { useState } from "react";
import { SignOut } from "../../services/auth/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Routes } from "../../routes/routes";

type HeaderDict = {
  home: string;
  exams: string;
  certifications: string;
  about: string;
  login: string;
  register: string;
  dashboard: string;
  history: string;
  my_profile: string;
  my_subscription: string;
  premium: string;
  free_tries_badge: string;
  premium_badge: string;
  logout: string;
  menu: string;
};

interface HeaderProps {
  lang: string;
  dict: HeaderDict;
}

const buildPath = (lang: string, route: string) => {
  return `/${lang}${route}`.replace(/\/+/g, "/");
};

export function Header({ dict, lang }: HeaderProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const getLinks = () => {
    const roles = session?.user?.roles || [];

    if (roles.includes("IS_STUDENT")) {
      return [
        {
          href: buildPath(lang, Routes.StudentDashboard),
          label: dict.dashboard,
        },
        {
          href: buildPath(lang, Routes.PracticeExams),
          label: dict.exams,
        },
        { href: buildPath(lang, "/student/history"), label: dict.history },
      ];
    }

    if (roles.includes("IS_TEACHER")) {
      return [
        {
          href: buildPath(lang, Routes.TeacherDashboard),
          label: dict.dashboard,
        },
        { href: buildPath(lang, "/teacher/create"), label: "Create Exam" },
      ];
    }

    return [
      { href: buildPath(lang, Routes.PracticeExams), label: dict.exams },
      { href: buildPath(lang, Routes.Home), label: dict.about },
    ];
  };

  const navLinks = getLinks();

  if (status === "loading") {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-stone-950/80 backdrop-blur supports-backdrop-filter:bg-stone-950/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-32 bg-stone-800 animate-pulse rounded" />
          <div className="h-8 w-24 bg-stone-800 animate-pulse rounded" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-stone-950/80 backdrop-blur supports-backdrop-filter:bg-stone-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-8">
          <Link
            href={buildPath(lang, Routes.Home)}
            className="flex items-center space-x-2"
          >
            <Image
              src="/favicon.ico"
              width={30}
              height={30}
              alt="NaHero logo"
            />
            <span className="text-xl font-bold text-yellow-500">NaHero</span>
          </Link>
        </div>

        <nav className="hidden sm:flex md:flex gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className=" font-medium text-stone-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session && (
            <div className="hidden md:block">
              <SubscriptionHeaderWidget
                lang={lang}
                dict={{
                  premium: dict.premium,
                  premium_badge: dict.premium_badge,
                  free_tries_badge: dict.free_tries_badge,
                }}
              />
            </div>
          )}
          {session ? (
            <div className="hidden md:block">
              <UserNav dict={dict} lang={lang} />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                asChild
                className="text-stone-300 hover:text-white hover:bg-white/10"
              >
                <Link href={buildPath(lang, Routes.Login)}>{dict.login}</Link>
              </Button>
              <Button
                asChild
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold transition-transform active:scale-95"
              >
                <Link href={buildPath(lang, Routes.Register)}>
                  {dict.register}
                </Link>
              </Button>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-stone-300"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">{dict.menu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-stone-950 border-stone-800 text-stone-100 flex flex-col"
            >
              <div className="flex flex-col gap-6 mt-6 ">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-stone-300 hover:text-yellow-500 text-center"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-stone-800 my-2" />

                {session ? (
                  <div className="flex flex-col gap-4 items-center">
                    <SubscriptionHeaderWidget
                      lang={lang}
                      dict={{
                        premium: dict.premium,
                        premium_badge: dict.premium_badge,
                        free_tries_badge: dict.free_tries_badge,
                      }}
                    />
                    <Link
                      href={buildPath(lang, Routes.Subscription)}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-stone-300 hover:text-yellow-500"
                    >
                      {dict.my_subscription}
                    </Link>
                    <div className="flex flex-col items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10 border border-stone-700">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>
                          {session.user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{session.user?.name}</span>
                        <span className="text-xs text-stone-500">
                          {session.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-1/2 justify-center"
                      onClick={() => {
                        SignOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {dict.logout}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 items-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-3/4 justify-center text-stone-300"
                    >
                      <Link
                        href={buildPath(lang, Routes.Login)}
                        onClick={() => setIsOpen(false)}
                      >
                        {dict.login}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-3/4 bg-yellow-600 text-white font-bold justify-center"
                    >
                      <Link
                        href={buildPath(lang, Routes.Register)}
                        onClick={() => setIsOpen(false)}
                      >
                        {dict.register}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
