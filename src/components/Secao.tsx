import type { ReactNode } from "react";

// Título de seção: Archivo estreita, pesada e em caixa alta.
export function Titulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`display text-[clamp(3.1rem,10.5vw,8.6rem)] text-balance ${className}`}>{children}</h2>;
}
