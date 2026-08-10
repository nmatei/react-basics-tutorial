// Butonul de navigare din meniu. Sta in components/, nu in demos/, pentru ca nu
// demonstreaza un concept: e o bucata de UI folosita de shell.
// Nu are useState. Primeste ce sa afiseze (`step`, `title`), daca e cel activ
// (`active`) si ce sa CEARA la click (`onSelect`) — componenta controlata, exact
// tiparul de la pasul 6: date in jos, evenimente in sus.

type Props = {
  step?: number;
  title: string;
  active: boolean;
  onSelect: () => void;
};

export function DemoTab({ step, title, active, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        // `relative` nu muta butonul cu nimic; il face SISTEM DE REFERINTA pentru
        // copiii pozitionati absolut. Fara linia asta, badge-ul s-ar aseza fata de
        // pagina, nu fata de buton.
        position: "relative",
        // Badge-ul iese peste marginea butonului, deci butonul nu are voie sa taie
        // ce depaseste. `visible` e valoarea implicita — o scriem ca sa fie explicit.
        overflow: "visible",
        borderRadius: 8,
        padding: "6px 12px",
        cursor: "pointer",
        border: active ? "2px solid var(--accent)" : "2px solid transparent",
        background: active ? "var(--accent-bg)" : "transparent",
        color: active ? "var(--accent)" : "inherit"
      }}
    >
      {title}
      {step !== undefined && (
        <span
          style={{
            // `absolute` scoate elementul din flux: nu mai ocupa spatiu, deci nu
            // imbulzeste textul butonului. De asta numarul poate sta in colt fara sa
            // ingusteze numele conceptului.
            position: "absolute",
            top: -8,
            right: -6,
            fontSize: 11,
            lineHeight: 1,
            padding: "2px 5px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "var(--bg)"
          }}
        >
          {step}
        </span>
      )}
    </button>
  );
}
