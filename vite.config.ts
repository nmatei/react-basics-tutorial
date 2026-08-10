import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Path alias — jumatatea "bundler" a aliasului @/: rezolvarea reala a
  // fisierului pe disc, la `npm run dev` si la `vite build`. Fara ea, tipurile
  // sunt verzi in editor dar build-ul crapa cu "Failed to resolve import".
  // Trebuie sa spuna acelasi lucru ca `paths` din tsconfig.app.json.
  resolve: {
    // Calea trebuie sa fie ABSOLUTA: aliasul se aplica din orice fisier, deci o
    // cale relativa n-ar avea fata de ce sa se rezolve.
    // Tutorialele scriu aici `path.resolve(__dirname, "./src")`. __dirname exista
    // doar in modulele CommonJS; proiectul e ESM ("type": "module"), iar Vite 8
    // avertizeaza explicit. `import.meta.dirname` e echivalentul ESM.
    alias: {
      "@": path.resolve(import.meta.dirname, "./src")
    }
  }
});
