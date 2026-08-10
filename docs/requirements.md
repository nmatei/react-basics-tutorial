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

O singură aplicație care crește pas cu pas: fiecare concept studiat devine un demo nou.

> Revizuit după versiunea inițială. Detaliile complete și obligatorii sunt în [CLAUDE.md](../CLAUDE.md) — acolo este sursa de adevăr pentru structură.

- `src/App.tsx` este doar un shell: ține registrul `type Demo = { id: string; step: number; title: string; element: ReactNode }` + `const demos: Demo[]`, pasul activ în `useState` și `const active = demos.find(d => d.id === activeId) ?? demos[0]`. Nu conține cod de demo.
- Shell-ul randează titlul `Pas N — Titlu`; demo-ul randează doar conținutul lui.
- Fiecare concept trăiește într-un fișier propriu: `src/demos/<Concept>.tsx` (ex. `Counter.tsx`, `Timer.tsx`).
- Restul structurii: `src/components/` (partajat între pași), `src/hooks/` (un hook per fișier), `src/context/` (un provider + hook-ul lui, per fișier), `src/lib/` (helperi mici).
- Adăugarea unui pas = un fișier nou în `src/demos/` + o singură intrare în registru. Nimic altceva nu se modifică.
- Pasul activ este ținut inițial în `useState`; migrarea la React Router este ea însăși o lecție ulterioară (§6, pasul 19). Meniul de navigare se construiește când există suficiente demo-uri.
- Pașii deja existenți trebuie să rămână funcționali pe măsură ce aplicația crește.

## 6. Traseul conceptelor

Listă ordonată, ajustabilă pe parcurs.

- [x] Pas 1 — Structura proiectului (shell + registru de demo-uri)
- [x] Pas 2 — useState (funcțional + varianta cu clasă)
- [x] Pas 3 — Funcții pure vs impure în context React
- [x] Pas 4 — Prettier + format on save (configurare proiect)
- [ ] Pas 5 — randare listă cu `map` și `key` (fundamentul meniului de pași)

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
- Librării de UI (MUI, Chakra, shadcn)
- SSR / Next.js
