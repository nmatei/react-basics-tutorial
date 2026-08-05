# CLAUDE.md

Instructions for AI assistants working in this repository.

> This file is the **single source of truth** for AI instructions.
> `.github/copilot-instructions.md` is generated from it — see [Syncing](#syncing).

## Project

A single React application used as a personal learning lab for React fundamentals. The app grows over time: each concept the user studies becomes one step (one demo) in the app. The goal is understanding every mandatory React term, not shipping a product.

The ordered concept path lives in [docs/requirements.md](docs/requirements.md) (written in Romanian). Read it before proposing work. Where that document and the [Repo layout](#repo-layout) section below disagree, **this file wins** — the layout was revised after `requirements.md` was written.

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
- Never scaffold future lessons — no placeholder files, no imports for concepts not yet reached.
- When the user asks to be guided step by step, do not hand over the full solution.
- Reply in **Romanian**.

## Stack & commands

Vite · React 19 · TypeScript · npm. Vitest + React Testing Library are added only when the testing lesson is reached. Do not add other dependencies without an explicit, discussed reason.

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build
npm run preview  # serve the build
npm test         # from the testing lesson onward
```

## Repo layout

Every kind of code has exactly one destination, decided before the code is written:

```
src/
  App.tsx        # shell: the demo REGISTRY + the active demo. Stays short.
  demos/         # ONE FILE PER STEP — Counter.tsx, Timer.tsx, ...
  components/    # components shared between steps
  hooks/         # one custom hook per file
  context/       # one provider + its consumer hook, per file
  lib/           # small helpers — pure functions, no JSX
  assets/        # images, svg
```

These folders exist from the start, deliberately. Creating a folder is not scaffolding a lesson; creating a *file* for a concept not yet reached is, and stays forbidden.

Rules that keep this from collapsing back into one big file:

- A demo never lives in `App.tsx`. Not even a small one.
- A file in `demos/` is named after the concept it demonstrates (`Counter.tsx`, `Timer.tsx`), not after the step number.
- Code shared by two steps moves to `components/`, `hooks/` or `lib/` — it is not copy-pasted, and it is not left in the first demo for the second one to import.

## The registry in App.tsx

`App.tsx` is a shell. It holds the list of demos, never their content:

```ts
type Demo = { id: string; step: number; title: string; element: ReactNode }

const demos: Demo[] = [
  { id: 'counter', step: 2, title: 'useState', element: <Counter /> },
]
```

plus the active id in state, and the lookup:

```ts
const [activeId] = useState('counter')
const active = demos.find((d) => d.id === activeId) ?? demos[0]
```

The `?? demos[0]` fallback exists so `active` is never `undefined` — that is what lets us avoid a non-null assertion (`!`), which is banned.

The setter is intentionally not destructured yet: `noUnusedLocals` would fail the build, and nothing can call it until the navigation menu exists. Until then, switching steps means editing the initial id. Add `setActiveId` in the same commit as the menu, not before.

- **Adding a step = one new file in `src/demos/` + one new entry in `demos`. Nothing else changes.**
- The shell renders the heading `Pas N — Titlu` from `active.step` / `active.title`. A demo renders **only its own content** and never its own title.
- Steps already in place must keep working as the app grows.
- `App.tsx` must stay short. Past ~100 lines, something in it belongs in `components/`.
- The navigation menu is built later, once there are enough demos to justify it. Until then the registry alone is enough — building it now would need `map` and `key`, concepts the user has not reached.
- Registry slot 1 is the Vite landing page, which demonstrates no concept: it lives in `components/Welcome.tsx`, not in `demos/`. Every other entry points at a file in `demos/`.
- The active step lives in `useState` until the React Router lesson (step 19) replaces it.

## Code conventions

- Function components only.
- Type props with a local `Props` type in the same file.
- No `any`. No non-null assertions (`!`) to silence the type checker.
- Named exports only — `export function Counter()`. No `export default` anywhere in `src/`, with one exception: `App.tsx`, which `main.tsx` imports as a default (Vite template).
- Identifiers, file names, `docs/` and `README.md` are in **English**.

### Comments

Comments in `src/` are in **Romanian** — they are the user's learning notes, not production documentation.

Every file in `demos/` opens with a header comment: the step line, then a few lines on **why this step exists** — which problem the concept solves — not a restatement of what the code does.

```tsx
// Pas 2 — useState.
// De ce: o variabila normala se pierde la fiecare re-render, iar React nu afla
// ca s-a schimbat ceva. useState da valorii o identitate care supravietuieste
// re-render-ului si, in acelasi timp, cere lui React sa redeseneze.
// Capcana: setState nu modifica variabila pe loc — la randarea urmatoare
// primesti valoarea noua.
```

Inside the code, comment only where a JS/React idiom would surprise a Java/C#/Python developer, and say **why** it is written that way. Do not narrate lines that already read clearly.

## Definition of done for a step

- The demo runs in the app, reachable from the registry.
- The file lives in `src/demos/`, opens with the `// Pas N — <concept>.` header, and renders no title of its own.
- `App.tsx` grew by exactly one registry entry.
- `npm run build` passes.
- The user can explain the concept in their own words without looking at the code.

## Commits

One commit per step, message in the form:

```
pas 2 — useState (Counter)
```

Never fold two steps into one commit — each step must stay individually revertable.

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
