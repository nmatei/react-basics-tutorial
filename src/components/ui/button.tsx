// Pas 10 — fisierul asta NU a fost scris de noi, dar de acum ne apartine: l-a
// COPIAT aici `npx shadcn@latest add button`. E in git, il poti citi si modifica.
// Ce merita observat inainte sa-l schimbi:
//   - cva() = tabelul de variante. Sirul lung de la inceput e baza comuna; acolo
//     stau exact lucrurile pe care le uitam scriind butoane de mana:
//     focus-visible:ring-* (inelul de la Tab), disabled:pointer-events-none,
//     disabled:opacity-50, aria-invalid:*, transition-all.
//   - VariantProps<typeof buttonVariants> deduce tipul variantelor DIN tabel, deci
//     nu exista o a doua lista de tinut sincronizata.
//   - React.ComponentProps<"button"> aduce toate atributele unui <button> nativ
//     (onClick, disabled, type...), asa ca <Button> se comporta ca un buton.
//   - `asChild` + Slot.Root: randeaza clasele butonului PESTE alt element (de ex.
//     un <a>), fara sa ajungi cu un link inauntrul unui buton.
//   - cn(...) la className: ce trimiti din afara are ultimul cuvant (vezi lib/utils).
// Singura regula: daca rulezi din nou comanda `add button`, modificarile de aici se
// pierd. Le versionam in git tocmai ca sa se vada in diff.

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Prima modificare facuta de noi in fisierul copiat, ca dovada ca se poate: regula
// de lint cere ca un fisier sa exporte doar componente (altfel hot reload-ul din Vite
// reincarca pagina intreaga). buttonVariants nu e componenta, dar il exporta si alte
// componente shadcn, deci ramane — cu regula oprita explicit pe linia asta.
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
