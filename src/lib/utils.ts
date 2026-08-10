// Helperul pe care il cere fiecare componenta shadcn/ui. Trei randuri, dar fara ele
// componentele n-ar fi personalizabile din afara.
//
// clsx: construieste un string de clase din bucati, sarind peste false/undefined/null.
//   clsx("btn", activ && "btn-activ") -> "btn btn-activ" sau doar "btn".
//
// twMerge: rezolva CONFLICTELE dintre utilitare Tailwind. Capcana pe care o repara:
//   in CSS nu castiga clasa scrisa ultima in atributul class, ci regula scrisa mai jos
//   in fisierul CSS generat. Deci class="px-4 px-2" NU garanteaza px-2 — ordinea din
//   HTML e ignorata. twMerge("px-4", "px-2") returneaza doar "px-2", pentru ca stie ca
//   cele doua ating aceeasi proprietate.
// De asta ordinea din cn() conteaza: ce vine din afara (className) se pune ULTIMUL,
// ca sa poata invinge stilul implicit al componentei.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ClassValue = string | number | null | boolean | undefined | array | obiect.
// `...inputs` e rest parameter (params in C#, *args in Python): aduna toate
// argumentele intr-un array.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
