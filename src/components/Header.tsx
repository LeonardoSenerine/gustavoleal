import { linkWhatsApp, temDepoimentos } from "@/lib/content";

const links = [
  { href: "#apresentacao", label: "Quem é" },
  { href: "#metodo", label: "Método" },
  ...(temDepoimentos ? [{ href: "#alunos", label: "Alunos" }] : []),
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#planos", label: "Planos" },
];

type Props = {
  /** Fora da página inicial, o menu de seções some e o logo leva de volta pro início. */
  interna?: boolean;
};

export function Header({ interna = false }: Props) {
  return (
    <header data-header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex items-center justify-between gap-4 rounded-full bg-preto/75 py-2 pr-2 pl-2 backdrop-blur-md">
        <a href={interna ? "/" : "#topo"} className="flex items-center gap-3" aria-label="Gustavo Leal, início">
          <span className="rounded-full bg-vinho px-4 py-1.5">
            <span className="letreiro block text-2xl leading-none text-off">Leal</span>
          </span>
          <span className="etiqueta hidden text-off/70 sm:block">English teacher</span>
        </a>

        {!interna && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Seções">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="etiqueta rounded-full px-3 py-2 text-off/80 transition-colors hover:bg-off/10 hover:text-off">
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="botao bg-vermelho !py-2.5 !text-sm text-off hover:bg-off hover:text-preto">
          Aula experimental
        </a>
      </div>
    </header>
  );
}
