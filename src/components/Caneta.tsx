import type { CSSProperties, ReactNode } from "react";

// Traços da caneta vermelha do teacher, desenhados à mão em SVG. Sem
// non-scaling-stroke de propósito: com ele o tracejado passa a contar em
// pixels de tela e o desenho para no meio. Cada path
// tem pathLength="1", então o Movimento (rolagem) ou a classe .tracar
// (interação) desenham o traço de 0 a 1.
const formas = {
  risco: {
    viewBox: "0 0 300 40",
    d: ["M4 23C60 17 120 26 180 20S270 18 296 22", "M10 29C80 25 160 31 292 25"],
    posicao: "left-[-3%] top-[24%] h-[56%] w-[106%]",
  },
  sublinhado: {
    viewBox: "0 0 300 30",
    d: ["M3 12C70 6 170 18 297 9", "M30 22C110 17 200 23 270 18"],
    posicao: "left-[-2%] top-[84%] h-[30%] w-[104%]",
  },
  circulo: {
    viewBox: "0 0 200 100",
    d: ["M128 8C80 0 18 10 8 46C0 82 70 98 128 92C186 86 204 54 184 28C168 8 120 2 86 10"],
    posicao: "left-[-14%] top-[-20%] h-[136%] w-[128%]",
  },
  check: {
    viewBox: "0 0 40 40",
    d: ["M5 21C9 25 13 30 16 35C22 22 30 11 38 3"],
    posicao: "",
  },
  seta: {
    viewBox: "0 0 120 120",
    d: ["M8 10C44 4 92 28 100 98", "M82 84C90 89 96 95 100 101C103 92 107 84 114 77"],
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

// Palavra marcada pela caneta: risco, sublinhado ou círculo em volta.
export function Marca({
  forma,
  children,
  className = "",
  ...resto
}: { forma: "risco" | "sublinhado" | "circulo"; children: ReactNode; className?: string } & Omit<TracoProps, "forma" | "className">) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      {children}
      <Traco forma={forma} {...resto} />
    </span>
  );
}
