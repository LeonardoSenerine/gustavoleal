import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { incluso, planos } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Rotulo, Titulo } from "./Secao";

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

// Um cartão só: o aluno escolhe formato e carga semanal, e o preço muda na hora.
export function Planos() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();
  const [formato, setFormato] = useState<Formato>("individual");
  const [indice, setIndice] = useState(0);
  const plano = planos[indice];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".planos-cartao", {
          y: 100,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: ".planos-cartao", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  const descricaoPlano = `${plano.duracao} por semana, ${formato === "dupla" ? "em dupla" : "individual"}`;

  return (
    <section id="planos" ref={root} className="relative bg-off px-4 py-24 text-preto md:px-8 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:items-center md:gap-8">
        <div className="md:col-span-5">
          <Rotulo>Planos e valores</Rotulo>
          <Titulo antes="Escolha" destaque="seu ritmo." className="mt-6" />
          <p data-revela className="mt-6 max-w-[42ch] text-lg leading-relaxed text-preto/70">
            O valor é mensal e depende de quantas horas por semana você quer estudar. Em dupla, cada um paga menos.
          </p>
          <ul className="mt-8 grid gap-3">
            {incluso.map((item) => (
              <li key={item} data-revela className="flex items-center gap-3 font-medium">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-vinho text-xs text-off" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="planos-cartao rounded-[28px] bg-preto bg-[radial-gradient(90%_70%_at_20%_0%,var(--color-vinho),transparent_70%),linear-gradient(180deg,var(--color-vinho-escuro),var(--color-preto)_70%)] p-6 text-off shadow-[0_40px_80px_-30px_rgb(61_9_18/0.55)] md:col-span-6 md:col-start-7 md:p-9">
          <p className="text-sm font-semibold text-off/60">Formato</p>
          <div className="relative mt-2 grid grid-cols-2 rounded-full bg-off/10 p-1" role="group" aria-label="Formato da aula">
            <span
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-off transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                formato === "dupla" ? "translate-x-full" : ""
              }`}
              aria-hidden
            />
            {formatos.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormato(f.id)}
                aria-pressed={formato === f.id}
                className={`relative rounded-full py-3 text-sm font-semibold transition-colors duration-500 ${formato === f.id ? "text-vinho" : "text-off/70 hover:text-off"}`}
              >
                {f.nome}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm font-semibold text-off/60">Horas por semana</p>
          <div className="mt-2 grid grid-cols-4 gap-2" role="group" aria-label="Carga semanal">
            {planos.map((p, i) => (
              <button
                key={p.duracao}
                type="button"
                onClick={() => setIndice(i)}
                aria-pressed={indice === i}
                aria-label={`${p.extenso} por semana`}
                className={`rounded-2xl border py-3 text-lg font-semibold transition-colors duration-300 ${
                  indice === i ? "border-off bg-off text-vinho" : "border-off/20 text-off/80 hover:border-off/50"
                }`}
              >
                {p.duracao}
              </button>
            ))}
          </div>

          <div className="mt-8 border-t border-off/15 pt-7" aria-live="polite">
            <p className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold">R$</span>
              <span className="text-[clamp(3.6rem,8vw,5.2rem)] leading-none font-medium tracking-[-0.04em] tabular-nums">
                <Preco valor={plano[formato]} />
              </span>
              <span className="text-off/60">/mês</span>
            </p>
            <p className="mt-2 text-off/70">
              {plano.extenso} por semana · {formato === "dupla" ? "valor por pessoa, em dupla" : "aula individual"}
            </p>
          </div>

          <a
            href={linkPersonalizado(interesses, descricaoPlano)}
            target="_blank"
            rel="noreferrer"
            className="botao mt-8 w-full justify-center bg-off text-vinho hover:bg-vermelho hover:text-off"
          >
            Começar com a aula grátis
          </a>
          <p className="mt-3 text-center text-sm text-off/55">A primeira aula é experimental e gratuita.</p>
        </div>
      </div>
    </section>
  );
}
