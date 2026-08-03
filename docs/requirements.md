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
- npm
- Vitest + React Testing Library (doar de la lecția de testare)

Nu se adaugă alte dependențe fără un motiv explicit, discutat.

## 5. Arhitectura aplicației

O singură aplicație, cu un rând de butoane (tab-uri) — câte unul pentru fiecare concept studiat.

- `src/App.tsx` conține un registru de tab-uri: `{ id, label, Component }[]`.
- Tab-ul activ este ținut inițial în `useState`; migrarea la React Router este ea însăși o lecție ulterioară (§6, pasul 19).
- Fiecare concept trăiește în `src/lessons/NN-nume/`:
  - `index.tsx` — exportă o singură componentă, cea afișată în tab.
  - `notes.md` — notițe scurte despre concept.
- Adăugarea unei lecții = un director nou + o singură intrare adăugată în registru. Nimic altceva nu se modifică.
- Lecțiile deja existente trebuie să rămână funcționale pe măsură ce aplicația crește.

## 6. Traseul conceptelor

Listă ordonată, ajustabilă pe parcurs. Acesta este singurul loc unde traseul este definit; `README.md` și `CLAUDE.md` trimit aici.

0. Setup & tooling: Node, npm, Vite, configurația TS, dev server, structura proiectului
1. JavaScript pentru React: `let`/`const`, funcții arrow, module ES (`import`/`export`), `map`/`filter`/`reduce`, destructurare, spread/rest, template literals, optional chaining, valori „truthy/falsy”, promisiuni și `async/await`
2. TypeScript pentru React: `type` vs `interface`, uniuni, tipuri literale, generice (la suprafață), tiparea props-urilor și a evenimentelor
3. JSX și randare
4. Componente și `props`
5. Randare condiționată
6. Liste și `key`
7. Evenimente și handlere
8. Stare cu `useState`
9. Formulare și input-uri controlate
10. Compoziție: `children`, ridicarea stării (lifting state up)
11. `useEffect` și cleanup
12. Aducerea datelor (fetch): stările loading / error / success
13. `useRef` și accesul la DOM
14. Comportamentul de randare: `React.memo`, `useMemo`, `useCallback`
15. `useReducer`
16. `Context` pentru stare partajată
17. Hooks proprii (custom hooks)
18. Error boundaries și `Suspense` (introducere)
19. Rutare cu React Router (înlocuiește tab-ul ținut manual în `useState`)
20. Stilizare: CSS Modules
21. Testare: Vitest + React Testing Library
22. Build și noțiuni de deploy

## 7. Definiția de „lecție terminată”

O lecție este terminată când:

- tab-ul corespunzător rulează în aplicație;
- există `notes.md` lângă lecție: ce este conceptul, analogia cu Python/Java/C#, capcane;
- `npm run build` trece fără erori;
- conceptul poate fi explicat cu propriile cuvinte, fără să te uiți în cod.

## 8. Cerințe non-funcționale

- `CLAUDE.md` și `.github/copilot-instructions.md` nu au voie să divergă; sincronizarea este impusă de script (`scripts/sync-ai-instructions.sh`).
- Commit-uri mici, unul per lecție (sau mai mici).
- Limbă: conversația în română; codul, comentariile și notițele din repo în engleză.

## 9. În afara scopului

- Backend, bază de date, autentificare
- Deploy ca produs real
- Librării de state management (Redux, Zustand, MobX)
- Librării de UI (MUI, Chakra, shadcn)
- SSR / Next.js
