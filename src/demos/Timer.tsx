// Pas 5 — useEffect (efecte laterale si cleanup).
// De ce: corpul componentei e o functie pe care React o reapeleaza integral la
// fiecare re-render. Un setInterval scris direct acolo ar porni un timer nou la
// fiecare randare — iar fiecare tick face setState, deci provoaca randarea
// urmatoare: crestere exponentiala de timere, si nimeni nu tine referinta ca sa
// le opreasca. useEffect e locul declarat pentru tot ce atinge lumea din afara
// React: timere, fetch, event listeners, abonamente.
// Contractul: React apeleaza componenta -> scrie in DOM (commit) -> ABIA APOI
// ruleaza efectele. Deci efectele ruleaza DUPA randare, niciodata in timpul ei.
// Cleanup-ul (functia intoarsa din efect) e apelat inainte de re-rularea
// efectului si la unmount — echivalentul lui try/finally, AutoCloseable sau
// `with` + __exit__. Fara el, comutarea rapida Pornește/Pauza ar lasa mai multe
// intervale active in paralel, toate incrementand aceeasi stare: timere zombie
// -> memory leak, fara nicio eroare in consola.

import { useEffect, useState } from "react";

// Contor la nivel de MODUL: da un ID fiecarui abonament, ca sa se vada in
// consola cate sunt active. La Pasul 3 am spus ca o variabila de modul care se
// schimba e o a doua sursa de adevar, invizibila pentru React — ramane
// adevarat. Aici e acceptabila pentru ca o citim DOAR in efect, niciodata la
// randare: nu ajunge pe ecran, e contabilitate interna a abonamentelor.
let subscriptionCount = 0;

// Fara limita, un element cu clase Tailwind umple consola cu un rand imens.
const MAX_CLASSES = 3;

// Textul PROPRIU al elementului. NU textContent: acela include si textul
// tuturor descendentilor, deci un click nimerit pe <body> ar intoarce tot
// textul paginii intr-un singur rand de log.
// In DOM, textul e el insusi un nod — frate cu elementele, nu o proprietate a
// lor. De aceea filtram copiii directi dupa nodeType.
function ownText(target: Element) {
  return Array.from(target.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent ?? "")
    .join(" ")
    .trim();
}

// Cum identificam elementul apasat: text propriu daca are, altfel clasele.
function describe(target: Element) {
  const text = ownText(target);
  if (text) {
    return `"${text}"`;
  }

  // classList, nu className: pe elementele SVG (iconitele lucide) `className`
  // NU e string, e un obiect SVGAnimatedString — deci .split(" ") ar crapa.
  // classList se comporta identic pe HTML si pe SVG.
  const classes = Array.from(target.classList).slice(0, MAX_CLASSES);
  return classes.length > 0 ? `.${classes.join(".")}` : "(fara text propriu, fara clase)";
}

export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  // EFECT 1 — cronometrul. Dependinte [running]: la fiecare schimbare a
  // comutatorului React ruleaza cleanup-ul efectului VECHI si abia apoi corpul
  // efectului NOU. Asta e garantia ca nu exista doua intervale simultane.
  useEffect(() => {
    console.log(`[Timer] efect: running=${running}`);
    if (!running) {
      console.log("[Timer] efect: running=false → nu pornesc nimic");
      // Nu intoarcem cleanup: nu am pornit nimic, deci nu e nimic de oprit.
      return;
    }

    // setInterval intoarce un handle numeric (in browser), nu un obiect de tip
    // Thread. E singura referinta prin care putem opri timerul.
    const id = setInterval(() => {
      // Forma functionala: callback-ul a capturat `seconds` de la randarea la
      // care s-a creat si l-ar vedea inghetat pe veci. setSeconds(s => s + 1)
      // cere valoarea curenta de la React.
      setSeconds(s => s + 1);
      //console.info('timer++')
    }, 1000);

    console.log(`[Timer] efect: pornesc interval #${id} (running=true)`);

    // OBLIGATORIU. React apeleaza asta inainte de re-rularea efectului si la
    // unmount (plecarea de pe ecran). Aici se termina povestea cu resurse
    // neeliberate: dupa aceasta linie nu mai ruleaza nimic in fundal.
    return () => {
      console.log(`[Timer] cleanup: opresc interval #${id}`);
      clearInterval(id);
    };
  }, [running]);

  // EFECT 2 — telemetrie: abonament la click-urile de oriunde din pagina.
  // Alta resursa, deci alt efect — un efect = o grija, nu unul care face tot.
  // Dependinte []: array gol = ruleaza o singura data, la intrarea in ecran.
  useEffect(() => {
    const id = ++subscriptionCount;

    // Handler STRICT read-only fata de React: citeste evenimentul si scrie in
    // consola, nimic altceva. Fara setState (ar re-randa ecranul la fiecare
    // click de oriunde din pagina), fara scriere in DOM, fara fetch.
    function onBodyClick(event: MouseEvent) {
      // event.target e tipat EventTarget | null. `instanceof` il ingusteaza la
      // Element, ca sa avem tagName/classList fara `any` si fara `!`.
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      // pageX/pageY = poziția in PAGINA, cu scroll inclus (clientX/clientY ar
      // fi fata de fereastra).
      const x = Math.round(event.pageX);
      const y = Math.round(event.pageY);

      // Intr-o aplicatie reala, exact aici s-ar face apelul catre analytics.
      console.log(`[tracker #${id}] track click → ${target.tagName.toLowerCase()} ${describe(target)} @ ${x}×${y}`);
    }

    // Ne abonam pe body: click-urile de pe butoane urca (bubbling) pana aici,
    // deci un singur listener vede tot ecranul.
    document.body.addEventListener("click", onBodyClick);
    console.log(`[tracker #${id}] abonat la click pe body — abonamente active: ${subscriptionCount}`);

    // INTENTIONAT fara cleanup, ca sa vedem in consola ce se intampla fara el:
    // StrictMode monteaza componenta de doua ori in development, deci ramân
    // DOUA abonamente active si fiecare click scrie doua randuri (tracker #1 si
    // tracker #2). Fiecare intrare in ecran ar mai adauga, fara sa scada
    // niciodata. Dezabonarea o adaugam la pasul urmator.
    return () => {
      document.body.removeEventListener("click", onBodyClick);
    }
  }, []);

  return (
    <div>
      <p style={{ fontSize: 64, margin: 0 }}>{seconds}s</p>

      <button type="button" onClick={() => setRunning(r => !r)}>
        {running ? "Pauză" : "Pornește"}
      </button>

      {/* Reset atinge doar `seconds`. `running` nu se schimba, deci efectul NU
          se re-ruleaza si intervalul curent continua neatins. */}
      <button type="button" onClick={() => setSeconds(0)}>
        Reset
      </button>

      <p>
        <small>
          Deschide consola. La intrare vezi efect → cleanup → efect, pentru ca StrictMode monteaza de doua ori in dev:
          cleanup-ul ruleaza mereu ÎNAINTEA re-rularii efectului, deci nu exista doua intervale in paralel. Apasa apoi
          Pauză / Pornește si urmarește aceeași ordine. Click oriunde in pagina → randurile `track click`.
        </small>
      </p>
    </div>
  );
}
