// Butonul de navigare din meniu. Sta in components/, nu in demos/, pentru ca nu
// demonstreaza un concept: e o bucata de UI folosita de shell.
// Nu are useState. Primeste ce sa afiseze (`step`, `title`), daca e cel activ
// (`active`) si ce sa CEARA la click (`onSelect`) — componenta controlata, exact
// tiparul de la pasul 6: date in jos, evenimente in sus.
//
// Pas 10 — inainte, tot ce vezi mai jos era un obiect `style` scris de mana:
// culoare pentru starea activa, bordura, padding, cursor. Lipseau hover, focus
// vizibil la Tab si orice tranzitie — le uitasem, ca de obicei. Acum starea
// activa e o VARIANTA a butonului, nu o lista de proprietati CSS: singurul lucru
// pe care il mai decidem aici e "default" vs "secondary".

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  step?: number;
  title: string;
  active: boolean;
  onSelect: () => void;
};

export function DemoTab({ step, title, active, onSelect }: Props) {
  return (
    <Button
      type="button"
      // Numele variantelor sunt tipate (cva): "secondari" ar fi eroare de
      // compilare, iar editorul iti propune valorile valide.
      variant={active ? "default" : "secondary"}
      size="sm"
      onClick={onSelect}
      // Cele doua clase sunt exact motivele de la pasul anterior, mutate din
      // `style` in utilitare: `relative` face butonul sistem de referinta pentru
      // badge-ul pozitionat absolut, `overflow-visible` ii da voie sa iasa peste
      // margine. Ajung aici prin `cn()`, deci nu se ciocnesc cu clasele variantei.
      className="relative overflow-visible"
    >
      {title}
      {step !== undefined && (
        <span
          className={cn(
            // `absolute` scoate elementul din flux: nu ocupa spatiu, deci nu
            // ingusteaza numele conceptului. -right-2/-top-2 sunt valori negative
            // din scala de spacing, adica -8px.
            "absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-xs leading-none",
            // Badge-ul inverseaza culorile butonului, ca sa ramana lizibil pe
            // ambele variante. Fara `cn()`, cele doua seturi ar ajunge amandoua in
            // atributul class si ar castiga cine e mai jos in CSS-ul generat, nu
            // cine e scris ultimul aici.
            active ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
          )}
        >
          {step}
        </span>
      )}
    </Button>
  );
}
