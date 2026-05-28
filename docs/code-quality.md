# Code Quality Rules

## Baseline

- Use the local Next.js docs before changing Next-specific APIs or file conventions.
- Keep TypeScript strict. Avoid `any`; model data with explicit types and narrow unknown values.
- Prefer small components with clear props over broad shared components that know too much.
- Keep client boundaries intentional. Add `"use client"` only where state, effects, or browser APIs are needed.
- Keep UI state local unless it is genuinely shared across routes or workflows.
- Prefer accessible controls: real `button`, `a`, labels, focus states, and keyboard-safe interactions.
- Keep async work explicit. Handle loading, empty, and error states near the user-facing UI.
- Avoid hidden formatting churn. Let lint and TypeScript catch correctness; keep visual changes scoped.
- Use existing project helpers and design patterns before adding new abstractions.
- Leave unrelated dirty worktree changes alone.

## Lint Policy

- `npm run lint` checks Next.js, React, React Hooks, TypeScript, and local code-quality rules.
- `npm run lint:fix` applies safe automatic fixes.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run quality` runs typecheck and lint together before larger changes.
