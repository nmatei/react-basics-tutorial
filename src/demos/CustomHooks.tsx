// Pas 11 — hooks custom.
// De ce: aceeasi logica de stare aparea in mai multe locuri (numaratoarea, citirea
// dimensiunii ferestrei). In backend o extrageai intr-o clasa sau un serviciu.
// Echivalentul in React e un hook custom: o functie normala, cu numele inceput cu
// `use`, care poate chema alte hooks. Atat e regula — nimic altceva.
// Ce se vede aici: componenta a rămas SUBTIRE. Doua apeluri de hook, trei
// constante si JSX. Zero useState, zero useEffect scrise de mana.
// Ce se vede mai ales: fiecare APEL de hook are instanta LUI de stare. `copii` si
// `adulti` vin din aceeasi functie, dar sunt doua useState complet separate — +1 la
// copii nu atinge adultii. Deci un hook custom NU e un singleton injectat, e o
// fabrica: partajeaza codul, nu valoarea. (Varianta care chiar partajeaza o singura
// sursa e un hook custom peste Context — arata identic la apel, `useX()`, si se
// comporta invers. Vine la lectia de Context.)
// Capcana evitata aici: subtotalurile si totalul NU sunt useState. Sunt date
// DERIVATE, calculate la randare din cele doua countere. Un useState in plus ar fi
// a doua sursa de adevar, care iese din sinc la primul click uitat.

import { Button } from "@/components/ui/button";
import { useCounter } from "@/hooks/useCounter";
import { useWindowSize } from "@/hooks/useWindowSize";

// Constante la nivel de MODUL: nu se schimba niciodata, deci nu au ce sa caute in
// state. Scrise o data aici, nu "hardcodate" in JSX in doua-trei locuri.
const PRET_COPIL = 2;
const PRET_ADULT = 5;

// Componenta de PREZENTARE: zero stare proprie. Primeste numerele deja calculate si
// functiile pe care sa le apeleze la click. Starea rămâne sus, in CustomHooks, ca sa
// se poata calcula totalul grupului — exact lifting state up de la pasul 6.
type GrupBoxProps = {
  titlu: string;
  pretUnitar: number;
  persoane: number;
  subtotal: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onReset: () => void;
};

function GrupBox({ titlu, pretUnitar, persoane, subtotal, onDecrement, onIncrement, onReset }: GrupBoxProps) {
  // Nu putem avea persoane negative, deci -1 si Reset se dezactiveaza pe 0. Aici
  // `disabled` e adevarat (actiunea n-are sens), nu o pacaleala vizuala — vezi pasul 10.
  const gol = persoane === 0;

  // Pas de curatare — cardul e un flex vertical cu un singur gap, in loc de
  // mt-4 pus pe fiecare bloc. Titlul si pretul stau lipite (gap-1) intr-un
  // grup propriu, ca sa se citeasca drept un cap de card.
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col gap-1">
        <div className="font-semibold">{titlu}</div>
        <div className="text-muted-foreground text-sm">{pretUnitar} lei / persoană</div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* onClick={onDecrement}, fara paranteze: pasezi FUNCTIA. Cu paranteze ai
            apela-o in timpul randarii si ai declanșa un setState acolo. */}
        <Button variant="outline" size="sm" onClick={onDecrement} disabled={gol}>
          −1
        </Button>
        <span className="min-w-8 text-center text-2xl font-semibold">{persoane}</span>
        <Button size="sm" onClick={onIncrement}>
          +1
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={gol}>
          Reset
        </Button>
      </div>

      <div className="text-sm">
        {persoane} × {pretUnitar} lei = <strong>{subtotal} lei</strong>
      </div>
    </div>
  );
}

export function CustomHooks() {
  // Doua apeluri ale ACELEIASI functii → doua instante de stare independente.
  const copii = useCounter(0, 1);
  const adulti = useCounter(0, 1);

  // Al treilea apel de hook, cu totul alta logica inauntru (useEffect +
  // listener). Din componenta nu se vede nimic din asta.
  const { width, height } = useWindowSize();

  // Date derivate: se recalculeaza la fiecare randare, deci nu pot fi desincronizate.
  const subtotalCopii = copii.count * PRET_COPIL;
  const subtotalAdulti = adulti.count * PRET_ADULT;
  const totalPersoane = copii.count + adulti.count;
  const totalPlata = subtotalCopii + subtotalAdulti;

  // Pas de curatare — aceeasi latime maxima ca restul ecranelor (max-w-3xl) si un
  // singur gap pe container, in locul lui mt-4 / mt-6 / mt-2 pus pe fiecare copil.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <GrupBox
          titlu="Copii"
          pretUnitar={PRET_COPIL}
          persoane={copii.count}
          subtotal={subtotalCopii}
          onDecrement={copii.decrement}
          onIncrement={copii.increment}
          onReset={copii.reset}
        />
        <GrupBox
          titlu="Adulți"
          pretUnitar={PRET_ADULT}
          persoane={adulti.count}
          subtotal={subtotalAdulti}
          onDecrement={adulti.decrement}
          onIncrement={adulti.increment}
          onReset={adulti.reset}
        />
      </div>

      <div className="bg-card text-card-foreground flex flex-wrap items-center justify-between gap-2 rounded-xl border p-6">
        <span className="font-semibold">Total grup</span>
        <span>
          {totalPersoane} persoane — <strong>{totalPlata} lei</strong>
        </span>
      </div>

      <p className="text-muted-foreground text-sm">
        Apasă <strong>+1</strong> la copii: numărul adulților nu se mișcă. Ambele countere vin din același{" "}
        <code>useCounter</code>, dar fiecare apel are propriul <code>useState</code> — se partajează codul, nu valoarea.
      </p>

      <p className="text-muted-foreground text-sm">
        Fereastra: {width} × {height} px — redimensionează browserul. Efectul cu <code>addEventListener</code> și
        cleanup-ul lui stau în <code>useWindowSize</code>; componenta asta nu știe că există.
      </p>
    </div>
  );
}
