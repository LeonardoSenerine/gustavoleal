import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../style.css";

// Monta uma página avulsa (404, privacidade) com o mesmo CSS do site.
export function montar(pagina: ReactNode) {
  const raiz = document.getElementById("root");
  if (!raiz) throw new Error('Root element with id "root" was not found.');
  createRoot(raiz).render(<StrictMode>{pagina}</StrictMode>);
}
