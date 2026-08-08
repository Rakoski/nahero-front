# Nahero Frontend

Nahero is a free practice-exams platform for cloud/IT certifications (currently focused on AWS Cloud Practitioner). This is the **Next.js frontend**. The Spring Boot API lives in `../nahero-back`.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives in [src/components/ui/](src/components/ui/))
- **TanStack Query** for server state, **Zustand** + **Jotai** for client state
- **react-hook-form** + **Zod** for forms/validation
- **NextAuth** for session/auth, **axios** for HTTP
- **i18n** via custom dictionaries ([en](src/dictionaries/en.ts) / [pt](src/dictionaries/pt.ts)), routed under `/[lang]`

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` / `npm run lint:fix` — ESLint
- Husky + lint-staged run on commit; do not bypass with `--no-verify`

## Project Layout

- [src/app/[lang]/](src/app/[lang]/) — App Router, split into `(authenticated)` and `(unauthenticated)` route groups
- [src/components/](src/components/) — feature components; reusable primitives in [src/components/ui/](src/components/ui/)
- [src/services/](src/services/) — API clients per domain (`auth`, `practice-exams`, `questions`, `answers`, `alternatives`, `student-practice-attempts`, `users`)
- [src/hooks/](src/hooks/) — custom hooks, including TanStack Query wrappers
- [src/dictionaries/](src/dictionaries/) — i18n strings; **every user-facing string must be added to both `en.ts` and `pt.ts`**
- [src/types/](src/types/), [src/lib/](src/lib/), [src/utils/](src/utils/), [src/providers/](src/providers/), [src/storages/](src/storages/), [src/middleware.ts](src/middleware.ts)

## Conventions

- TypeScript strict — no `any`, prefer string-literal unions over enums
- Named exports preferred; default exports only where Next.js requires (pages, layouts)
- Tailwind utilities only; do not add custom CSS files (extend [src/app/[lang]/globals.css](src/app/[lang]/globals.css) only when unavoidable)
- Use `cn()` from [src/lib/](src/lib/) for class merging
- Forms: react-hook-form + zodResolver; surface errors via shadcn `Form` components
- Server state goes through TanStack Query in [src/hooks/](src/hooks/), never call axios from components directly — go through [src/services/](src/services/)
- Match existing service shape when adding endpoints (one folder per domain, one file per call)
- Locale-aware routes — never hardcode `/en` or `/pt`, read `lang` from route params

## Important Notes

- The backend base URL and auth secrets live in `.env*` files — **never commit them**
- Auth flows through NextAuth; protected pages live under `(authenticated)` and rely on [src/middleware.ts](src/middleware.ts)
- When adding a feature: add strings to both dictionaries, add the service call, add a query/mutation hook, then build the UI
- Before reporting UI work as done, run it in the browser — type checks don't catch broken UX
