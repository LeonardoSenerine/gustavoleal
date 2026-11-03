import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { incluso, linkWhatsApp, planos, numeroSecao } from "@/lib/content";
import { Placa } from "./Placa";

type Formato = "individual" | "dupla";

// Número que corre até o valor novo quando o formato muda.
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

function Aviao() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M21 12 3 4l3 8-3 8 18-8Z" />
    </svg>
  );
}

export function Planos() {
  const root = useRef<HTMLElement>(null);
  const [formato, setFormato] = useState<Formato>("individual");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".plano", {
          y: 120,
          opacity: 0,
          stagger: 0.1,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: ".planos-grade", start: "top 82%" },
        });
      });

      // Cartão inclina seguindo o mouse, como um ingresso na mão.
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const limpar = gsap.utils.toArray<HTMLElement>(".plano").map((plano) => {
          const cartao = plano.querySelector<HTMLElement>(".plano-cartao")!;
          const rx = gsap.quickTo(cartao, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(cartao, "rotationY", { duration: 0.6, ease: "power3.out" });
          const y = gsap.quickTo(cartao, "y", { duration: 0.6, ease: "power3.out" });
          const mover = (e: PointerEvent) => {
            const r = plano.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
            y(-8);
          };
          const sair = () => {
            rx(0);
            ry(0);
            y(0);
          };
          plano.addEventListener("pointermove", mover);
          plano.addEventListener("pointerleave", sair);
          return () => {
            plano.removeEventListener("pointermove", mover);
            plano.removeEventListener("pointerleave", sair);
          };
        });
        return () => limpar.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  return (
    <section id="planos" ref={root} className="grao relative overflow-hidden bg-preto px-4 py-24 text-off md:px-8 md:py-36">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Placa numero={numeroSecao("planos")} nome="Planos e valores" />
          <h2 className="letreiro mt-6 text-[16vw] md:text-[7.5vw]">
            Escolhe
            <br />
            <span className="text-vermelho">teu ritmo</span>
          </h2>
        </div>
        <div className="md:col-span-5">
          <p data-revela className="max-w-[42ch] text-lg leading-relaxed text-off/75">
            Valor mensal pela carga horária da semana. Estudando em dupla, cada um paga menos.
          </p>
          <div data-revela className="relative mt-6 grid w-full max-w-xs grid-cols-2 rounded-full border border-off/20 p-1" role="group" aria-label="Formato da aula">
            <span
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-vermelho transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                formato === "dupla" ? "translate-x-full" : ""
              }`}
              aria-hidden
            />
            {(["individual", "dupla"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormato(f)}
                aria-pressed={formato === f}
                className={`relative rounded-full py-2.5 text-sm font-bold uppercase transition-colors duration-500 [font-stretch:85%] ${
                  formato === f ? "text-off" : "text-off/70 hover:text-off"
                }`}
              >
                {f === "individual" ? "1 pessoa" : "2 pessoas"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="planos-grade mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {planos.map((p) => {
          const destaque = "destaque" in p && p.destaque;
          const tom = destaque
            ? { cartao: "bg-vinho bg-[linear-gradient(160deg,var(--color-vinho-claro),var(--color-vinho)_50%,var(--color-vinho-escuro))] text-off", suave: "text-off/65", linha: "border-off/30", marca: "text-off" }
            : { cartao: "bg-off text-preto", suave: "text-preto/55", linha: "border-preto/20", marca: "text-vinho" };

          return (
            <article key={p.duracao} className="plano [perspective:1200px]">
              <div className={`plano-cartao relative rounded-[18px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] [transform-style:preserve-3d] ${tom.cartao}`}>
                <div className="p-6 pb-6">
                  <div className="flex items-center justify-between">
                    <span className={`letreiro text-xl ${tom.marca}`}>Teacher Leal</span>
                    {destaque ? (
                      <span className="rounded-full bg-off px-3 py-1 text-xs font-bold text-vinho uppercase [font-stretch:85%]">Recomendado</span>
                    ) : (
                      <span className={`text-xs font-semibold uppercase [font-stretch:85%] ${tom.suave}`}>Plano mensal</span>
                    )}
                  </div>

                  {/* Rota do cartão de embarque: do português pro inglês. */}
                  <div className="mt-7 flex items-center gap-3">
                    <div>
                      <span className="letreiro block text-3xl">PT</span>
                      <span className={`text-xs ${tom.suave}`}>Português</span>
                    </div>
                    <div className={`flex flex-1 items-center gap-2 ${tom.suave}`}>
                      <span className={`h-px flex-1 border-t border-dashed ${tom.linha}`} />
                      <span className={tom.marca}>
                        <Aviao />
                      </span>
                      <span className={`h-px flex-1 border-t border-dashed ${tom.linha}`} />
                    </div>
                    <div className="text-right">
                      <span className="letreiro block text-3xl">EN</span>
                      <span className={`text-xs ${tom.suave}`}>Inglês</span>
                    </div>
                  </div>

                  <div className="mt-7">
                    <span className={`text-xs font-semibold uppercase [font-stretch:85%] ${tom.suave}`}>Carga semanal</span>
                    <p className="letreiro mt-1 text-[5.2rem] leading-[0.85]">{p.duracao}</p>
                  </div>
                </div>

                {/* Picote entre o cartão e o canhoto. */}
                <div className="relative" aria-hidden>
                  <span className="absolute -top-3.5 -left-3.5 size-7 rounded-full bg-preto" />
                  <span className="absolute -top-3.5 -right-3.5 size-7 rounded-full bg-preto" />
                  <div className={`mx-6 border-t-2 border-dashed ${tom.linha}`} />
                </div>

                <div className="p-6 pt-6">
                  <div className="flex items-end justify-between gap-3">
                    <p className="flex items-baseline gap-1">
                      <span className="text-lg font-bold">R$</span>
                      <span className="letreiro text-6xl tabular-nums">
                        <Preco valor={p[formato]} />
                      </span>
                      <span className={`text-sm ${tom.suave}`}>/mês</span>
                    </p>
                  </div>
                  <p className={`mt-1 text-xs font-semibold uppercase [font-stretch:85%] ${tom.suave}`}>
                    {formato === "dupla" ? "Em dupla · por pessoa" : "Aula individual"}
                  </p>

                  <a
                    href={linkWhatsApp(
                      `Oi, Leal! Quero saber mais do plano de ${p.duracao} por semana (${formato === "dupla" ? "em dupla" : "individual"}).`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className={`botao mt-6 w-full justify-center ${destaque ? "bg-off text-vinho hover:bg-preto hover:text-off" : "bg-preto text-off hover:bg-vermelho"}`}
                  >
                    Quero esse <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ul className="mt-14 grid gap-x-8 gap-y-3 border-t border-off/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {incluso.map((item) => (
          <li key={item} data-revela className="flex gap-3 text-off/80">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-vermelho" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
