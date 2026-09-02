// Bloc de cod reutilizabil, extras cand al doilea demo a avut nevoie de el.
// <pre> pastreaza spatiile si newline-urile exact cum sunt in string; intr-un <div>
// obisnuit browserul le-ar colapsa intr-un singur spatiu.

type Props = { children: string };

export function CodeBlock({ children }: Props) {
  return (
    <pre className="bg-secondary text-secondary-foreground overflow-x-auto rounded-lg p-4 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}
