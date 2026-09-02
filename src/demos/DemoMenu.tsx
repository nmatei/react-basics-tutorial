// Pas 7 — liste: map si key (meniul de navigare, in miniatura).
// De ce: pana acum butoanele de navigare erau scrise de mana, cate unul per demo.
// Adaugarea unui pas insemna doua modificari in doua locuri, care se pot
// desincroniza. Solutia e sa nu mai scrii butoanele deloc: le DERIVI din lista de
// demo-uri cu `map`. Lista e datele, meniul e o functie de date — 3 intrari dau 3
// butoane, 8 intrari dau 8, fara sa atingi meniul.
// `key` exista pentru ca React compara lista veche cu cea noua ca sa modifice in
// DOM doar ce s-a schimbat. Fara key, singura identitate disponibila e POZITIA,
// iar la o inserare la mijloc React crede ca s-a schimbat tot randul. `key` da
// fiecarui element o identitate stabila — echivalentul cheii primare.
// Sursa unica de adevar a navigarii e ID-UL ACTIV, un simplu string. Restul UI-ului
// se DERIVA din el prin `find`. Nu tinem in state si lista, si elementul selectat:
// ar fi doua copii ale aceleiasi informatii, care se desincronizeaza (exact
// greseala de la pasul 6). Ce poti calcula, nu stochezi.
// Capcana: `key` NU ajunge in componenta ca prop. Daca ai nevoie de id si inauntru,
// il pasezi inca o data, separat.
// LOCAL vs GLOBAL: `activeId` de mai jos sta intr-un useState, adica in memoria
// paginii. La refresh procesul JS reporneste de la zero si selectia se pierde —
// revii la valoarea initiala. Daca aceeasi informatie (pasul activ, tema) ar sta in
// context + localStorage, ar fi globala: vizibila din orice componenta fara sa o
// pasezi prin props, si scrisa pe disc, deci ar supravietui refresh-ului. Contextul
// si localStorage sunt lectii viitoare; aici doar le punem fata in fata.

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Acelasi tipar ca registrul din App.tsx, redus la minimum: id + ce se afiseaza.
const miniDemos = [
  { id: "a", label: "Alfa", content: "Continutul demo-ului Alfa." },
  { id: "b", label: "Beta", content: "Continutul demo-ului Beta." },
  { id: "c", label: "Gama", content: "Continutul demo-ului Gama." }
];

export function DemoMenu() {
  // Singura stare din tot meniul: un string. Atat.
  const [activeId, setActiveId] = useState("a");

  // `find` returneaza `undefined` daca nu gaseste nimic, iar TypeScript ne obliga
  // sa tratam cazul. `?? miniDemos[0]` e alternativa la `!`, interzis in proiect.
  const active = miniDemos.find(d => d.id === activeId) ?? miniDemos[0];

  // Pas de curatare — aceleasi butoane, dar din librarie si cu selectia exprimata
  // ca VARIANTA, exact ca tab-urile din meniul de sus (components/DemoTab.tsx).
  // Nu s-a adaugat stare: `activeId` exista de la inceput, doar acum se si vede
  // care buton e cel apasat.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 text-left">
      {/* `map` returneaza un ARRAY de elemente, iar JSX stie sa randeze un array
          acolo unde accepta un element. Nu exista o sintaxa speciala de repetitie:
          e cod JavaScript obisnuit, scris intre acolade. */}
      <div className="flex flex-wrap items-center gap-2">
        {miniDemos.map(d => (
          <Button
            key={d.id}
            type="button"
            variant={d.id === active.id ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveId(d.id)}
          >
            {d.label}
          </Button>
        ))}
      </div>

      <p>{active.content}</p>
    </div>
  );
}
