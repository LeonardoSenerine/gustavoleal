import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { incluso, planos } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Ingles, Titulo } from "./Secao";

type Formato = "individual" | "dupla";

const formatos: { id: Formato; nome: string }[] = [
  { id: "individual", nome: "1 pessoa" },
  { id: "dupla", nome: "2 pessoas" },
];

// Número que corre até o valor novo quando a escolha muda.
function Preco({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const atual = useRef({ v: valor });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      atual.current.v = valor;
      el.textContent = String(valor);
      return;
    }
    const tween = gsap.to(atual.current, {
      v: valor,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = String(Math.round(atual.current.v));
      },
    });
    return () => {
      tween.kill();
    };
  }, [valor]);

  // O React só escreve o valor inicial; as trocas ficam por conta do tween.
  const [inicial] = useState(valor);
  return <span ref={ref}>{inicial}</span>;
}

// O aluno escolhe formato e carga semanal, e o preço muda na hora.
export function Planos() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();
  const [formato, setFormato] = useState<Formato>("individual");
  const [indice, setIndice] = useState(0);
  const plano = planos[indice];
  const valor = plano[formato];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".planos-ficha", {
          y: 60,
          opacity: 0,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: ".planos-ficha", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  const descricaoPlano = `${plano.duracao} por semana, ${formato === "dupla" ? "em dupla" : "individual"}`;

  return (
    <section id="planos" ref={root} className="relative bg-off pt-20 pb-20 text-preto md:pt-32 md:pb-32">
      <div className="recuo mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <Titulo>Escolha seu ritmo.</Titulo>
          <Ingles className="mt-4 md:mt-6">Pick your pace.</Ingles>
          <p data-revela className="mt-8 max-w-[40ch] text-lg leading-relaxed text-preto/70">
            O valor é mensal e depende de quantas horas por semana você quer estudar. Em dupla, cada um paga menos.
          </p>
          <ul className="mt-10 border-t border-preto/12">
            {incluso.map((item) => (
              <li key={item} data-revela className="flex items-center gap-4 border-b border-preto/12 py-3.5 text-lg font-medium">
                <span className="h-[2px] w-4 shrink-0 bg-caneta" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="planos-ficha relative self-start overflow-hidden rounded-[3px] bg-vinho text-off shadow-[0_50px_90px_-40px_rgb(61_9_18/0.75)] md:col-span-6 md:col-start-7 md:mt-24">
          <div className="pauta-clara absolute inset-0" aria-hidden />
          <div className="relative p-6 md:p-10">
            <p className="text-sm font-medium text-off/60">Formato</p>
            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Formato da aula">
              {formatos.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormato(f.id)}
                  aria-pressed={formato === f.id}
                  className={`rounded-[2px] border py-3 text-[0.95rem] font-semibold transition-colors duration-300 ${
                    formato === f.id ? "border-off bg-off text-vinho" : "border-off/25 text-off/80 hover:border-off/60"
                  }`}
                >
                  {f.nome}
                </button>
              ))}
            </div>

            <p className="mt-7 text-sm font-medium text-off/60">Horas por semana</p>
            <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Carga semanal">
              {planos.map((p, i) => (
                <button
                  key={p.duracao}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-pressed={indice === i}
                  aria-label={`${p.extenso} por semana`}
                  className={`rounded-[2px] border py-3 text-lg font-semibold transition-colors duration-300 ${
                    indice === i ? "border-off bg-off text-vinho" : "border-off/25 text-off/80 hover:border-off/60"
                  }`}
                >
                  {p.duracao}
                </button>
              ))}
            </div>

            <div className="mt-10 border-t border-off/15 pt-8" aria-live="polite">
              <p className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">R$</span>
                <span className="display text-[clamp(5rem,12vw,8.5rem)] tabular-nums">
                  <Preco valor={valor} />
                </span>
                <span className="text-off/60">/mês</span>
              </p>
              <p className="mt-4 text-off/70">
                {plano.extenso} por semana · {formato === "dupla" ? "valor por pessoa, em dupla" : "aula individual"}
              </p>
            </div>

            <a
              data-agendar href={linkPersonalizado(interesses, descricaoPlano)}
              target="_blank"
              rel="noreferrer"
              className="botao mt-9 w-full bg-off text-vinho hover:bg-preto hover:text-off"
            >
              Começar com a aula grátis <span className="seta" aria-hidden>→</span>
            </a>
            <p className="mt-3 text-center text-sm text-off/60">A primeira aula é experimental e gratuita.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
