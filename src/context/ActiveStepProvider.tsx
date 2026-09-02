// Pas 12 — Context API (+ hook custom peste context).
// De ce: pana acum pasul activ statea intr-un useState in App.tsx si cobora prin
// props. Merge cat timp arborele e plat; la primul <Layout> pus intre ele, doua
// componente care NU folosesc valoarea ar trebui totusi sa o transporte (prop
// drilling). In Java/C# ai scoate valoarea din lantul de apeluri cu un container
// DI sau cu un AsyncLocal. React nu are container, dar are Context: un canal pe
// arborele de componente, pe care un parinte pune o valoare, iar orice descendent
// o citeste direct, oricat de adanc, fara ca nivelurile intermediare sa stie.
// De retinut: contextul NU e state management si nu tine nimic. Starea ramane un
// useState obisnuit, aici in provider; contextul doar o transporta in jos.
// Contra-exemplul pasului 11: `useCounter()` partajeaza CODUL — fiecare apel isi
// face useState-ul lui. `useActiveStep()` partajeaza VALOAREA — toti consumatorii
// citesc aceeasi sursa. Se apeleaza identic, `useX()`, si se comporta invers.
// Aceeasi reteta se repeta la scara de app pentru orice valoare "de peste tot":
// ThemeProvider/useTheme pentru tema, CurrentStepProvider/useCurrentStep pentru
// pasul curent. Se schimba doar numele si tipul valorii, nu cele 5 etape.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Forma minima pe care provider-ul o cere unui "pas". Deliberat fara `element`:
// provider-ul nu trebuie sa stie ce randeaza aplicatia. App.tsx isi extinde tipul.
export type Step = { id: string; step: number; title: string };

// Ce vede un consumator: ce e activ, cu ce schimbi, si din ce lista alegi. `steps`
// sta in context tocmai ca orice componenta din arbore sa-si poata construi
// propriul meniu, fara sa primeasca lista prin props (vezi <select>-ul din demo).
type ActiveStepContextValue = {
  activeId: string;
  setActiveId: (id: string) => void;
  steps: Step[];
};

const STORAGE_KEY = "active-step-id";

// ETAPA 1 — canalul.
// Argumentul lui createContext e valoarea IMPLICITA, folosita doar cand nu exista
// niciun provider deasupra consumatorului. Punem `undefined` intentionat: un default
// "rezonabil" ({ activeId: "welcome", setActiveId: () => {} }) ar face ca o
// componenta uitata in afara provider-ului sa mearga — se randeaza, apesi butoane si
// nu se intampla nimic. Un bug tacut, fara stack trace. Cu `undefined` avem ce
// verifica la etapa 3.
const ActiveStepContext = createContext<ActiveStepContextValue | undefined>(undefined);

// `children` = ce a fost infasurat de acest component. Il tipam ca ReactNode, adica
// "orice se poate randa". E argumentul care face din provider un invelis, nu un
// component cu continut fix.
type ActiveStepProviderProps = { steps: Step[]; children: ReactNode };

// ETAPA 2 — provider-ul. Un component absolut normal: tine starea si o publica.
// Primeste `steps` ca PROP, nu importa registrul din App.tsx — asa ramane
// reutilizabil si nu creeaza un import circular cu shell-ul.
export function ActiveStepProvider({ steps, children }: ActiveStepProviderProps) {
  // Argumentul lui useState e o FUNCTIE, nu o valoare: "lazy initializer". React o
  // apeleaza o singura data, la montare. Daca am scrie useState(localStorage.getItem(...))
  // citirea s-ar face la FIECARE randare — rezultatul e ignorat, dar munca se face.
  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Validam fata de lista primita: daca un demo a fost sters sau redenumit, id-ul
    // vechi ramane pe disc si aplicatia ar porni pe un pas inexistent. `?.` + `??`
    // dau fallback-ul fara `!`, interzis in proiect.
    return steps.find(s => s.id === saved)?.id ?? steps[0].id;
  });

  // localStorage traieste IN AFARA React-ului, exact ca clasa .dark de la ThemeToggle:
  // cazul clasic de useEffect — sincronizezi lumea externa cu state-ul. Scrie la
  // fiecare schimbare, deci la refresh revii pe acelasi demo.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeId);
  }, [activeId]);

  return (
    // `value` e obiectul pe care il vad consumatorii. Atentie: e un obiect NOU la
    // fiecare randare a provider-ului, deci toti consumatorii se re-randeaza. Aici e
    // chiar ce vrem (se schimba pasul, se schimba ecranul); la un context citit de
    // sute de componente, aici ai pune useMemo.
    <ActiveStepContext.Provider value={{ activeId, setActiveId, steps }}>{children}</ActiveStepContext.Provider>
  );
}

// ETAPA 3 — hook-ul de consum, cu plasa de siguranta.
// De ce un hook si nu useContext(ActiveStepContext) direct in fiecare componenta:
// contextul ramane privat (nu e exportat), numele e unul singur, iar verificarea de
// mai jos se scrie o data, nu la fiecare consumator.
// Nota de lint: react-refresh/only-export-components cere ca un fisier sa exporte
// DOAR componente, ca Fast Refresh sa poata inlocui componenta in pagina fara sa
// reincarce tot modulul (si sa piarda starea). Aici incalcam regula in mod
// deliberat: conventia proiectului e "un provider + hook-ul lui, per fisier", iar
// cele 5 etape trebuie sa se vada intr-un singur loc. Costul e mic — la editarea
// ACESTUI fisier, HMR reincarca modulul si starea provider-ului o ia de la capat;
// dar tocmai am pus-o in localStorage, deci revii pe acelasi pas.
// eslint-disable-next-line react-refresh/only-export-components
export function useActiveStep() {
  const ctx = useContext(ActiveStepContext);

  // Aruncam in loc sa returnam undefined: primesti eroarea la prima randare, cu
  // numele mecanismului in mesaj, in loc sa depanezi o ora un buton care nu face
  // nimic. Bonus de tipuri: dupa `throw`, TypeScript stie pe restul functiei ca `ctx`
  // nu mai poate fi undefined — deci consumatorii nu au nevoie de `?.` sau de `!`.
  if (ctx === undefined) {
    throw new Error("useActiveStep() a fost apelat in afara unui <ActiveStepProvider>.");
  }

  return ctx;
}
