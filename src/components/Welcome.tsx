// Pagina de start generata de Vite, mutata aici din App.tsx ca App.tsx sa
// ramana doar un shell. Nu demonstreaza niciun concept React — o pastram ca
// punct de plecare si pentru experimentele din pasul 1 (props).

import reactLogo from "@/assets/react.svg";
import viteLogo from "@/assets/vite.svg";
import heroImg from "@/assets/hero.png";

// Props tipate cu un tip local, in acelasi fisier. `?` = optional.
type TestButtonProps = { width?: number; title?: string };

function TestButton(props: TestButtonProps) {
  // ?? = "nullish coalescing": ia partea dreapta doar daca stanga e null/undefined.
  return <button style={{ width: props.width ?? "auto", padding: "8px", margin: 5 }}>{props.title}</button>;
}

function Hero() {
  return (
    <div className="hero">
      <img src={heroImg} className="base" width="170" height="179" alt="" />
      <img src={reactLogo} className="framework" alt="React logo" />
      <img src={viteLogo} className="vite" alt="Vite logo" />
    </div>
  );
}

export function Welcome() {
  // Experimentul din pasul 1: o componenta e doar o functie care returneaza un
  // OBIECT (descrierea UI-ului), nu HTML si nu un obiect viu care se redeseneaza
  // singur. Vezi in consola ce se printeaza.
  const b1 = TestButton({ width: 150, title: "Button fn call" });
  console.log("b1", b1);

  return (
    <>
      <section id="center">
        <Hero />
        <div>
          <h2>Get started</h2>
          {/* Aceeasi componenta, doua forme: ca element JSX (React o apeleaza)
              si ca apel de functie direct (o apelam noi). */}
          <TestButton width={200} title="My First Button" />
          {TestButton({ width: 100, title: "fn call" })}
          {b1}
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}
