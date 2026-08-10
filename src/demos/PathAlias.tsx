// Pas 8 — alias de cale @/ (importuri stabile, indiferent de adancime).
// De ce: un import relativ nu e un NUME LOGIC de modul (ca `com.acme.Format` in
// Java sau `myapp.lib.format` in Python), ci o CALE IN FILESYSTEM calculata din
// pozitia fisierului care scrie importul. Doua consecinte, ambele enervante:
// muti fisierul si se rup importurile — desi ce importi n-a miscat un centimetru;
// si in adancime devine nedescifrabil (`../../../lib/format` nu-ti spune unde
// ajungi fara sa numeri pe degete).
// Aliasul readuce modelul cu care esti obisnuit — "absolut de la radacina
// sursei": `@/lib/format` e acelasi string din orice fisier, la orice adancime.
// Efectul practic: liniile de import devin copy-paste-abile intre fisiere si
// supravietuiesc mutarilor.
// De ce ACUM: shadcn/ui il cere ca preconditie (genereaza cod cu @/components/ui
// si refuza sa porneasca fara alias) — il adaugam mai tarziu. Dar e util oricum,
// si e ieftin de pus acum / scump de retrofitat peste 30 de fisiere.
// Capcana: @/ nu e sintaxa JS si nu exista in runtime. E o regula de rescriere a
// importurilor, aplicata de tool-uri — deci trebuie declarata SEPARAT in fiecare
// tool care citeste importurile. La noi: doua locuri, tinute sincron manual.
// A nu se confunda cu pachetele npm cu scope (`@vitejs/plugin-react`): al nostru
// are `/` imediat dupa `@`. De asta regula e "@/*" si nu "@*" — altfel ai fi
// deturnat toate pachetele scoped.

import { useState } from "react";

// Cele doua constante de mai jos contin ACELEASI patru importuri, scrise in cele
// doua stiluri. Fisierul din exemplu e ipotetic, ales pentru adancime: din
// src/components/chat/message/ trebuie sa urci trei niveluri ca sa ajungi la src.
// Sunt simple string-uri (`const` la nivel de modul, calculate o singura data la
// incarcarea modulului, nu la fiecare randare) — nu importuri reale.
const RELATIVE_IMPORTS = `// src/components/chat/message/Bubble.tsx

import { formatTime } from "../../../lib/format";
import { useChat } from "../../../hooks/useChat";
import { ThemeContext } from "../../../context/ThemeContext";
import { Avatar } from "../../chat/Avatar";`;

const ALIAS_IMPORTS = `// src/components/chat/message/Bubble.tsx

import { formatTime } from "@/lib/format";
import { useChat } from "@/hooks/useChat";
import { ThemeContext } from "@/context/ThemeContext";
import { Avatar } from "@/components/chat/Avatar";`;

const TSCONFIG_SNIPPET = `// tsconfig.app.json
"paths": {
  "@/*": ["./src/*"]
}`;

const VITE_SNIPPET = `// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src")
  }
}`;

type CodeProps = { children: string };

// <pre> pastreaza spatiile si newline-urile exact cum sunt in string; intr-un
// <div> obisnuit browserul le-ar colapsa intr-un singur spatiu.
function Code({ children }: CodeProps) {
  return (
    <pre
      style={{
        margin: 0,
        padding: 12,
        borderRadius: 8,
        background: "#1e1e1e",
        color: "#d4d4d4",
        fontSize: 13,
        lineHeight: 1.5,
        overflowX: "auto"
      }}
    >
      {children}
    </pre>
  );
}

type ConfigCardProps = { file: string; who: string; what: string; missing: string; snippet: string };

function ConfigCard({ file, who, what, missing, snippet }: ConfigCardProps) {
  return (
    <div style={{ border: "1px solid #888", borderRadius: 8, padding: 16, flex: "1 1 320px", textAlign: "left" }}>
      <div>
        <code>{file}</code>
      </div>
      <p style={{ margin: "8px 0 4px" }}>
        <small>Cine îl citește: {who}</small>
      </p>
      <p style={{ margin: "0 0 12px" }}>
        <small>La ce servește: {what}</small>
      </p>
      <Code>{snippet}</Code>
      <p style={{ marginBottom: 0 }}>
        <small>⚠️ Dacă lipsește: {missing}</small>
      </p>
    </div>
  );
}

export function PathAlias() {
  // Un singur boolean: care varianta e afisata. Tot restul (textul butoanelor,
  // codul din <pre>) e DERIVAT din el, nu tinut inca o data in state.
  const [useAlias, setUseAlias] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {/* Arrow function, nu `onClick={setUseAlias(false)}`: a doua varianta ar
            APELA setter-ul in timpul randarii, nu la click. */}
        <button onClick={() => setUseAlias(false)} disabled={!useAlias}>
          Fără alias (relativ)
        </button>
        <button onClick={() => setUseAlias(true)} disabled={useAlias}>
          Cu alias @/
        </button>
      </div>

      <Code>{useAlias ? ALIAS_IMPORTS : RELATIVE_IMPORTS}</Code>

      <p>
        <small>
          {useAlias
            ? "Același string din orice fișier. Muți Bubble.tsx oriunde — importurile rămân corecte."
            : "Valid într-un singur loc din proiect. Muți fișierul un nivel mai sus și toate patru se rup."}
        </small>
      </p>

      <p>
        <small>
          Aliasul are nevoie de DOUĂ configurări, pentru că două programe complet independente citesc importurile și
          niciunul nu se uită în configul celuilalt:
        </small>
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <ConfigCard
          file="tsconfig.app.json"
          who="TypeScript (tsc -b) și, prin el, editorul"
          what="înțelegerea codului — type-check, „go to definition”, autocomplete, rename"
          missing="aplicația rulează, dar editorul e roșu („Cannot find module”) și npm run build pică la type-check"
          snippet={TSCONFIG_SNIPPET}
        />
        <ConfigCard
          file="vite.config.ts"
          who="Vite / esbuild / Rollup"
          what="execuția — găsirea fișierului real pe disc, la npm run dev și la vite build"
          missing="editorul e verde și tipurile trec, dar build-ul crapă cu „Failed to resolve import”"
          snippet={VITE_SNIPPET}
        />
      </div>
    </div>
  );
}
