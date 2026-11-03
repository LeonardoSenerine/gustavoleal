import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { incluso, planos } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Traco } from "./Caneta";
import { NumeroMargem, Rotulo, Titulo } from "./Secao";

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

// Uma ficha de matrícula: o aluno escolhe formato e carga semanal, o preço
// muda na hora e a caneta circula o valor de novo a cada troca.
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
          y: 100,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: ".planos-ficha", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  const descricaoPlano = `${plano.duracao} por semana, ${formato === "dupla" ? "em dupla" : "individual"}`;

  return (
    <section id="planos" ref={root} className="relative bg-off pt-20 pb-20 text-preto md:pt-32 md:pb-32">
      <NumeroMargem numero="05" />
      <div className="recuo mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <Rotulo numero="05">Planos e valores</Rotulo>
          <Titulo className="mt-6 md:mt-8">Escolha seu ritmo.</Titulo>
          <p data-revela className="mt-8 max-w-[40ch] text-lg leading-relaxed text-preto/70">
            O valor é mensal e depende de quantas horas por semana você quer estudar. Em dupla, cada um paga menos.
          </p>
          <ul className="mt-10 border-t border-preto/12">
            {incluso.map((item) => (
              <li key={item} data-revela className="flex items-center gap-4 border-b border-preto/12 py-3.5 text-lg font-medium">
                <span className="relative size-5 shrink-0" aria-hidden>
                  <Traco forma="check" espessura="2.5px" className="inset-0 h-full w-full" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="planos-ficha relative self-start overflow-hidden rounded-[3px] bg-folha shadow-[0_1px_0_rgb(13_11_10/0.06),0_40px_80px_-40px_rgb(13_11_10/0.5)] ring-1 ring-preto/8 md:col-span-6 md:col-start-7 md:mt-24">
          <div className="pauta absolute inset-0 opacity-70" aria-hidden />
          {/* Linha vermelha da margem da ficha. */}
          <span className="absolute inset-y-0 left-8 w-px bg-caneta/50 md:left-14" aria-hidden />

          <div className="relative py-7 pr-5 pl-13 md:py-10 md:pr-10 md:pl-22">
            <div className="flex items-baseline justify-between gap-4">
              <p className="nota-caps text-preto/60">Ficha de matrícula</p>
              <p className="nota text-preto/45">valor mensal</p>
            </div>

            <p className="nota-caps mt-8 text-preto/55">1. Formato</p>
            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Formato da aula">
              {formatos.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormato(f.id)}
                  aria-pressed={formato === f.id}
                  className={`rounded-[2px] border py-3 text-[0.95rem] font-semibold transition-colors duration-300 ${
                    formato === f.id ? "border-preto bg-preto text-off" : "border-preto/20 bg-folha/80 text-preto/70 hover:border-preto/60"
                  }`}
                >
                  {f.nome}
                </button>
              ))}
            </div>

            <p className="nota-caps mt-7 text-preto/55">2. Horas por semana</p>
            <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Carga semanal">
              {planos.map((p, i) => (
                <button
                  key={p.duracao}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-pressed={indice === i}
                  aria-label={`${p.extenso} por semana`}
                  className={`rounded-[2px] border py-3 text-lg font-semibold transition-colors duration-300 ${
                    indice === i ? "border-preto bg-preto text-off" : "border-preto/20 bg-folha/80 text-preto/70 hover:border-preto/60"
                  }`}
                >
                  {p.duracao}
                </button>
              ))}
            </div>

            <div className="mt-10 border-t border-preto/12 pt-8" aria-live="polite">
              <p className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">R$</span>
                <span className="relative inline-block">
                  <span className="display text-[clamp(5rem,12vw,8.5rem)] tabular-nums">
                    <Preco valor={valor} />
                  </span>
                  {/* A key nova a cada valor faz a caneta circular de novo. */}
                  <Traco key={`${formato}-${indice}`} forma="circulo" quando="agora" espessura="3px" className="!-top-[18%] !-left-[16%] !h-[130%] !w-[132%]" />
                </span>
                <span className="text-preto/55">/mês</span>
              </p>
              <p className="nota mt-4 text-preto/60">
                {plano.extenso} por semana · {formato === "dupla" ? "valor por pessoa, em dupla" : "aula individual"}
              </p>
            </div>

            <a
              href={linkPersonalizado(interesses, descricaoPlano)}
              target="_blank"
              rel="noreferrer"
              className="botao mt-9 w-full bg-caneta text-off hover:bg-preto"
            >
              Começar com a aula grátis <span className="seta" aria-hidden>→</span>
            </a>
            <p className="nota mt-3 text-center text-preto/50">A primeira aula é experimental e gratuita.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
