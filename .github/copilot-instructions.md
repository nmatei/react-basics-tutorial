<!-- GENERATED FILE — DO NOT EDIT.
     Source: CLAUDE.md · Regenerate: ./scripts/sync-ai-instructions.sh -->

# CLAUDE.md

Instructions for AI assistants working in this repository.

> This file is the **single source of truth** for AI instructions.
> `.github/copilot-instructions.md` is generated from it — see [Syncing](#syncing).

## Project

A single React application used as a personal learning lab for React fundamentals. The app grows over time: each concept the user studies becomes one step (one demo) in the app. The goal is understanding every mandatory React term, not shipping a product.

The ordered concept path lives in [docs/requirements.md](docs/requirements.md) (written in Romanian). Once a concept is reached update docs/requirements.md to mark it as done, and add a new concept at the end of the list.

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

Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · npm. Vitest + React Testing Library are added only when the testing lesson is reached. Do not add other dependencies without an explicit, discussed reason.

```bash
npx shadcn@latest add <name>   # copies a UI component into src/components/ui/
```

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
  components/ui/ # shadcn/ui components, COPIED here by the CLI — ours to edit, not hand-written
  hooks/         # one custom hook per file
  context/       # one provider + its consumer hook, per file
  lib/           # small helpers — pure functions, no JSX
  assets/        # images, svg
```

These folders exist from the start, deliberately. Creating a folder is not scaffolding a lesson; creating a _file_ for a concept not yet reached is, and stays forbidden.

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
const [activeId, setActiveId] = useState("counter");
const active = demos.find(d => d.id === activeId) ?? demos[0];
```

The `?? demos[0]` fallback exists so `active` is never `undefined` — that is what lets us avoid a non-null assertion (`!`), which is banned.

The single source of truth for navigation is the active **id**. The rest of the UI is derived from it — never keep both the list and the selected element in state.

- **Adding a step = one new file in `src/demos/` + one new entry in `demos`. Nothing else changes.**
- The shell renders the heading `Pas N — Titlu` from `active.step` / `active.title`. A demo renders **only its own content** and never its own title.
- Steps already in place must keep working as the app grows.
- `App.tsx` must stay short. Past ~100 lines, something in it belongs in `components/`.
- The navigation menu is a `<nav>` with `demos.map`, rendering one `DemoTab` per entry (`components/DemoTab.tsx`). It is derived from the registry, so a new step never touches it.
- Registry slot 1 is the Vite landing page, which demonstrates no concept: it lives in `components/Welcome.tsx`, not in `demos/`. Every other entry points at a file in `demos/`.
- The active step lives in `useState` until the React Router lesson (step 19) replaces it.

## Code conventions

- Function components only.
- Type props with a local `Props` type in the same file.
- No `any`. No non-null assertions (`!`) to silence the type checker.
- Named exports only — `export function Counter()`. No `export default` anywhere in `src/`, with one exception: `App.tsx`, which `main.tsx` imports as a default (Vite template).
- Identifiers, file names, `docs/` and `README.md` are in **English**.

### Import paths

**New code always imports internal modules through the `@/` alias — `@/` maps to `src/`.** Never write a new `../` import, and never write `../../` under any circumstance. Relative paths stay only for a sibling in the same folder (`./PriceCard`), where `./` carries the useful information that the file is right there.

```ts
import { DemoTab } from "@/components/DemoTab"; // yes
import { formatTime } from "@/lib/format"; // yes, from any depth
import { PriceCard } from "./PriceCard"; // yes — sibling
import { formatTime } from "../../lib/format"; // no
```

The alias is declared in **three** places that must be kept in sync by hand — they are read by three independent programs:

| File                | Key                                                                  | Read by                            | Breaks if missing                                  |
| ------------------- | -------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| `tsconfig.app.json` | `paths: { "@/*": ["./src/*"] }`                                      | TypeScript, and through it the IDE | editor shows `Cannot find module`, `tsc -b` fails  |
| `vite.config.ts`    | `resolve.alias: { "@": path.resolve(import.meta.dirname, "./src") }` | Vite / esbuild / Rollup            | dev and build fail with `Failed to resolve import` |
| `tsconfig.json`     | `paths: { "@/*": ["./src/*"] }`                                      | the shadcn CLI                     | `shadcn init` aborts with "No import alias found"  |

The root `tsconfig.json` compiles nothing (`"files": []`); its copy exists only because the shadcn CLI looks there and nowhere else. Adding another alias means editing all three. `baseUrl` is deliberately absent — deprecated in TypeScript 6, and `paths` resolves relative to the tsconfig without it. `import.meta.dirname`, not `__dirname` — the project is ESM and Vite 8 warns on the CommonJS form.

Everything the alias does **not** cover, so it isn't hunted for in the wrong place: `index.html`, `url()` inside CSS, and `tsconfig.node.json` (which only covers `vite.config.ts` itself).

### Styling

From step 9 onward, **new markup is styled with Tailwind utilities on theme tokens** — `bg-card`, `text-muted-foreground`, `bg-primary` — not with `style={...}` and not with new hand-written class names. Steps 1–8 keep their inline styles; they are not retrofitted, because their code is part of a lesson already learned.

- The tokens live in `src/index.css`: raw variables in `:root` / `.dark` (OKLCH), exposed as utilities through `@theme inline`. `inline` is what makes `bg-card` compile to `background: var(--card)` — without it the light value would be frozen in and dark mode would do nothing.
- Dark mode is the `.dark` class on `<html>`. No component ever reads the theme.
- A new color/spacing value is added as a token first, then used. An arbitrary value in square brackets — a raw hex or px inlined into a utility — is a smell, not a solution.
- Tailwind v4 has **no `tailwind.config.js`** — configuration is CSS (`@theme`), and the scanner reads source files as plain text, so a class name must appear literally (`` `bg-${color}` `` never works). The flip side: the scanner also reads Markdown, so an example class name written in prose really does end up compiled into the bundle. Describe such classes in words instead of spelling them out.
- `src/index.css` carries an unlayered `all: revert` rule for class-less `button` / `input` / `ul` / `li`, which shields steps 1–8 from Tailwind's Preflight reset. Do not delete it while those steps still rely on native element styling.
- The old shell theme (steps 1–8) uses prefixed variables — `--brand`, `--brand-bg`, `--brand-border`, `--shell-border`. The unprefixed names (`--accent`, `--border`, `--ring`, …) belong to the design-system tokens, because that is what generated components expect. Do not reintroduce a second `--accent`: CSS variables are a global namespace with no compiler, and the last `:root` in the file silently wins.

### UI components (from step 10)

Interactive UI is not hand-written. `<button className="…">` in new markup is a bug, not a shortcut — use `<Button>` from `@/components/ui/button`, whose variants carry hover, `focus-visible` ring and a real disabled state.

- `src/components/ui/` holds shadcn/ui components **copied** into the repo by `npx shadcn@latest add <name>`. They are ours: readable, editable, versioned. Re-running `add` overwrites them, so deliberate edits stay visible in git.
- shadcn/ui is not an npm dependency. What comes from `node_modules` is only utilities: `radix-ui` (behaviour + accessibility), `class-variance-authority` (typed variants), `clsx` + `tailwind-merge` (behind `cn()`), `lucide-react` (icons).
- Combine classes with `cn()` from `@/lib/utils` whenever a class list is conditional or passed in from outside — plain string concatenation loses to Tailwind's conflict resolution.
- State that is a _selection_ is expressed as a variant (`variant={active ? "default" : "secondary"}`), never as `disabled` and never as hand-written colour classes.
- An icon-only button needs an `aria-label`. The library supplies the mechanics, not the meaning.
- The `add` command reads `components.json`; the alias it validates lives in the root `tsconfig.json` (see the table above).

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
