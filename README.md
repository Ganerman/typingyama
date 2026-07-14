# TypeRush

TypeRush is a modern gamified typing platform built with React, Vite, TypeScript, Tailwind CSS, Supabase-ready auth/database wiring, React Router, Framer Motion, Recharts, and Lucide React.

Core WPM, accuracy, XP, level, and personal-best calculations run in a C++ WebAssembly engine. A TypeScript fallback keeps the game usable if WebAssembly cannot load.

## Features

- Landing page with gaming-style branding and leaderboard/stat previews
- Instant guest play with a locally saved profile and progress
- Dashboard with rank, XP, streaks, stats, activity, achievements, charts, and quick modes
- Classic typing test with durations, custom time, difficulty, language, live WPM, accuracy, errors, paste prevention, restart shortcut, results, XP, and speed chart
- Typing Race, Word Rain, Code Typing, Student Mode, Daily Challenge, Leaderboard, Achievements, Profile, History, and Settings pages
- Local sample data fallback when Supabase environment variables are not configured
- SQL migration with tables, indexes, constraints, relationships, and RLS policies

## Setup

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` when Supabase is available:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Apply the database schema in `supabase/migrations/001_initial_schema.sql` using the Supabase SQL editor or CLI.

## Useful Commands

```bash
npm run build
npm run preview
npm run lint
npm run build:wasm
```

`npm run build` regenerates `public/typing-engine.wasm` before the Vite build, so the normal Cloudflare Pages settings remain `npm run build` and `dist`.

## Notes

The app works without Supabase by using sample data and local storage for profile edits, daily completion, and classic typing test history. Once Supabase credentials are provided, authentication calls use Supabase automatically.
