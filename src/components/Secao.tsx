import { useState, type ReactNode } from "react";

// Título de seção: Archivo estreita, pesada e em caixa alta.
export function Titulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`display text-[clamp(3.1rem,10.5vw,8.6rem)] text-balance ${className}`}>{children}</h2>;
}

// Legenda em inglês, como a tradução que o teacher escreve em vermelho
// embaixo da frase. lang="en" pro leitor de tela pronunciar em inglês.
// No vinho, a legenda vai em rosa: vermelho sobre vinho não dá leitura.
export function Ingles({ children, className = "", tom = "claro" }: { children: ReactNode; className?: string; tom?: "claro" | "escuro" | "vinho" }) {
  return (
    <p
      lang="en"
      className={`text-[clamp(1.2rem,2.1vw,1.85rem)] leading-tight font-medium tracking-[-0.02em] ${tom === "claro" ? "text-caneta-escura" : tom === "escuro" ? "text-caneta-clara" : "text-rosa"} ${className}`}
    >
      {children}
    </p>
  );
}

// No celular, o texto longo fica guardado atrás de um "Ler mais" pra página
// não virar um paredão. A partir do tablet ele aparece sempre.
export function LerMais({ children, className = "", tom = "claro" }: { children: ReactNode; className?: string; tom?: "claro" | "escuro" }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <div className={`${aberto ? "animate-[abrir_0.6s_cubic-bezier(.22,1,.36,1)]" : "max-md:hidden"} ${className}`}>{children}</div>
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          className={`group flex items-center gap-2 self-start text-[0.95rem] font-semibold underline decoration-2 underline-offset-[6px] md:hidden ${
            tom === "claro" ? "text-preto decoration-caneta" : "text-off decoration-rosa"
          }`}
        >
          Ler mais
          <span className="transition-transform duration-300 group-active:translate-y-0.5" aria-hidden>
            ↓
          </span>
        </button>
      )}
    </>
  );
}
