import type { CSSProperties, ReactNode } from "react";

// Traços da caneta vermelha do teacher, desenhados à mão em SVG. Sem
// non-scaling-stroke de propósito: com ele o tracejado passa a contar em
// pixels de tela e o desenho para no meio. Cada path
// tem pathLength="1", então o Movimento (rolagem) ou a classe .tracar
// (interação) desenham o traço de 0 a 1.
const formas = {
  // Um traço só, firme e levemente subindo, como quem risca sem pensar duas vezes.
  risco: {
    viewBox: "0 0 300 40",
    d: ["M3 27C64 24 150 20 297 13"],
    posicao: "left-[-3%] top-[22%] h-[56%] w-[106%]",
  },
  sublinhado: {
    viewBox: "0 0 300 30",
    d: ["M4 18C90 12 200 11 296 7"],
    posicao: "left-[-2%] top-[82%] h-[30%] w-[104%]",
  },
  check: {
    viewBox: "0 0 40 40",
    d: ["M5 21C9 25 13 30 16 35C22 22 30 11 38 3"],
    posicao: "",
  },
} as const;

export type Forma = keyof typeof formas;

type TracoProps = {
  forma: Forma;
  className?: string;
  /** Espessura do traço. Em "em", acompanha o tamanho do texto. */
  espessura?: string;
  /** Segundos de espera antes de desenhar, quando entra na tela. */
  atraso?: number;
  /** "rolagem" desenha ao entrar na tela; "agora" desenha assim que monta. */
  quando?: "rolagem" | "agora";
  style?: CSSProperties;
};

export function Traco({ forma, className = "", espessura = "0.055em", atraso = 0, quando = "rolagem", style }: TracoProps) {
  const f = formas[forma];
  return (
    <svg
      viewBox={f.viewBox}
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      {...(quando === "rolagem" ? { "data-caneta": "", "data-atraso": atraso } : {})}
      className={`pointer-events-none absolute overflow-visible text-caneta ${quando === "agora" ? "tracar" : ""} ${f.posicao} ${className}`}
      style={{ strokeWidth: espessura, ...style }}
      fill="none"
    >
      {f.d.map((d) => (
        <path key={d} d={d} pathLength={1} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

// Palavra marcada pela caneta: risco ou sublinhado.
export function Marca({
  forma,
  children,
  className = "",
  ...resto
}: { forma: "risco" | "sublinhado"; children: ReactNode; className?: string } & Omit<TracoProps, "forma" | "className">) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      {children}
      <Traco forma={forma} {...resto} />
    </span>
  );
}
