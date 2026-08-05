// Pas 2 — useState.
// De ce: o variabila locala moare la finalul apelului de functie, iar o
// atribuire simpla (count++) e invizibila pentru React — nu exista
// dirty-checking, nu supravegheaza nimeni variabilele. useState rezolva ambele
// probleme: pastreaza valoarea intre re-render-uri si, prin setter, cere
// explicit redesenarea.
// Capcana: `count` e un instantaneu al randarii curente. Imediat dupa
// setCount(...) variabila `count` are tot valoarea veche; valoarea noua apare
// abia la randarea urmatoare.

import { useState } from 'react'

var clickCount = 0;

export function Counter() {
  // Componenta e o FUNCTIE pe care React o reapeleaza integral la fiecare
  // schimbare de stare, deci linia asta ruleaza din nou la fiecare click.
  // `0` e doar valoarea initiala: e folosita o singura data, la primul render,
  // si ignorata la re-render-urile urmatoare.
  const [count, setCount] = useState(0);
  // const countR = useState(0)
  // const count = countR[0];
  // const setCount = countR[1];


  return (
    <div>
      <p style={{ fontSize: 64, margin: 0 }}>{count}</p>

      {/* Forma functionala a setter-ului: React apeleaza functia noastra cu
          valoarea din coada de update-uri, nu cu `count` din closure. React nu
          aplica update-urile pe loc, le grupeaza (batching) si face un singur
          re-render la finalul handler-ului. De aceea doua apeluri
          setCount(count + 1) in acelasi handler ar citi ambele acelasi
          instantaneu si ar da 1, in timp ce setCount(c => c + 1) de doua ori se
          cumuleaza corect: 0 -> 1 -> 2. */}
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
      <button type="button" onClick={() => setCount((c) => { return c - 1 })}>
        -1
      </button>

      {/* Reset nu depinde de valoarea veche, deci aici o valoare fixa e corecta. */}
      <button type="button" onClick={() => setCount(0)}>
        Reset
      </button>
      <button type="button" onClick={() => {
        // count++; // this will not work...
        clickCount++; // this is not a good practice...
      }}>count++ ({clickCount})</button>
    </div>
  )
}
