// Shell-ul aplicatiei: tine registrul de demo-uri si pasul activ, niciodata
// codul unui demo. Un pas nou = un fisier in src/demos/ + o intrare in `demos`.
// Meniul nu se mai scrie de mana: se DERIVA din registru cu `map`, deci creste
// singur la fiecare intrare noua.

import { useState, type ReactNode } from "react";
// De la pasul 8, importurile interne folosesc aliasul @/ = src/. Din acest
// fisier diferenta e cosmetica (e chiar in radacina lui src), dar castigul e ca
// aceleasi linii raman valide oriunde le-ai muta.
import "@/App.css";
import { DemoTab } from "@/components/DemoTab";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Welcome } from "@/components/Welcome";
import { Counter } from "@/demos/Counter";
import { CounterClass } from "@/demos/CounterClass";
import { DemoMenu } from "@/demos/DemoMenu";
import { LiftingState } from "@/demos/LiftingState";
import { PathAlias } from "@/demos/PathAlias";
import { PrettierFormat } from "@/demos/PrettierFormat";
import { PureFunctions } from "@/demos/PureFunctions";
import { ShadcnSetup } from "@/demos/ShadcnSetup";
import { TailwindSetup } from "@/demos/TailwindSetup";
import { Timer } from "@/demos/Timer";

// ReactNode = orice poate fi randat (element, text, null). `element` chiar tine
// un element JSX, adica descrierea deja construita a demo-ului.
type Demo = { id: string; step: number; title: string; element: ReactNode };

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
  { id: "shadcn-setup", step: 10, title: "shadcn/ui — componente copiate în proiect", element: <ShadcnSetup /> }
];

function App() {
  // Singura sursa de adevar a navigarii: ID-ul activ, un string. Se pierde la
  // refresh — useState traieste in memoria paginii, nu pe disc.
  const [activeId, setActiveId] = useState("shadcn-setup");

  // `?? demos[0]` face ca `active` sa nu fie niciodata undefined — asa evitam
  // `!` (non-null assertion), care e interzis in acest proiect. Demo-ul activ e
  // DERIVAT din id, nu tinut inca o data in state.
  const active = demos.find(d => d.id === activeId) ?? demos[0];

  return (
    <>
      {/* `key` e citit de React ca sa potriveasca elementele intre doua randari;
          NU ajunge in DemoTab ca prop. Daca ai nevoie de id si inauntru, il pasezi
          separat. */}
      {/* Pas 10 — containerul meniului a trecut si el de la obiectul `style` la
          utilitare. `items-center` tine butonul de tema aliniat cu tab-urile, care
          sunt mai mici (size="sm"). */}
      <nav className="flex flex-wrap items-center justify-center gap-3 px-4 py-6">
        {demos.map(d => (
          <DemoTab
            key={d.id}
            //step={d.step % 2 === 0 ? d.step : undefined}
            step={d.step}
            title={d.title}
            active={d.id === active.id}
            // Arrow function, nu `onSelect={setActiveId(d.id)}`: al doilea ar APELA
            // setter-ul in timpul randarii. Pasezi ce sa se intample la click.
            onSelect={() => setActiveId(d.id)}
          />
        ))}

        {/* Tema e a intregii aplicatii, deci comutatorul sta in shell, nu intr-un
            demo. Nu primeste niciun prop: isi tine singur starea si scrie clasa pe
            <html>, iar tokenii fac restul. */}
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

export default App;
