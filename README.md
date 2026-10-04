# Nahero — Frontend

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![Status](https://img.shields.io/badge/status-in%20production-success)

This is the Next.js application behind **[nahero.site](https://nahero.site)** — a practice-exam platform for cloud and IT certifications.

**Nahero is live and running in production.** It is not a demo or a portfolio piece: real students sit real timed exams on this interface every day, and it is the checkout and account surface for paying premium subscribers. What you see in this repository is what serves production traffic.

The Spring Boot API lives in [nahero-back](https://github.com/Rakoski/nahero-back).

---

## What it does

- **The exam runner** — timed attempts with per-question navigation, autosaved progress, and resume-where-you-left-off across sessions and devices.
- **Results with domain breakdown** — a score, a pass/fail verdict, and a per-domain view of where the student actually lost points.
- **Student dashboard and history** — performance trends over time (charts via Recharts) and a full record of past attempts.
- **Premium checkout and account management** — Stripe-backed subscription flow with success/cancel handling and in-app plan management.
- **Full auth surface** — registration, login, email verification, forgot-password and recovery, all through NextAuth.
- **Bilingual by construction** — every route is namespaced under `/[lang]`, with `en` and `pt` dictionaries. Nothing ships with a hardcoded string.
- **Public marketing and content pages** — exam listings, FAQ, contact, privacy.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Server state | TanStack Query |
| Client state | Zustand + Jotai |
| Forms | react-hook-form + Zod |
| Auth | NextAuth |
| HTTP | axios, through a typed service layer |
| Charts | Recharts |
| Motion | Framer Motion |
| Packaging | Docker |

## Architecture

Routing is split into two groups under a locale segment, so the middleware can protect everything authenticated in one place:

```
src/
├── app/
│   ├── [lang]/
│   │   ├── (unauthenticated)/   # login, register, practice-exams/[slug], faq, password recovery…
│   │   └── (authenticated)/     # student/dashboard, student/history,
│   │                            # student/practice/[slug]/attempt (+ /results),
│   │                            # premium, subscription
│   └── api/
│       ├── auth/[...nextauth]/
│       └── proxy/[...path]/     # server-side proxy to the backend API
├── components/          # feature components; primitives in components/ui/
├── services/            # one folder per API domain, one file per call
├── hooks/               # TanStack Query wrappers and custom hooks
├── dictionaries/        # en.ts / pt.ts
├── providers/, storages/, lib/, utils/, types/
└── middleware.ts        # locale resolution + auth guard
```

Data flows one way: **component → hook (TanStack Query) → service (axios) → API**. Components never call axios directly.

## Getting started

### Prerequisites

- Node.js 20+
- A running instance of [nahero-back](https://github.com/Rakoski/nahero-back) (or credentials pointing at one)

### Run it

```bash
npm install
npm run dev    # http://localhost:3000
```

Create a `.env.local` before the first run with the backend base URL, the NextAuth secret and URL, and the Stripe publishable key. `.env*` is gitignored — nothing with a secret in it belongs in this repository.

### Other commands

```bash
npm run build      # production build
npm run lint       # ESLint
npm run lint:fix   # ESLint with autofix
```

Husky and lint-staged run on commit. Don't bypass them with `--no-verify`.

## Contributing

Contributions are welcome. A few conventions this codebase holds to:

- **TypeScript strict — no `any`.** Prefer string-literal unions over enums.
- **Every user-facing string goes in both `dictionaries/en.ts` and `dictionaries/pt.ts`.** No exceptions, no hardcoded copy.
- **Never hardcode `/en` or `/pt`** — read `lang` from the route params.
- Tailwind utilities only; use `cn()` from `src/lib/` for class merging.
- Adding a feature means: dictionary strings → service call → query/mutation hook → UI. In that order.
- Forms use react-hook-form with `zodResolver` and surface errors through the shadcn `Form` components.
- **Never commit `.env*` files.** Backend URLs and auth secrets stay out of git.

## License

Copyright (C) 2026 Nahero.

Licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](LICENSE) for the full text.

The AGPL is deliberate. Nahero is a network service, and section 13 means anyone who runs a modified version of this code as a public service must make their source available to its users under the same terms. You are free to use, study, modify, and self-host this software — you just can't take it closed-source and run it as a competing hosted product.
