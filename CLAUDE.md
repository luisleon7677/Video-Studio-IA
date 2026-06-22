# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Video Studio IA is a video production studio management platform with three independent workspaces:

- **`client/`** — React 19 + Vite + Tailwind CSS 4 SPA
- **`server/`** — NestJS 11 + Prisma + MySQL REST API
- **`remotion/`** — Remotion 4 + React Three Fiber video rendering engine

## Commands

Each workspace has its own `package.json`. Run commands from within the relevant directory.

### Client
```bash
cd client
npm run dev        # Start Vite dev server (proxies /api → localhost:3000)
npm run build      # Production build
npm run preview    # Preview production build
```

### Server
```bash
cd server
npm run start:dev  # NestJS with hot reload
npm run start      # Production start
npm run build      # Compile TypeScript

# Prisma
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate client after schema changes
```

### Remotion
```bash
cd remotion
npm run dev        # Remotion Studio preview
npm run build      # Render video (see package.json for full render command)
```

## Architecture

### Client

**Routing** is defined in [client/src/routes/](client/src/routes/) and wired in [client/src/App.jsx](client/src/App.jsx). The app uses React Router 7. Protected routes redirect to `/login` if no auth token exists in `localStorage`.

**Auth state** lives in [client/src/hooks/useAuth.jsx](client/src/hooks/useAuth.jsx) via React Context. `AuthProvider` wraps the entire app. Components consume auth state via `useAuth()`.

**API layer** in [client/src/api/](client/src/api/) — one file per domain (auth, templates, sales, videos). Each file exports async functions that call `fetch` with the JWT token from `localStorage`. The Vite dev proxy forwards `/api/*` to `localhost:3000`.

**Pages** in [client/src/pages/](client/src/pages/) — Dashboard, Templates, AiProcessing, VideoHistory, SalesHistory, Login, Register, VideoEditing.

**Styling** uses Tailwind CSS v4 with a custom OKLCH color palette defined in [client/src/index.css](client/src/index.css). Semantic tokens (`--color-primary`, `--color-secondary`, etc.) and company-specific colors (`cepal`, `ibc`, `sistemas`) are declared as CSS custom properties and consumed via Tailwind utility classes.

### Server

Clean Architecture + DDD. Each module under [server/src/modules/](server/src/modules/) is structured as:

```
modules/<domain>/
  domain/          # Entities, repository interfaces, domain services
  application/     # Use cases (one class per use case)
  infrastructure/  # Prisma repository implementations, external services
  presentation/    # NestJS controllers, DTOs, guards
```

Modules: `users`, `videos`, `templates`, `sales`.

**External integrations:**
- **AWS S3** — video file storage (credentials in `server/.env`)
- **Google AI (GenAI)** — AI-powered video processing
- **MySQL via Prisma** — schema at [server/prisma/schema.prisma](server/prisma/schema.prisma)

**Auth** uses JWT. Guards are applied at the controller level. Passwords hashed with `bcryptjs`.

Global `ValidationPipe` is configured with `transform: true` and `whitelist: true` in [server/src/main.ts](server/src/main.ts).

### Remotion

[remotion/src/Root.tsx](remotion/src/Root.tsx) registers all compositions. The main scene ([remotion/src/Scene.tsx](remotion/src/Scene.tsx)) renders a 3D phone mockup using React Three Fiber with a video preview inside. [remotion/src/TopScorersChart.tsx](remotion/src/TopScorersChart.tsx) renders animated data visualizations.

## Key Conventions

- **Client components** use `.jsx`; **server** uses `.ts`/`.ts` (TypeScript strict).
- Mock data for UI development lives in [client/src/data/mock/](client/src/data/mock/).
- Navigation items are defined centrally in [client/src/data/navigation.js](client/src/data/navigation.js).
- The server runs on port **3000**; the client dev server runs on **5173** (Vite default).
- Environment variables for the server go in `server/.env` (not committed). Required vars: `DATABASE_URL`, `JWT_SECRET`, `AWS_*`, `GOOGLE_AI_API_KEY`.
