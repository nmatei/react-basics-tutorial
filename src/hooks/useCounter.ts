// Pas 11 — hook custom (useCounter).
// De ce: logica "tine un numar si ofera +1 / -1 / reset" era copiata in fiecare
// componenta care avea nevoie de ea. In backend ai extras-o intr-o clasa; aici
// echivalentul e o FUNCTIE care apeleaza useState si intoarce ce ai nevoie.
// Regula unui hook custom, in intregime: numele incepe cu `use`. Nu exista clasa
// de baza, interfata, decorator sau inregistrare in vreun container. Numele e
// singurul contract — el ii spune linterului React ca aici e permis (si obligat
// sa fie verificat) apelul altor hooks.
// CEL MAI IMPORTANT: fiecare APEL al functiei creeaza un useState PROPRIU. Deci
// `useCounter()` e echivalentul lui `new Counter()`, nu al unui @Service /
// @Injectable injectat in doua clase. Codul se partajeaza, valoarea NU.

import { useCallback, useState } from "react";

export function useCounter(initial = 0, step = 1) {
  // useState-ul acesta apartine APELULUI, nu functiei. Doua apeluri in acelasi
  // component = doua sloturi diferite in lista de stare pe care React o tine
  // pentru instanta componentei. De aceea hooks nu se pot chema in `if` sau in
  // bucla: ar muta pozitiile si ai primi starea altcuiva.
  const [count, setCount] = useState(initial);

  // De ce useCallback: o functie declarata aici e RECREATA la fiecare re-render,
  // iar in JS doua functii identice la text nu sunt egale. useCallback pastreaza
  // aceeasi referinta cat timp dependintele nu se schimba — nu pentru viteza, ci
  // pentru stabilitatea identitatii (comparatii de props, dependinte de efect).
  //
  // Forma functionala `c => c + step`, nu `count + step`: callback-ul e memorat,
  // deci ar rămâne lipit de `count`-ul randarii la care s-a creat. Asa cerem
  // valoarea curenta de la React.
  const increment = useCallback(() => setCount(c => c + step), [step]);
  const decrement = useCallback(() => setCount(c => c - step), [step]);

  // Reset depinde de `initial`, nu de `step` — dependintele se scriu dupa ce
  // CITESTE functia, nu dupa un obicei. Aici o dependinta greșita nu ar da
  // eroare, ar da un bug tacut: resetare la o valoare veche.
  const reset = useCallback(() => setCount(initial), [initial]);

  // Intoarcem un OBIECT, nu un tuplu ca useState. useState isi permite tuplul
  // pentru ca ii dai numele la destructurare si are doar doua elemente. Cu patru,
  // `const [a, b, c, d] = ...` devine ilizibil. Obiectul da nume garantate si un
  // mic "namespace" la folosire: copii.count vs adulti.count — independenta se
  // vede in cod, nu doar in teorie.
  return { count, increment, decrement, reset };
}
