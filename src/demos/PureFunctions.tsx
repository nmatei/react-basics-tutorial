// Pas 3 — Functii pure.
// De ce: React nu supravegheaza lumea. Re-apeleaza componenta DOAR cand se
// schimba state (useState) sau props. O functie de randare care citeste o
// valoare schimbatoare din afara — DOM, variabila globala, Date.now() — nu ii
// da lui React niciun semnal, deci ecranul ramane pe valoarea veche ("stale").
// Capcana: nu crapa nimic si nu apare nicio eroare in consola. Valoarea se
// corecteaza mai tarziu, la o actiune fara legatura, cand vine un re-render
// din alt motiv. Intr-o aplicatie reala asta inseamna client care vede un curs
// vechi si o suma gresita — exact genul de bug care ajunge in productie.

import { useState } from "react";
import { Button } from "@/components/ui/button";

const RATE_INITIAL = 5;
const RATE_STEP = 0.05;
const COMISION_PCT = 0.01;
const COMISION_ID = "pure-comision";

// PURA: primeste tot ce ii trebuie prin argumente. Aceleasi (ron, rate) dau
// mereu acelasi rezultat, indiferent de ce se intampla in restul aplicatiei.
function pureConvert(ron: number, rate: number) {
  return ron / rate;
}

// IMPURA: semnatura IDENTICA cu cea de sus, deci la locul de apel cele doua
// arata la fel de sigure. Diferenta e ascunsa aici, in corp: pe langa
// argumente mai citeste si checkbox-ul, direct din DOM.
// `document` nu e nici argument, nici state, nici props — e o a doua sursa de
// adevar, paralela, despre care React nu stie nimic. Cand bifezi, se schimba
// DOM-ul, dar nu se schimba nimic din ce urmareste React → niciun re-render →
// pe ecran ramane suma calculata inainte de bifare.
function impureConvert(ron: number, rate: number, comision: boolean) {
  const eur = ron / rate;

  // getElementById intoarce HTMLElement | null, iar `.checked` exista doar pe
  // input. `instanceof` ingusteaza tipul si ne scapa si de `any`, si de `!`.
  // const el = document.getElementById(COMISION_ID)
  // const cuComision = el instanceof HTMLInputElement && el.checked

  console.info("impureConvert", { ron, rate, comision });

  return comision ? eur * (1 - COMISION_PCT) : eur;
}

export function PureFunctions() {
  // Suma si cursul sunt state React tocmai ca sa se vada contrastul:
  // schimbarea lor declanseaza re-render, bifarea checkbox-ului nu.
  const [ron, setRon] = useState(100);
  const [rate, setRate] = useState(RATE_INITIAL);
  const [comision, setComission] = useState(false);

  // Pas de curatare — un singur gap pe container in loc de distantele implicite
  // dintre <p> si butoane, si fiecare pereche de butoane pe rand propriu, aliniat
  // cu items-center. Inainte butoanele stateau lipite unul de altul, iar
  // checkbox-ul si eticheta lui erau despartite doar de un {" "}.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      <div className="flex flex-col gap-2">
        <p>
          Suma: <strong>{ron} RON</strong>
        </p>
        {/* Forma cu functie — setRon(r => ...) — citeste valoarea curenta in
            momentul aplicarii, nu pe cea capturata la render. */}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setRon(r => Math.max(0, r - 10))}>
            -10
          </Button>
          <Button type="button" size="sm" onClick={() => setRon(r => r + 10)}>
            +10
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p>
          Curs: <strong>1 EUR = {rate.toFixed(2)} RON</strong>
        </p>
        {/* Math.max opreste cursul inainte de 0, ca sa nu ajungem la impartire
            la zero si sa afisam Infinity in loc de lectie. */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRate(r => Math.max(RATE_STEP, r - RATE_STEP))}
          >
            -{RATE_STEP}
          </Button>
          <Button type="button" size="sm" onClick={() => setRate(r => r + RATE_STEP)}>
            +{RATE_STEP}
          </Button>
        </div>
      </div>

      {/* Checkbox NEcontrolat: fara useState, fara onChange. Valoarea lui
          traieste doar in DOM. `htmlFor` in loc de `for` pentru ca `for` e
          cuvant rezervat in JS. */}
      <div className="flex items-center gap-2">
        <input id={COMISION_ID} type="checkbox" onChange={e => setComission(e.target.checked)} />
        <label htmlFor={COMISION_ID}>aplica comision ({COMISION_PCT * 100}%)</label>
      </div>

      <div className="flex flex-col gap-1">
        <p>
          pureConvert: <strong>{pureConvert(ron, rate).toFixed(2)} EUR</strong>
        </p>
        <p>
          impureConvert: <strong>{impureConvert(ron, rate, comision).toFixed(2)} EUR</strong>
        </p>
      </div>

      <p className="text-muted-foreground text-sm">
        Experiment: modifica suma sau cursul → ambele valori se actualizeaza. Bifeaza comisionul → nu se schimba nimic.
        Apasa apoi +10 → comisionul apare brusc, la actiunea gresita.
      </p>
    </div>
  );
}

// Cum se rezolva corect
// --------------------
// NU prin "mai citesc o data DOM-ul" si nu prin fortarea unui re-render, ci
// mutand valoarea acolo unde React o poate vedea:
//
//   const [cuComision, setCuComision] = useState(false)
//   <input type="checkbox" checked={cuComision}
//          onChange={(e) => setCuComision(e.target.checked)} />
//
//   function convert(ron: number, rate: number, cuComision: boolean) {
//     const eur = ron / rate
//     return cuComision ? eur * (1 - COMISION_PCT) : eur
//   }
//
// Acum functia e pura (primeste tot prin argumente), iar bifarea inseamna
// setState → re-render → cifra se actualizeaza instant, ca la suma si curs.

// Intrebarea care apare mereu: dar un `const` de modul?
// -----------------------------------------------------
// O functie care citeste `COMISION_PCT` ramane PURA: valoarea nu se poate
// schimba niciodata, deci "aceleasi intrari → acelasi rezultat" ramane
// adevarat. E echivalentul lui `static final double` din Java; React n-are ce
// urmari acolo, pentru ca nu se misca nimic.
//
// Orice valoare care SE POATE schimba trebuie sa intre ca argument / props /
// state — altfel React nu are cum sa stie cand sa re-randeze.
//
// Capcana pentru cei veniti din Java: `const` blocheaza LEGATURA, nu
// continutul — e `final`, nu "immutable".
//
//   const config = { rate: 5 }
//   config = { rate: 6 }   // eroare — nu poti re-lega numele
//   config.rate = 6        // perfect legal — obiectul s-a schimbat
//
// Deci un `const` legat la un primitiv (number, string, boolean) se poate citi
// linistit; un `const` legat la un obiect sau array nu — o functie care
// citeste `config.rate` e la fel de impura ca `impureConvert`.
