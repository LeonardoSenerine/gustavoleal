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

export function Header({ interna = false }: Props) {
  const interesses = useInteresses();

  return (
    <header data-header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-preto/5 bg-off/80 py-2 pr-2 pl-5 text-preto shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md">
        <a href={interna ? "/" : "#topo"} className="flex items-baseline gap-1.5 text-xl" aria-label="Gustavo Leal, início">
          <span className="font-serif text-[1.15em] text-vinho italic">Gustavo</span>
          <span className="font-semibold tracking-tight">Leal</span>
        </a>

        {!interna && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Seções">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm font-medium text-preto/70 transition-colors hover:bg-preto/5 hover:text-preto">
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <a href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-vinho !py-2.5 !text-sm text-off hover:bg-vermelho">
          Aula grátis
        </a>
      </div>
    </header>
  );
}
