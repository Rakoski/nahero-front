"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { UserNav } from "./user-nav";
import { useState } from "react";
import { SignOut } from "../../services/auth/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Routes } from "../../routes/routes";

interface HeaderProps {
  lang: string;
  dict: any;
}

export function Header({ dict, lang }: HeaderProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const getLinks = () => {
    const roles = session?.user?.roles || [];

    if (roles.includes("IS_STUDENT")) {
      return [
        {
          href: `/${lang}/${Routes.StudentDashboard}`,
          label: dict.header.dashboard,
        },
        {
          href: `/${lang}/${Routes.PracticeExams}`,
          label: dict.header.exams,
        },
        { href: `/${lang}/student/history`, label: dict.header.history },
      ];
    }

    if (roles.includes("IS_TEACHER")) {
      return [
        {
          href: `/${lang}/${Routes.TeacherDashboard}`,
          label: dict.header.dashboard,
        },
        { href: `/${lang}/teacher/create`, label: "Create Exam" },
      ];
    }

    return [
      { href: `/${lang}/${Routes.PracticeExams}`, label: dict.header.exams },
      { href: `/${lang}/`, label: dict.header.about },
    ];
  };

  const navLinks = getLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-stone-950/80 backdrop-blur supports-backdrop-filter:bg-stone-950/60">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center gap-8">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <img
              src="/favicon.ico"
              width="30px"
              height="30px"
              alt="NaHero logo"
            />
            <span className="text-xl font-bold text-yellow-500">NaHero</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="hidden md:block">
              <UserNav dict={dict.header} />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                asChild
                className="text-stone-300 hover:text-white hover:bg-white/10"
              >
                <Link href={`/${lang}/${Routes.Login}`}>
                  {dict.header.login}
                </Link>
              </Button>
              <Button
                asChild
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold transition-transform active:scale-95"
              >
                <Link href={`/${lang}/${Routes.Register}`}>
                  {dict.header.register}
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
                <span className="sr-only">{dict.header.menu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-stone-950 border-stone-800 text-stone-100"
            >
              <div className="flex flex-col gap-6 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-stone-300 hover:text-yellow-500"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-stone-800 my-2" />

                {session ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10 border border-stone-700">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>
                          {session.user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold">{session.user?.name}</span>
                        <span className="text-xs text-stone-500">
                          {session.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => {
                        SignOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {dict.header.logout}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-stone-300"
                    >
                      <Link
                        href={`/${lang}/${Routes.Login}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {dict.header.login}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-yellow-600 text-white font-bold"
                    >
                      <Link
                        href={`/${lang}/${Routes.Register}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {dict.header.register}
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
