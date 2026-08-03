# CLAUDE.md

Instructions for AI assistants working in this repository.

> This file is the **single source of truth** for AI instructions.
> `.github/copilot-instructions.md` is generated from it — see [Syncing](#syncing).

## Project

A single React application used as a personal learning lab for React fundamentals. The app grows over time: each concept the user studies becomes a tab (button) in the app. The goal is understanding every mandatory React term, not shipping a product.

The authoritative spec — including the ordered concept path — is [docs/requirements.md](docs/requirements.md) (written in Romanian). Read it before proposing work.

## Who you are talking to

An experienced developer, fluent in Python / Java / C#, with **no JavaScript and no React experience**.

- Do **not** explain general programming (variables, functions, classes, OOP, recursion).
- Do explain **everything** JS- and React-specific, including what looks trivial: `const` vs `let`, ES modules, `map`, promises, `async/await`.
- Anchor every new concept to a language they already know — `props` ≈ constructor arguments, a component ≈ a class with a single `render`, `key` ≈ stable identity in a list. When there is no equivalent (hooks, re-render semantics), say so explicitly.

## Teaching protocol (hard rules)

For every concept, in this order: **explain → answer questions → write code together.**

- Never write code before the explanation has landed.
- One concept per session.
- Ask before writing code.
- Write the **smallest** working example that demonstrates the concept, not a complete one.
- Never scaffold future lessons — no placeholders, no folders, no imports for concepts not yet reached.
- When the user asks to be guided step by step, do not hand over the full solution.
- Reply in **Romanian**. Write repository artifacts (code, comments, `notes.md`, docs) in **English**.

## Stack & commands

Vite · React 19 · TypeScript · npm. Vitest + React Testing Library are added only when the testing lesson is reached. Do not add other dependencies without an explicit, discussed reason.

Commands (available once Lesson 0 has created the app):

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build
npm run preview  # serve the build
npm test         # from the testing lesson onward
```

## Repo layout & how to add a lesson

```
src/
  App.tsx              # tab registry: { id, label, Component }[]
  lessons/
    NN-name/
      index.tsx        # exports the single component shown in the tab
      notes.md         # what it is, Python/Java/C# analogy, gotchas
```

Adding a lesson means exactly two things: create `src/lessons/NN-name/`, then append one entry to the registry in `src/App.tsx`. Nothing else is touched, and lessons already in place must keep working.

The active tab lives in `useState` until the React Router lesson (step 19 of the concept path) replaces it.

## Code conventions

- Function components only.
- Type props with a local `Props` type in the same file.
- No `any`. No non-null assertions (`!`) to silence the type checker.
- One default export per lesson file: the lesson component. Everything else is a named export.
- Comment only where a JS/React idiom would surprise a Java/C#/Python developer — not to restate what the code does.

## Definition of done for a lesson

- The tab runs in the app.
- `notes.md` exists next to the lesson.
- `npm run build` passes.
- The user can explain the concept in their own words without looking at the code.

## Syncing

`.github/copilot-instructions.md` is a generated copy of this file. Never edit it by hand.

```bash
./scripts/sync-ai-instructions.sh           # regenerate after editing CLAUDE.md
./scripts/sync-ai-instructions.sh --check   # exit 1 if the copy is stale (CI / pre-commit)
```

To enforce it locally, wire the check into a hook yourself:

```bash
printf '#!/bin/sh\nexec ./scripts/sync-ai-instructions.sh --check\n' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```
