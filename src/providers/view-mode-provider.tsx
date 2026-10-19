"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";

export type ViewMode = "student" | "instructor";

const VIEW_MODE_COOKIE = "nh_view_mode";
const TEACHER_ROLE = "IS_TEACHER";
const STUDENT_ROLE = "IS_STUDENT";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readViewModePreference(): ViewMode | null {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${VIEW_MODE_COOKIE}=`))
    ?.split("=")[1];

  return value === "student" || value === "instructor" ? value : null;
}

function writeViewModePreference(mode: ViewMode) {
  document.cookie = `${VIEW_MODE_COOKIE}=${mode}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  listeners.forEach((listener) => listener());
}

function resolveViewMode(roles: string[], routeMode: ViewMode | null, preference: ViewMode | null): ViewMode {
  const canInstruct = roles.includes(TEACHER_ROLE);
  const canStudy = roles.includes(STUDENT_ROLE);

  if (!canInstruct) return "student";
  if (!canStudy) return "instructor";
  return routeMode ?? preference ?? "instructor";
}

export function homeRouteFor(roles: string[] | undefined, preference: ViewMode | null = readViewModePreference()) {
  return resolveViewMode(roles ?? [], null, preference) === "instructor"
    ? Routes.TeacherDashboard
    : Routes.PracticeExams;
}

function modeFromPathname(pathname: string): ViewMode | null {
  const section = pathname.split("/")[2];
  if (section === "teacher") return "instructor";
  if (section === "student") return "student";
  return null;
}

type ViewModeContextValue = {
  mode: ViewMode;
  canSwitch: boolean;
  switchMode: (mode: ViewMode) => void;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: PropsWithChildren) {
  const { data: session } = useSession();
  const { lang } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const preference = useSyncExternalStore(subscribe, readViewModePreference, () => null);

  const roles = session?.user?.roles;
  const mode = resolveViewMode(roles ?? [], modeFromPathname(pathname), preference);
  const canSwitch = !!roles?.includes(TEACHER_ROLE) && !!roles?.includes(STUDENT_ROLE);

  const switchMode = useCallback(
    (next: ViewMode) => {
      writeViewModePreference(next);
      router.push(`/${lang}${next === "instructor" ? Routes.TeacherDashboard : Routes.StudentDashboard}`);
    },
    [lang, router],
  );

  const value = useMemo(() => ({ mode, canSwitch, switchMode }), [mode, canSwitch, switchMode]);

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode(): ViewModeContextValue {
  const context = useContext(ViewModeContext);
  if (!context) throw new Error("useViewMode must be used within a ViewModeProvider");
  return context;
}
