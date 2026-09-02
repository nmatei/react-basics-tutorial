// Pas 9 — Tailwind CSS v4: utility-first + tokeni de tema.
// De ce: pana acum stilul a stat in fisiere .css separate, legat de markup printr-un
// nume de clasa inventat de noi. Numele acela e o variabila globala intr-un limbaj
// fara compilator — nimeni nu verifica daca exista, daca se ciocneste cu alta sau
// daca mai e folosita de cineva. Iar valorile (12px, #e5e4e7, 4px) le alegi de
// fiecare data din cap, deci interfata iese usor inconsecventa.
// Tailwind schimba doua lucruri:
//   1. stilul sta LANGA structura — il citesti in componenta, nu il cauti in alt
//      fisier, si dispare odata cu componenta (CSS mort nu se mai aduna);
//   2. valorile vin dintr-un SET FIX — `p-6` nu e "un padding oarecare", e treapta
//      6 din scala de spacing. Echivalentul din C#/Java: treci de la un string
//      liber la un enum. Nu mai poti nimeri 13px din greseala.
// Castigul real NU e "mai putin cod" (de multe ori e mai mult text pe linie), ci
// consecventa: aceleasi spacing-uri, aceleasi culori, aceleasi colturi peste tot.
// Obiectia standard, "clasele lungi urateste markup-ul", e reala, dar:
//   - stilul e vizibil unde e folosit; nu deschizi un al doilea fisier si nu cauti
//     cine mai depinde de clasa aia inainte s-o modifici;
//   - prettier-plugin-tailwindcss le sorteaza canonic la salvare, deci ordinea nu
//     mai e o decizie personala si diff-urile raman curate;
//   - repetitia reala se rezolva cu o componenta React, nu cu o clasa CSS.
// Capcana demonstrata mai jos: utility-first fara tokeni nu rezolva nimic. Cardul
// scris de mana are culorile hardcodate, deci la schimbarea temei RAMANE ALB —
// text negru pe alb, intr-o pagina intunecata. Cel pe tokeni se adapteaza singur,
// pentru ca `bg-card` inseamna `background: var(--card)`, iar clasa .dark de pe
// <html> rescrie variabila. Nicio componenta React nu afla ca s-a schimbat tema.

// Pas 10 — comutatorul de tema care statea aici s-a mutat in components/ThemeToggle
// si a urcat in meniu: tema priveste acum toata aplicatia, nu doar demo-ul asta, iar
// doi proprietari pentru aceeasi clasa de pe <html> s-ar fi anulat reciproc. Restul
// lectiei ramane neatins.

import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";

// Obiecte de stil normale, ca in pasii anteriori. CSSProperties e tipul pe care il
// asteapta atributul `style` — cheile sunt in camelCase (borderRadius, nu
// border-radius), pentru ca sunt proprietati de obiect JS, nu CSS scris ca text.
const CARD: CSSProperties = {
  maxWidth: 360,
  padding: 24,
  borderRadius: 12,
  textAlign: "left",
  // Valorile problematice: exista doar aici si nu stiu nimic despre tema.
  background: "#fafafa",
  color: "#171717",
  border: "1px solid rgba(23, 23, 23, 0.1)"
};

const TITLE: CSSProperties = { fontSize: 18, fontWeight: 600, marginBottom: 8 };
const MUTED: CSSProperties = { fontSize: 14, color: "#737373", marginBottom: 16 };
const BUTTON: CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  fontSize: 14,
  cursor: "pointer",
  background: "#8b5cf6",
  color: "#fafafa"
};

function HandwrittenCard() {
  return (
    <div style={CARD}>
      <div style={TITLE}>Plan Pro</div>
      <p style={MUTED}>Toate demo-urile, actualizari incluse.</p>
      <button style={BUTTON}>Alege planul</button>
    </div>
  );
}

// Exact acelasi card, aceleasi valori — dar exprimate ca utilitare pe tokenii temei.
// max-w-90 = 90 x 0.25rem = 360px, p-6 = 24px, rounded-xl = 12px: numerele nu sunt
// pixeli, sunt trepte din scala de spacing.
// Pas de curatare — `mx-auto` (si `margin: "0 auto"` din varianta de mana) au fost
// scoase din AMBELE carduri, ca sa se alinieze cu restul ecranului. Cele doua
// variante au rămas identice intre ele, deci comparatia lectiei e neatinsa.
// `border-card-foreground/10` arata modificatorul de opacitate: `/10` cere 10% din
// token, deci pana si bordura ramane derivata din tema, nu inventata.
function TokenCard() {
  return (
    <div className="border-card-foreground/10 bg-card text-card-foreground max-w-90 rounded-xl border p-6 text-left">
      <div className="mb-2 text-lg font-semibold">Plan Pro</div>
      <p className="text-muted-foreground mb-4 text-sm">Toate demo-urile, actualizari incluse.</p>
      <button className="bg-primary text-primary-foreground cursor-pointer rounded-lg px-4 py-2 text-sm">
        Alege planul
      </button>
    </div>
  );
}

export function TailwindSetup() {
  // Un singur boolean pentru varianta afisata; textul explicativ de dedesubt e
  // DERIVAT din el, nu tinut inca o data in state.
  const [useTokens, setUseTokens] = useState(false);

  // Pas de curatare — s-a atins doar CADRUL demo-ului (invelisul, gap-ul pe
  // container, marimea butoanelor si a notelor de dedesubt). Cele doua carduri au
  // ramas neatinse INTENTIONAT: cardul scris de mana, cu #fafafa si #171717 in el,
  // e chiar lectia — daca l-am pune pe tokeni, comparatia n-ar mai exista.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      {/* Pas 10 — aceleasi doua butoane, dar varianta arata acum care e selectat.
          Inainte foloseam `disabled` ca sa marcam selectia: butonul curent parea
          stins, desi nu era vorba de o actiune indisponibila, ci de o stare activa. */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={useTokens ? "secondary" : "default"} size="sm" onClick={() => setUseTokens(false)}>
          Scris de mână (style)
        </Button>
        <Button variant={useTokens ? "default" : "secondary"} size="sm" onClick={() => setUseTokens(true)}>
          Tailwind pe tokeni
        </Button>
      </div>

      {useTokens ? <TokenCard /> : <HandwrittenCard />}

      <p className="text-muted-foreground text-sm">
        {useTokens ? (
          <code>bg-card text-card-foreground text-muted-foreground bg-primary</code>
        ) : (
          <code>background: "#fafafa"; color: "#171717"; color: "#737373"</code>
        )}
      </p>

      <p className="text-muted-foreground text-sm">
        {useTokens
          ? "În temă deschisă arată identic cu varianta de mână — oklch(0.985 0 0) CHIAR ESTE #fafafa. Comută tema din meniu: se adaptează singur, pentru că bg-card înseamnă var(--card), iar .dark rescrie variabila."
          : "Comută tema din meniu (butonul cu luna): cardul rămâne alb. Culorile sunt scrise în el, nu citite din temă — și n-ai unde să le schimbi din afară, decât intrând în fiecare componentă."}
      </p>
    </div>
  );
}
