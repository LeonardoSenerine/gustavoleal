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

// Cabeçalho reto, como o topo de uma folha: nome à esquerda, seções em mono
// e o botão da aula grátis.
export function Header({ interna = false }: Props) {
  const interesses = useInteresses();

  return (
    <header data-header className="fixed inset-x-0 top-0 z-50 border-b border-preto/10 bg-off/85 backdrop-blur-md">
      <div className="recuo mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4">
        <a href={interna ? "/" : "#topo"} className="flex items-baseline gap-3" aria-label="Gustavo Leal, início">
          <span className="display text-[1.65rem] leading-none">Gustavo Leal</span>
          <span className="nota hidden text-preto/50 sm:inline">teacher de inglês</span>
        </a>

        {!interna && (
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Seções">
            {links.map((l, i) => (
              <a key={l.href} href={l.href} className="nota-caps group flex gap-1.5 text-preto/60 transition-colors hover:text-preto">
                <span className="text-caneta/0 transition-colors group-hover:text-caneta">{String(i + 2).padStart(2, "0")}</span>
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <a
          href={linkPersonalizado(interesses)}
          target="_blank"
          rel="noreferrer"
          className="botao bg-preto !py-2.5 !text-sm text-off hover:bg-caneta"
        >
          Aula grátis <span className="seta" aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
