# Cerințe

## 1. Scop

O singură aplicație React folosită ca laborator personal de învățare. Scopul nu este să livrăm un produs, ci să parcurgem și să înțelegem **toți termenii obligatorii** pentru a putea scrie aplicații React de la zero.

Fiecare concept studiat devine un tab în aplicație, iar aplicația crește pe măsură ce avansăm.

## 2. Public țintă

Developeri cu experiență în alte limbaje (Python, Java, C#), **fără experiență în JavaScript și React**.

Consecințe directe:

- Nu se explică noțiuni generale de programare (variabile, funcții, clase, recursivitate, OOP).
- Se explică **tot** ce ține de JavaScript și React, inclusiv lucruri care par banale (`const` vs `let`, module ES, `map`, promisiuni).
- Fiecare concept nou primește o analogie cu un limbaj deja cunoscut. Exemple: `props` ≈ argumente de constructor, componentă ≈ clasă cu un singur `render`, `key` ≈ identitate stabilă într-o listă. Când nu există echivalent (hooks, re-render), se spune explicit că nu există.

## 3. Mod de lucru (regula centrală)

Ordinea este obligatorie, pentru fiecare concept:

1. **Explicație** — ce este, de ce există, ce problemă rezolvă, analogia cu Python/Java/C#.
2. **Întrebări** — clarificăm până conceptul e clar.
3. **Cod scris împreună** — exemplul minim care demonstrează conceptul.

Reguli:

- **Nu** se generează cod înainte de explicație.
- **Un singur concept** pe sesiune.
- Se cere confirmarea înainte de a scrie cod.
- Se scrie exemplul **minim** funcțional, nu unul „complet”.
- **Nu** se pregătesc în avans lecții viitoare (fără schelet pentru concepte neajunse).
- Când se cere ghidare pas cu pas, **nu** se livrează soluția completă.

## 4. Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS v4 (de la pasul 9; utility-first + tokeni de temă, fără `tailwind.config.js`)
- shadcn/ui (de la pasul 10; nu e o dependență npm — componentele sunt **copiate** în `src/components/ui/`)
- npm
- Vitest + React Testing Library (doar de la lecția de testare)

Nu se adaugă alte dependențe fără un motiv explicit, discutat.

## 5. Arhitectura aplicației

O singură aplicație care crește pas cu pas: fiecare concept studiat devine un demo nou.

> Revizuit după versiunea inițială. Detaliile complete și obligatorii sunt în [CLAUDE.md](../CLAUDE.md) — acolo este sursa de adevăr pentru structură.

- `src/App.tsx` este doar un shell: ține registrul `type Demo = { id: string; step: number; title: string; element: ReactNode }` + `const demos: Demo[]`, pasul activ în `useState` și `const active = demos.find(d => d.id === activeId) ?? demos[0]`. Nu conține cod de demo.
- Shell-ul randează titlul `Pas N — Titlu`; demo-ul randează doar conținutul lui.
- Fiecare concept trăiește într-un fișier propriu: `src/demos/<Concept>.tsx` (ex. `Counter.tsx`, `Timer.tsx`).
- Restul structurii: `src/components/` (partajat între pași), `src/hooks/` (un hook per fișier), `src/context/` (un provider + hook-ul lui, per fișier), `src/lib/` (helperi mici).
- Adăugarea unui pas = un fișier nou în `src/demos/` + o singură intrare în registru. Nimic altceva nu se modifică.
- Importurile interne folosesc aliasul `@/` = `src/`, declarat în două locuri ținute sincron: `paths` în `tsconfig.app.json` (TypeScript + IDE) și `resolve.alias` în `vite.config.ts` (bundler). Importurile relative rămân doar pentru frați din același folder (`./Sibling`).
- Pasul activ a trăit în `useState` în `App.tsx` până la pasul 12, când a urcat în `src/context/ActiveStepProvider.tsx` (context + `localStorage`); consumatorii îl citesc cu `useActiveStep()`, fără props. Meniul de navigare se derivă din lista de pași primită din context; migrarea la React Router rămâne o lecție ulterioară.
- Pașii deja existenți trebuie să rămână funcționali pe măsură ce aplicația crește.

## 6. Traseul conceptelor

Listă ordonată, ajustabilă pe parcurs.

- [x] Pas 1 — Structura proiectului (shell + registru de demo-uri)
- [x] Pas 2 — useState (funcțional + varianta cu clasă)
- [x] Pas 3 — Funcții pure vs impure în context React
- [x] Pas 4 — Prettier + format on save (configurare proiect)
- [x] Pas 5 — useEffect și cleanup (Timer)
- [x] Pas 6 — Lifting state up (o singură sursă de adevăr, componentă controlată)
- [x] Pas 7 — Liste: `map` și `key` (meniul de navigare)
- [x] Pas 8 — Alias de cale `@/` (importuri stabile, independente de adâncime)
- [x] Pas 9 — Tailwind CSS v4: utility-first + tokeni de temă (`@theme inline`, dark mode pe clasa `.dark`)
- [x] Pas 10 — shadcn/ui: componente copiate în proiect, variante cu `cva`, `cn()` pentru conflicte de clase
- [x] Pas 11 — Hooks custom (`useCounter`, `useWindowSize`): o funcție cu nume `use*`, o instanță de stare per APEL
- [x] Pas 12 — Context API + un hook custom peste context (`ActiveStepProvider` / `useActiveStep`): o singură sursă partajată, contra-exemplul pasului 11. Include persistarea pasului activ în `localStorage`.
- [ ] Pas 13 — Randare condiționată (`&&`, ternar, early return)
- [ ] Pas 14 — Formulare și input-uri controlate
- [ ] Pas 15 — Componente de compoziție (`children`, `asChild`, slot-uri)
- [ ] Pas 16 — `useReducer`: mai multe câmpuri de stare care se schimbă împreună, mutate într-o singură funcție de tranziție

## 7. Definiția de „lecție terminată”

O lecție este terminată când:

- demo-ul rulează în aplicație, ajuns acolo prin registru;
- fișierul din `src/demos/` începe cu comentariul-antet `// Pas N — <concept>.` care explică **de ce** există pasul, nu doar ce face;
- `App.tsx` a crescut cu exact o intrare în registru;
- `npm run build` trece fără erori;
- conceptul poate fi explicat cu propriile cuvinte, fără să te uiți în cod.

## 8. Cerințe non-funcționale

- `CLAUDE.md` și `.github/copilot-instructions.md` nu au voie să divergă; sincronizarea este impusă de script (`scripts/sync-ai-instructions.sh`).
- Commit-uri mici, unul per pas, cu mesaj de forma `pas 2 — useState (Counter)`. Fiecare pas trebuie să poată fi revenit individual.
- Limbă: conversația în română; comentariile din `src/` în română (sunt notițe de învățare); identificatorii, numele de fișiere și documentația (`docs/`, `README.md`) în engleză.

## 9. În afara scopului

- Backend, bază de date, autentificare
- Deploy ca produs real
- Librării de state management (Redux, Zustand, MobX)
- Librării de componente UI ca dependență opacă (MUI, Chakra) — componenta stă în `node_modules` și o poți doar configura prin API-ul expus.
  - Excepție decisă la pasul 10: **shadcn/ui**, tocmai pentru că nu este o astfel de dependență. Comanda copiază codul sursă în `src/components/ui/`, unde rămâne al nostru — lizibil, modificabil, versionat în git. Din `node_modules` vin doar utilitare (`radix-ui`, `cva`, `clsx`, `tailwind-merge`, `lucide-react`).
  - Tailwind nu intră aici: nu livrează componente, ci doar utilitare CSS și un set fix de tokeni.
- SSR / Next.js
