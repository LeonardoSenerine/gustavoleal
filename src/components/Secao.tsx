import type { ReactNode } from "react";

type Tom = "claro" | "escuro";

// Rótulo de seção: a mesma pílula que abre o hero.
export function Rotulo({ children, tom = "claro" }: { children: ReactNode; tom?: Tom }) {
  const cores = tom === "claro" ? "bg-papel text-preto/70" : "bg-off/10 text-off/75";
  return <p className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold [font-stretch:90%] ${cores}`}>{children}</p>;
}

// Título de seção na voz do hero: grotesca leve e o final em serifa itálica.
export function Titulo({
  antes,
  destaque,
  tom = "claro",
  className = "",
}: {
  antes: string;
  destaque: string;
  tom?: Tom;
  className?: string;
}) {
  return (
    <h2 className={`text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[1] font-medium tracking-[-0.035em] text-balance ${className}`}>
      {antes}{" "}
      <span className={`font-serif text-[1.1em] tracking-[-0.01em] italic ${tom === "claro" ? "text-vinho" : "text-rosa"}`}>{destaque}</span>
    </h2>
  );
}
