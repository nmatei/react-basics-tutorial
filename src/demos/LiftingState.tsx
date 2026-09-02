// Pas 6 — lifting state up (o singura sursa de adevar).
// De ce: doua zone din ecran trebuie sa arate mereu aceeasi informatie, in doua
// forme. Varianta greșita e un useState in fiecare card — ai atunci doua copii
// ale aceleiasi date si trebuie sa le copiezi una in alta la fiecare modificare.
// E coloana denormalizata din baza de date: se desincronizeaza inevitabil.
// Soluția: starea urca in cel mai apropiat PARINTE COMUN al componentelor care o
// citesc sau o scriu. Copiii nu mai au stare deloc, deci desincronizarea devine
// imposibila structural, nu doar improbabila.
// Punctele NU sunt stare: sunt `amount * rate`, o valoare DERIVATA — echivalentul
// unui VIEW, nu al unei coloane. Ce poti calcula, nu stochezi.
// Cum circula informatia: datele coboara ca props (readonly), actiunile coboara
// ca props-FUNCȚII (`onChange`, echivalentul unui Action<int> / callback). Copilul
// nu schimba starea parintelui — o CERE, apelând functia primita. Asta e
// unidirectional data flow: date in jos, evenimente in sus.
// Capcana: un card controlat nu are memorie proprie. Daca parintele ignora
// `onChange`, inputul nu se mișca. Nu e bug, e definitia lui.

import { useState } from "react";

// Props-urile unui copil CONTROLAT: valoarea de afisat + functia prin care cere
// schimbarea. `step?` e opțional (`?` = poate lipsi, ca un parametru cu default).
type PriceCardProps = {
  label: string;
  amount: number;
  currency: string;
  step?: number;
  onChange: (next: number) => void;
};

// Zero useState aici. Cardul nu stie nici de curs de schimb, nici de celalalt
// card: afiseaza un numar si anunta ca vrea altul.
function PriceCard({ amount, label, currency, step = 1, onChange }: PriceCardProps) {
  // Pas de curatare — cardul folosea `border: 1px solid #888`, o culoare scrisa
  // de mana care nu stia nimic despre tema. Acum e acelasi card ca in pasii
  // 10-12: bg-card + border pe tokeni, deci se muta singur pe tema intunecata.
  return (
    <div className="bg-card text-card-foreground rounded-xl border p-6">
      {/* <label> INFASOARA in continuare inputul (asociere implicita, fara id):
          click pe eticheta muta focusul in input. Doar spatiile s-au mutat pe
          container. */}
      <label className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="flex items-center gap-2">
          <input
            type="number"
            // `value` vine din props => input controlat. Fara `onChange` ar fi
            // read-only: React redeseneaza mereu valoarea primita de sus.
            value={amount}
            step={step}
            // e.target.value e mereu STRING in DOM, chiar si pentru type="number".
            // Number(...) il converteste; fara asta "10" + 1 ar da "101".
            onChange={e => onChange(Number(e.target.value))}
          />
          <span className="text-sm">{currency}</span>
        </span>
      </label>
    </div>
  );
}

export function LiftingState() {
  // SINGURA sursa de adevar din acest ecran — un singur numar, in RON.
  const [amount, setAmount] = useState(10);

  // Curs fictiv, constanta: nu se schimba niciodata, deci nu are ce sa caute in
  // useState.
  const rate = 5;

  // Pas de curatare — acelasi grid cu doua coloane folosit de pasii 11-12, in
  // locul unui flex cu `alignItems: "flex-start"`: cardurile ies egale in
  // inaltime, deci input-urile lor stau pe aceeasi linie.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      <div className="text-foreground text-lg font-semibold">{amount} RON</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Cardul „nativ”: citeste starea direct si o scrie direct. `setAmount`
            este pasat ca valoare (fara paranteze) — pasezi functia, nu rezultatul
            apelului ei. */}
        <PriceCard
          // first card
          label="Sumă"
          amount={amount}
          currency="RON"
          onChange={setAmount}
        />

        {/* Cardul derivat: primeste valoarea convertita, iar la modificare face
            conversia inversa INAINTE de a scrie starea. Conversia trăiește langa
            sursa de adevar, nu in copil. */}
        <PriceCard
          label="Puncte de fidelitate"
          amount={amount * rate}
          currency="pct"
          step={rate}
          onChange={next => setAmount(Math.round(next / rate))}
        />
      </div>
    </div>
  );
}
