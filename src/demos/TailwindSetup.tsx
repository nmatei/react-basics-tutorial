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

import { useEffect, useState, type CSSProperties } from "react";

// Obiecte de stil normale, ca in pasii anteriori. CSSProperties e tipul pe care il
// asteapta atributul `style` — cheile sunt in camelCase (borderRadius, nu
// border-radius), pentru ca sunt proprietati de obiect JS, nu CSS scris ca text.
const CARD: CSSProperties = {
  maxWidth: 360,
  margin: "0 auto",
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
// `border-card-foreground/10` arata modificatorul de opacitate: `/10` cere 10% din
// token, deci pana si bordura ramane derivata din tema, nu inventata.
function TokenCard() {
  return (
    <div className="border-card-foreground/10 bg-card text-card-foreground mx-auto max-w-90 rounded-xl border p-6 text-left">
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
  const [dark, setDark] = useState(false);

  // Tema e stare care traieste IN AFARA React-ului: o clasa pe <html>, un element
  // pe care React nu-l randeaza. Exact cazul pentru useEffect — sincronizezi lumea
  // externa cu state-ul. Cleanup-ul scoate clasa cand pleci de pe demo, ca sa nu
  // ramana tema agatata de restul aplicatiei.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", dark);
    return () => html.classList.remove("dark");
  }, [dark]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setUseTokens(false)} disabled={!useTokens}>
          Scris de mână (style)
        </button>
        <button onClick={() => setUseTokens(true)} disabled={useTokens}>
          Tailwind pe tokeni
        </button>
        <button onClick={() => setDark(d => !d)}>{dark ? "☀️ Temă deschisă" : "🌙 Temă întunecată"}</button>
      </div>

      {useTokens ? <TokenCard /> : <HandwrittenCard />}

      <p style={{ marginTop: 16 }}>
        <small>
          {useTokens ? (
            <code>bg-card text-card-foreground text-muted-foreground bg-primary</code>
          ) : (
            <code>background: "#fafafa"; color: "#171717"; color: "#737373"</code>
          )}
        </small>
      </p>

      <p style={{ marginTop: 8 }}>
        <small>
          {useTokens
            ? "În temă deschisă arată identic cu varianta de mână — oklch(0.985 0 0) CHIAR ESTE #fafafa. Comută tema: se adaptează singur, pentru că bg-card înseamnă var(--card), iar .dark rescrie variabila."
            : "Comută tema: cardul rămâne alb. Culorile sunt scrise în el, nu citite din temă — și n-ai unde să le schimbi din afară, decât intrând în fiecare componentă."}
        </small>
      </p>
    </div>
  );
}
