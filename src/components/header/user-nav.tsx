"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { Routes } from "@/routes/routes";

type UserNavDict = {
  dashboard: string;
  my_profile: string;
  my_subscription: string;
  logout: string;
};

export function UserNav({ dict, lang }: { dict: UserNavDict; lang: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-stone-700">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-stone-800 text-yellow-500">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-stone-900 text-stone-200 border-stone-800"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.name}
            </p>
            <p className="text-xs leading-none text-stone-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-stone-800" />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${lang}${Routes.Subscription}`}>
            <Sparkles className="mr-2 h-4 w-4" />
            {dict.my_subscription}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-stone-800" />
        <DropdownMenuItem
          className="text-red-500 focus:bg-red-900/20 focus:text-red-500 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {dict.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
