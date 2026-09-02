// Pas 12 — Context API, vazut din partea consumatorului.
// De ce exista demo-ul: contextul se intelege abia cand vezi ca ACEEASI valoare e
// scrisa din doua locuri care nu se cunosc intre ele. Nu inventam un context de
// jucarie — folosim chiar contextul din care traieste aplicatia: pasul activ.
// Ce demonstreaza, in ordine:
//  1. valoarea a ajuns aici FARA niciun prop (paragraful de sus se schimba cand dai
//     click in meniul din header);
//  2. <select>-ul de mai jos e un al DOILEA meniu, de alt tip si in alta parte a
//     arborelui, care nu stie nimic despre butoanele din header — dar scrie in
//     aceeasi stare, pentru ca amandoua o iau din acelasi provider;
//  3. coloana din dreapta e contra-exemplul: doua apeluri useCounter (Pas 11) sunt
//     complet independente. Context = o sursa unica, partajata. Hook custom cu
//     useState = o fabrica, o instanta noua la fiecare apel.
// Capcana pe care o inchide etapa 3: daca ai randa ContextDemo in afara
// provider-ului, useActiveStep() arunca imediat, cu mesaj — nu returneaza tacut
// undefined.

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import { useActiveStep } from "@/context/ActiveStepProvider";
import { useCounter } from "@/hooks/useCounter";

// Reteta, pe codul real din src/context/ActiveStepProvider.tsx. String la nivel de
// modul: nu depinde de nimic din randare, deci nu are ce cauta in componenta.
const RETETA = `// 1. canalul — default undefined, ca sa putem prinde folosirea fara provider
const ActiveStepContext = createContext<ActiveStepContextValue | undefined>(undefined);

// 2. provider-ul — el TINE starea (useState + localStorage) si o pune pe canal
export function ActiveStepProvider({ steps, children }: Props) {
  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return steps.find(s => s.id === saved)?.id ?? steps[0].id;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeId);
  }, [activeId]);

  return (
    <ActiveStepContext.Provider value={{ activeId, setActiveId, steps }}>
      {children}
    </ActiveStepContext.Provider>
  );
}

// 3. hook-ul de consum — plasa de siguranta
export function useActiveStep() {
  const ctx = useContext(ActiveStepContext);
  if (ctx === undefined) {
    throw new Error("useActiveStep() a fost apelat in afara unui <ActiveStepProvider>.");
  }
  return ctx;
}

// 4. wrap-ul, in App.tsx — provider-ul TREBUIE sa fie DEASUPRA consumatorilor
<ActiveStepProvider steps={demos}>
  <Shell />
</ActiveStepProvider>

// 5. consumul, oriunde in arbore, la orice adancime — zero props
const { activeId, setActiveId, steps } = useActiveStep();`;

export function ContextDemo() {
  // Consumul propriu-zis. Componenta asta nu primeste niciun prop: se "aboneaza"
  // singura la cea mai apropiata valoare de pe canal, urcand in arbore pana la
  // primul <ActiveStepProvider>.
  const { activeId, setActiveId, steps } = useActiveStep();

  // Contra-exemplul: doua apeluri ale aceleiasi functii → doua stari separate.
  const copii = useCounter(0, 1);
  const adulti = useCounter(0, 1);

  return (
    <div className="mx-auto max-w-3xl text-left">
      <p className="text-muted-foreground text-sm">
        Pasul activ, citit aici cu <code>useActiveStep()</code>: <code>{activeId}</code>. Nicio componenta de pe drum nu
        l-a pasat mai departe — si ramane la fel dupa refresh (<code>localStorage</code>).
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="bg-card text-card-foreground rounded-xl border p-6">
          <h2 className="font-semibold">GLOBAL — useContext</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Al doilea meniu, alt tip, alta ramura a arborelui. Nu stie ca exista butoanele din header, dar scrie exact
            aceeasi valoare.
          </p>

          {/* Optiunile sunt DERIVATE din `steps`, care vine tot din context: lista de
              pasi calatoreste pe acelasi canal ca valoarea activa. */}
          <select
            className="border-input bg-background focus-visible:ring-ring mt-4 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            value={activeId}
            // e.target.value e string-ul din <option value=...>, adica id-ul pasului.
            onChange={e => setActiveId(e.target.value)}
          >
            {steps.map(s => (
              <option key={s.id} value={s.id}>
                Pas {s.step} — {s.title}
              </option>
            ))}
          </select>

          <p className="text-muted-foreground mt-4 text-sm">
            Alege alt pas: se schimba si tab-ul activ din header, si ecranul. O singura sursa, doi scriitori.
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-xl border p-6">
          <h2 className="font-semibold">LOCAL — useState (Pas 11)</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Doua apeluri <code>useCounter(0, 1)</code>, aceeasi functie. Fiecare apel isi are propriul{" "}
            <code>useState</code>.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm">Copii: {copii.count}</span>
            <Button size="sm" onClick={copii.increment}>
              +1
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm">Adulti: {adulti.count}</span>
            <Button size="sm" onClick={adulti.increment}>
              +1
            </Button>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            Apasa +1 la copii: adultii nu se misca. Se partajeaza codul, nu valoarea — invers decat in stanga.
          </p>
        </div>
      </div>

      <h2 className="mt-8 font-semibold">Reteta, in 5 etape</h2>
      <p className="text-muted-foreground mt-1 mb-3 text-sm">
        Codul real din <code>src/context/ActiveStepProvider.tsx</code>, plus wrap-ul din <code>App.tsx</code>.
      </p>
      <CodeBlock>{RETETA}</CodeBlock>
    </div>
  );
}
