// Shell-ul aplicatiei: tine registrul de demo-uri, niciodata codul unui demo.
// Un pas nou = un fisier in src/demos/ + o intrare in `demos`.
// Pas 12: `activeId` NU mai sta aici. A urcat intr-un provider, deci App nu mai
// paseaza nimic in jos — fiecare consumator isi ia singur ce-i trebuie.

import type { ReactNode } from "react";
// De la pasul 8, importurile interne folosesc aliasul @/ = src/. Din acest
// fisier diferenta e cosmetica (e chiar in radacina lui src), dar castigul e ca
// aceleasi linii raman valide oriunde le-ai muta.
import "@/App.css";
import { DemoTab } from "@/components/DemoTab";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Welcome } from "@/components/Welcome";
import { ActiveStepProvider, useActiveStep, type Step } from "@/context/ActiveStepProvider";
import { ContextDemo } from "@/demos/ContextDemo";
import { Counter } from "@/demos/Counter";
import { CounterClass } from "@/demos/CounterClass";
import { CustomHooks } from "@/demos/CustomHooks";
import { DemoMenu } from "@/demos/DemoMenu";
import { LiftingState } from "@/demos/LiftingState";
import { PathAlias } from "@/demos/PathAlias";
import { PrettierFormat } from "@/demos/PrettierFormat";
import { PureFunctions } from "@/demos/PureFunctions";
import { ShadcnSetup } from "@/demos/ShadcnSetup";
import { TailwindSetup } from "@/demos/TailwindSetup";
import { Timer } from "@/demos/Timer";

// `Step` (id + step + title) e forma ceruta de provider; shell-ul mai adauga ce
// randeaza. `&` e intersectia de tipuri din TypeScript: "tot din Step, plus asta".
// ReactNode = orice poate fi randat (element, text, null). `element` chiar tine
// un element JSX, adica descrierea deja construita a demo-ului.
type Demo = Step & { element: ReactNode };

const demos: Demo[] = [
  { id: "welcome", step: 1, title: "Structura proiectului", element: <Welcome /> },
  { id: "counter", step: 2, title: "useState", element: <Counter /> },
  { id: "counter-class", step: 2, title: "useState — varianta veche, cu clasa", element: <CounterClass /> },
  { id: "pure-functions", step: 3, title: "Funcții pure", element: <PureFunctions /> },
  { id: "prettier-format", step: 4, title: "Prettier și formatare automată", element: <PrettierFormat /> },
  { id: "timer", step: 5, title: "useEffect și cleanup", element: <Timer /> },
  { id: "lifting-state", step: 6, title: "Lifting state up", element: <LiftingState /> },
  { id: "demo-menu", step: 7, title: "Liste: map și key", element: <DemoMenu /> },
  { id: "path-alias", step: 8, title: "Alias de cale @/", element: <PathAlias /> },
  { id: "tailwind-setup", step: 9, title: "Tailwind CSS și tokeni de temă", element: <TailwindSetup /> },
  { id: "shadcn-setup", step: 10, title: "shadcn/ui — componente copiate în proiect", element: <ShadcnSetup /> },
  { id: "custom-hooks", step: 11, title: "Hooks custom", element: <CustomHooks /> },
  { id: "context", step: 12, title: "Context API", element: <ContextDemo /> }
];

// Consumatorul e un component SEPARAT, si asta nu e cosmetic: provider-ul trebuie
// sa fie DEASUPRA consumatorului in arbore. Daca App ar chema el useActiveStep(),
// ar cauta un provider mai sus decat cel pe care tot el il randeaza — si ar primi
// exact eroarea din etapa 3.
function Shell() {
  // Zero props. Ce era pana acum `useState` in App vine acum de pe canal.
  const { activeId, setActiveId, steps } = useActiveStep();

  // `?? demos[0]` face ca `active` sa nu fie niciodata undefined — asa evitam
  // `!` (non-null assertion), care e interzis in acest proiect. Demo-ul activ e
  // DERIVAT din id, nu tinut inca o data in state.
  const active = demos.find(d => d.id === activeId) ?? demos[0];

  return (
    <>
      {/* Meniul se deriva din `steps`, lista primita din context — nu din registrul
          local. Aceeasi lista o citeste si <select>-ul din demo-ul pasului 12. */}
      <nav className="flex flex-wrap items-center justify-center gap-3 px-4 py-6">
        {steps.map(s => (
          <DemoTab
            key={s.id}
            step={s.step}
            title={s.title}
            active={s.id === active.id}
            // Arrow function, nu `onSelect={setActiveId(s.id)}`: al doilea ar APELA
            // setter-ul in timpul randarii. Pasezi ce sa se intample la click.
            onSelect={() => setActiveId(s.id)}
          />
        ))}

        {/* Tema e a intregii aplicatii, deci comutatorul sta in shell, nu intr-un
            demo. Isi tine inca singur starea, cu useState: e exact candidatul
            urmator pentru aceeasi reteta (ThemeProvider + useTheme). */}
        <ThemeToggle />
      </nav>

      <main>
        <h1>
          Pas {active.step} — {active.title}
        </h1>
        {active.element}
      </main>
    </>
  );
}

// ETAPA 4 — wrap-ul. Tot ce e inauntru poate citi valoarea, la orice adancime;
// tot ce ar fi in afara, nu.
function App() {
  return (
    <ActiveStepProvider steps={demos}>
      <Shell />
    </ActiveStepProvider>
  );
}

export default App;
