// Pas 10 — comutatorul de tema, scos din demo-ul pasului 9 si mutat in shell.
// De ce s-a mutat: acum tema nu mai priveste un singur demo, ci toate componentele
// shadcn/ui din aplicatie. Iar doua locuri care scriu aceeasi clasa pe <html> s-ar
// fi calcat reciproc — demo-ul pasului 9 stergea clasa la iesire, deci ar fi stins
// tema pusa din meniu. O stare cu un singur proprietar, ca la pasul 6.

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Tema traieste IN AFARA React-ului: o clasa pe <html>, element pe care React
  // nu-l randeaza. Exact cazul pentru useEffect — sincronizezi lumea externa cu
  // state-ul. Fata de pasul 9, aici NU mai exista cleanup care sa scoata clasa:
  // acolo era o tema locala demo-ului, aici e a aplicatiei si traieste cat ea.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Button
      variant="outline"
      // size="icon" da un buton PATRAT (size-9), nu unul cu text si padding.
      size="icon"
      onClick={() => setDark(d => !d)}
      // Butonul nu are text, deci un cititor de ecran ar anunta doar "buton".
      // aria-label ii da numele care lipseste. E genul de detaliu pe care
      // componenta gata facuta nu-l poate ghici in locul tau: ea aduce focus,
      // stari si tastatura, dar ce inseamna butonul stii doar tu.
      aria-label={dark ? "Comută pe tema deschisă" : "Comută pe tema întunecată"}
    >
      {/* Iconitele lucide sunt componente React care randeaza un <svg>. Nu le dam
          dimensiune: clasa [&_svg]:size-4 din button.tsx o face. */}
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
