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
import { Button } from "@/components/ui/button";

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
// Pas de curatare — culorile erau scrise de mana (#1e1e1e pe #d4d4d4), deci
// blocul rămânea inchis si pe tema deschisa, si arata altfel decat blocurile de
// cod din restul aplicatiei. Acum sunt aceleasi utilitare pe tokeni ca in
// components/CodeBlock.tsx.
function Code({ children }: CodeProps) {
  return (
    <pre className="bg-secondary text-secondary-foreground overflow-x-auto rounded-lg p-4 text-xs leading-relaxed">
      {children}
    </pre>
  );
}

type ConfigCardProps = { file: string; who: string; what: string; missing: string; snippet: string };

function ConfigCard({ file, who, what, missing, snippet }: ConfigCardProps) {
  // Pas de curatare — acelasi card ca in pasii 10-12 (bg-card + border pe
  // tokeni), si un singur gap pe container in loc de patru margini scrise una
  // cate una pe fiecare paragraf.
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-2 rounded-xl border p-6 text-left">
      <div>
        <code>{file}</code>
      </div>
      <p className="text-muted-foreground text-sm">Cine îl citește: {who}</p>
      <p className="text-muted-foreground text-sm">La ce servește: {what}</p>
      <Code>{snippet}</Code>
      <p className="text-muted-foreground text-sm">⚠️ Dacă lipsește: {missing}</p>
    </div>
  );
}

export function PathAlias() {
  // Un singur boolean: care varianta e afisata. Tot restul (textul butoanelor,
  // codul din <pre>) e DERIVAT din el, nu tinut inca o data in state.
  const [useAlias, setUseAlias] = useState(false);

  // Pas de curatare — butoanele vin din librarie, iar spatiile stau pe container.
  // `disabled` a RAMAS neatins, desi la pasul 10 am invatat ca selectia se
  // exprima cu o varianta: schimbarea l-ar face pe butonul curent clicabil, deci
  // ar fi o schimbare de comportament, nu de aspect. E notata in raport.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      <div className="flex flex-wrap items-center gap-2">
        {/* Arrow function, nu `onClick={setUseAlias(false)}`: a doua varianta ar
            APELA setter-ul in timpul randarii, nu la click. */}
        <Button type="button" variant="outline" size="sm" onClick={() => setUseAlias(false)} disabled={!useAlias}>
          Fără alias (relativ)
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setUseAlias(true)} disabled={useAlias}>
          Cu alias @/
        </Button>
      </div>

      <Code>{useAlias ? ALIAS_IMPORTS : RELATIVE_IMPORTS}</Code>

      <p className="text-muted-foreground text-sm">
        {useAlias
          ? "Același string din orice fișier. Muți Bubble.tsx oriunde — importurile rămân corecte."
          : "Valid într-un singur loc din proiect. Muți fișierul un nivel mai sus și toate patru se rup."}
      </p>

      <p className="text-muted-foreground text-sm">
        Aliasul are nevoie de DOUĂ configurări, pentru că două programe complet independente citesc importurile și
        niciunul nu se uită în configul celuilalt:
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
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
