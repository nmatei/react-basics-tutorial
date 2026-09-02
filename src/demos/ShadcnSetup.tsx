// Pas 10 — shadcn/ui.
// De ce: la pasul 9 am invatat sa scriem stil cu utilitare Tailwind. Dar utilitarele
// descriu ASPECT, nu COMPORTAMENT. Un buton adevarat are hover, focus vizibil la
// navigarea cu Tab, stare dezactivata care chiar dezactiveaza, tranzitii — si toate
// astea trebuie rescrise la fiecare buton, identic. Exact ce se uita. La un dialog
// lista e si mai lunga: focus mutat inauntru la deschidere si intors de unde a
// plecat la inchidere, Escape care inchide, aria-modal, focus trap. Aia nu mai e
// decorare, e logica.
//
// Ce fel de dependenta e shadcn/ui: NICIUNA. In package.json nu exista pachetul
// "shadcn/ui". Comanda `npx shadcn@latest add button` e un GENERATOR: descarca
// sursa componentei si o SCRIE ca fisier in proiect — src/components/ui/button.tsx.
// De acolo incolo fisierul e al tau: intra in git, il citesti, il modifici, il
// stergi. Nu e un pachet NuGet/Maven pe care il consumi prin API-ul expus de altul,
// e mai aproape de `dotnet new` — un sablon care iti genereaza cod sursa.
//   - MUI/Chakra: componenta sta in node_modules, o poti doar configura prin ce au
//     expus autorii. Ce n-au expus, n-ai. Un release nou te poate lovi.
//   - shadcn/ui: schimbi o linie in fisierul tau si gata. Pretul, ca sa fie spus si
//     partea proasta: imbunatatirile de mai tarziu nu vin singure la tine.
// Bonus practic: un agent AI poate citi si modifica src/components/ui/button.tsx.
// In node_modules n-are ce cauta — poate doar sa ghiceasca API-ul din documentatie.
//
// Ce se instaleaza totusi, si de ce sunt utilitare, nu componente:
//   radix-ui                  — comportament + accesibilitate (partea grea, invizibila)
//   class-variance-authority  — variante TIPATE: variant/size declarate o data, ca un
//                               enum cu tabel de cautare, nu ca string liber
//   clsx + tailwind-merge     — impreuna fac cn(), vezi src/lib/utils.ts
//   lucide-react              — iconite
// Deci: comportamentul vine din node_modules, stilul vine in src/ ca fisier al tau.

import { useState } from "react";
import { Button } from "@/components/ui/button";

// `as const` inghiata array-ul: fara el, TypeScript deduce string[] si `v` de mai jos
// ar fi un string oarecare, pe care prop-ul tipat `variant` il refuza. Cu el, tipul
// devine exact uniunea celor cinci valori.
const variants = ["default", "secondary", "outline", "ghost", "link"] as const;

export function ShadcnSetup() {
  // Cate click-uri a primit butonul care "pare" dezactivat. Daca numarul creste, nu
  // era dezactivat.
  const [clicks, setClicks] = useState(0);

  // Pas de curatare — s-a atins doar cadrul: invelisul comun al demo-urilor, un
  // singur gap pe fiecare container, si titlurile de card fara mb-4 propriu.
  // Butoanele scrise de mana din cardul din stanga au ramas INTENTIONAT: ele sunt
  // contra-exemplul lectiei (outline-none, `disabled` doar la aparenta).
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      <p className="text-muted-foreground text-sm">
        Navighează prin zona de mai jos cu <kbd>Tab</kbd>: în stânga nu se vede unde ești, iar butonul „dezactivat”
        primește focus și click.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-6">
          <div className="font-semibold">Scris de mână</div>

          <div className="flex flex-wrap items-center gap-3">
            {/* `outline-none` e greseala clasica, copiata din mii de exemple ca sa
                dispara conturul "urat" al browserului. Dispare insa si singurul
                indiciu al navigarii cu tastatura. */}
            <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm outline-none">
              Salvează
            </button>

            {/* Butonul care doar PARE dezactivat: are opacitatea unui buton
                dezactivat, dar nu are atributul `disabled`. Deci ramane in ordinea
                de Tab si raspunde la click. */}
            <button
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm opacity-50 outline-none"
              onClick={() => setClicks(c => c + 1)}
            >
              Dezactivat
            </button>
          </div>

          <p className="text-muted-foreground text-sm">
            Click-uri primite de butonul „dezactivat”: <strong>{clicks}</strong>
          </p>
        </div>

        <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-6">
          <div className="font-semibold">shadcn/ui</div>

          <div className="flex flex-wrap items-center gap-3">
            <Button>Salvează</Button>
            {/* `disabled` e atributul HTML, ajuns pe <button> prin {...props}.
                Componenta adauga peste el disabled:pointer-events-none si
                disabled:opacity-50 — aspectul si comportamentul spun acelasi lucru. */}
            <Button disabled>Dezactivat</Button>
          </div>

          <p className="text-muted-foreground text-sm">
            Inel de focus, hover și stare dezactivată reală — fără să le scriem noi.
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-6">
        <div className="font-semibold">Variantele, generate din listă</div>
        <div className="flex flex-wrap items-center gap-3">
          {variants.map(v => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">
          Toate vin din același fișier al nostru, <code>src/components/ui/button.tsx</code>. Nu așteptăm un release ca
          să schimbăm ceva în ele.
        </p>
      </div>
    </div>
  );
}
