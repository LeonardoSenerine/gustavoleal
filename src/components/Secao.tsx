import type { ReactNode } from "react";

type Tom = "claro" | "escuro";

// Rótulo de seção como anotação de caderno: número em vermelho, um fio e o nome.
export function Rotulo({ numero, children, tom = "claro" }: { numero: string; children: ReactNode; tom?: Tom }) {
  return (
    <p className={`nota-caps flex items-center gap-3 ${tom === "claro" ? "text-preto/60" : "text-off/60"}`}>
      <span className="text-caneta">{numero}</span>
      <span className="h-px w-8 bg-current opacity-40" aria-hidden />
      {children}
    </p>
  );
}

// Número da seção escrito na margem, à esquerda da linha vermelha (só no desktop).
export function NumeroMargem({ numero, tom = "claro" }: { numero: string; tom?: Tom }) {
  return (
    <span
      className={`nota-caps absolute left-0 hidden w-[var(--margem)] justify-center md:flex ${tom === "claro" ? "text-preto/45" : "text-off/45"}`}
      aria-hidden
    >
      {numero}
    </span>
  );
}

// Título de seção: Archivo estreita, pesada e em caixa alta.
export function Titulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`display text-[clamp(3.1rem,10.5vw,8.6rem)] text-balance ${className}`}>{children}</h2>;
}
