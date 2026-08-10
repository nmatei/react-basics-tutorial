// Pas 11 — hook custom (useWindowSize).
// De ce exista si al doilea exemplu: useCounter ar putea lasa impresia ca un hook
// custom e doar "useState impachetat". Aici se vede ca poate ascunde ORICE logica
// de stare — inclusiv un useEffect cu abonament la un eveniment din browser si
// cleanup-ul lui. Fara hook, cele opt linii de mai jos (plus cleanup-ul, care se
// uita cel mai des) s-ar copia in fiecare componenta care are nevoie de latimea
// ferestrei.
// Acelasi principiu ca la useCounter: doua componente care cheama useWindowSize()
// au fiecare listener-ul si state-ul LOR. Se intampla sa afiseze acelasi numar
// pentru ca citesc aceeasi fereastra — dar nu partajeaza valoarea.

import { useEffect, useState } from "react";

export function useWindowSize() {
  // Valoarea initiala se citeste direct din `window`, nu se pune 0: pana la prima
  // redimensionare nu ar exista niciun eveniment care sa o corecteze, iar efectul
  // ruleaza abia DUPA prima randare.
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    function onResize() {
      // Obiect NOU la fiecare eveniment. Daca am muta doua proprietati intr-un
      // obiect existent, React ar compara aceeasi referinta cu ea insasi si nu ar
      // vedea nicio schimbare.
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", onResize);

    // Cleanup obligatoriu: fara el, fiecare intrare in ecran ar adauga inca un
    // listener pe un `window` care nu dispare niciodata — abonamente zombie.
    // removeEventListener are nevoie de ACEEASI referinta de functie, motiv pentru
    // care `onResize` e declarata in efect, nu inline in addEventListener.
    return () => window.removeEventListener("resize", onResize);
    // Dependinte []: ne abonam o singura data, la montare.
  }, []);

  return size;
}
