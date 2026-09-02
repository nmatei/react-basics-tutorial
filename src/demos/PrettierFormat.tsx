// Pas 4 — Prettier si formatare automata.
// De ce: vrem o singura conventie de stil, aplicata automat, ca review-ul sa
// ramana despre logica si bug-uri, nu despre spatii, ghilimele sau punct si
// virgula. Setup-ul e in proiect ca sa fie identic pe orice laptop.
// Capcana: `prettier-ignore` exista, dar se foloseste rar si justificat,
// doar cand lizibilitatea scade (ex: matrice sau valori aliniate in coloane).

import { CodeBlock } from "@/components/CodeBlock";

export function PrettierFormat() {
  const jsIgnoreExample = `// prettier-ignore
const matrix = [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
];`;

  const jsxIgnoreExample = `{/* prettier-ignore */}
<MyMatrix
  values={[
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]}
/>`;

  // Pas de curatare — <pre> scris de mana a fost inlocuit cu <CodeBlock>, aceeasi
  // componenta folosita de pasul 12: blocurile de cod din aplicatie arata acum la
  // fel (aceeasi suprafata din tokeni, acelasi padding, aceeasi marime de font),
  // in loc sa depinda de stilul implicit al browserului.
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      <p>
        Formatterul proiectului este Prettier, cu reguli fixe in <code>.prettierrc</code>:<code> semi: true</code>,{" "}
        <code>singleQuote: false</code>, <code>printWidth: 120</code>,<code> arrowParens: "avoid"</code> si plugin-ul{" "}
        <code>prettier-plugin-tailwindcss</code>.
      </p>

      <p>
        Ignorarea pe un bloc punctual in JS/TS se face cu <code>// prettier-ignore</code>, pus imediat inainte de nodul
        care trebuie pastrat exact cum e scris:
      </p>
      <CodeBlock>{jsIgnoreExample}</CodeBlock>

      <p>
        In JSX directiva este <code>{"{/* prettier-ignore */}"}</code> si se aplica elementului imediat urmator:
      </p>
      <CodeBlock>{jsxIgnoreExample}</CodeBlock>

      <p>
        Important: in JS/TS directiva afecteaza doar nodul imediat urmator. Nu exista varianta "ignora de aici pana
        aici" in JS. Formele <code>prettier-ignore-start</code> si
        <code>prettier-ignore-end</code> sunt pentru Markdown, YAML si HTML.
      </p>

      <p>
        Folosim <code>prettier-ignore</code> rar si motivat, pentru cazuri in care alinierea manuala face datele mai
        usor de citit (matrice, tabele de valori), nu ca sa ocolim conventia comuna de formatare.
      </p>
    </section>
  );
}
