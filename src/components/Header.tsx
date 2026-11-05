import { useEffect, useState } from "react";
import { temDepoimentos } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";

const links = [
  { href: "#apresentacao", label: "Quem é" },
  { href: "#metodo", label: "Método" },
  ...(temDepoimentos ? [{ href: "#alunos", label: "Alunos" }] : []),
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#planos", label: "Planos" },
  { href: "#perguntas", label: "Dúvidas" },
];

type Props = {
  /** Fora da página inicial, o menu de seções some e o logo leva de volta pro início. */
  interna?: boolean;
};

// Diz se algum botão de agendar da página ([data-agendar]) está na tela.
// Vigia também os que aparecem depois, como o "Agendar com esse foco".
function useAgendarNaTela() {
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const visiveis = new Set<Element>();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visiveis.add(e.target);
          else visiveis.delete(e.target);
        }
        setNaTela(visiveis.size > 0);
      },
      // Desconta a faixa do cabeçalho no topo: botão escondido atrás dele não conta.
      { rootMargin: "-64px 0px 0px 0px" },
    );
    const vigiados = new Set<Element>();
    const vigiar = () => {
      document.querySelectorAll("[data-agendar]").forEach((el) => {
        if (vigiados.has(el)) return;
        vigiados.add(el);
        io.observe(el);
      });
      // Botões que saíram da página deixam de contar.
      for (const el of vigiados) {
        if (!el.isConnected) {
          vigiados.delete(el);
          visiveis.delete(el);
          io.unobserve(el);
        }
      }
      setNaTela(visiveis.size > 0);
    };
    vigiar();
    const mo = new MutationObserver(vigiar);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return naTela;
}

// Cabeçalho reto, como o topo de uma folha: nome, seções e o botão da aula
// grátis. O botão some enquanto outro botão de agendar está na tela, pra não
// repetir o mesmo convite duas vezes.
export function Header({ interna = false }: Props) {
  const interesses = useInteresses();
  const repetido = useAgendarNaTela();

  return (
    <header data-header className="fixed inset-x-0 top-0 z-50 border-b border-preto/10 bg-off/85 backdrop-blur-md">
      <div className="recuo mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4">
        <a href={interna ? "/" : "#topo"} className="flex items-baseline gap-3" aria-label="Gustavo Leal, início">
          <span className="display text-[1.65rem] leading-none">Gustavo Leal</span>
          <span className="hidden text-sm text-preto/50 sm:inline">teacher de inglês</span>
        </a>

        {!interna && (
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Seções">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-[0.95rem] font-medium text-preto/60 transition-colors duration-300 hover:text-preto">
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <a
          href={linkPersonalizado(interesses)}
          target="_blank"
          rel="noreferrer"
          inert={repetido}
          aria-hidden={repetido || undefined}
          className={`botao bg-preto !py-2.5 !text-sm text-off transition-[opacity,translate,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-caneta ${
            repetido ? "pointer-events-none translate-y-1 opacity-0" : "opacity-100"
          }`}
        >
          Aula grátis <span className="seta" aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
