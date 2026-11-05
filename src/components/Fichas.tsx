import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experiencias } from "@/lib/content";
import { alternarInteresse, linkPersonalizado, listarInteresses, useInteresses } from "@/lib/interesses";
import { LoopVideo } from "./LoopVideo";
import { Traco } from "./Caneta";

// Inclinação de cada ficha no desktop, como fichas soltas na mesa.
const inclinacao = ["md:-rotate-[1.6deg]", "md:rotate-[1.1deg]", "md:-rotate-[0.6deg]", "md:rotate-[1.8deg]"];

// Fichas de estudo: o visitante marca o que quer destravar e isso vai junto
// na mensagem do WhatsApp (ver lib/interesses.ts). "cabecalho" mostra a
// pergunta em cima; a versão 3 do hero usa as fichas sem ele.
export function Fichas({ cabecalho = true, className = "" }: { cabecalho?: boolean; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const interesses = useInteresses();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ficha", {
          y: 70,
          opacity: 0,
          stagger: 0.09,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 92%" },
        });
      });

      // As fichas sobem em velocidades diferentes enquanto a página rola.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".ficha-movel").forEach((ficha, i) => {
          gsap.to(ficha, {
            yPercent: [-8, -18, -4, -14][i % 4],
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative ${className}`}>
      {cabecalho && (
        <div className="recuo mx-auto flex max-w-[1500px] flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <p className="text-2xl leading-tight font-medium tracking-[-0.02em] md:text-3xl">O que você quer destravar?</p>
          <p className="text-preto/55">Marque quantos quiser. Vai junto na mensagem.</p>
        </div>
      )}

      <div
        className={`recuo mx-auto flex max-w-[1500px] snap-x snap-mandatory gap-4 overflow-x-auto pt-4 pb-8 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-6 md:overflow-visible ${cabecalho ? "mt-8 md:mt-12" : ""}`}
        role="group"
        aria-label="Escolha o foco das suas aulas"
      >
        {experiencias.map((e, i) => {
          const marcado = interesses.includes(e.id);
          return (
            <div key={e.id} className="ficha-movel w-[72vw] max-w-[320px] shrink-0 snap-start scroll-ml-[calc(var(--margem)+1.15rem)] md:w-auto md:max-w-none">
              <button
                type="button"
                onClick={() => alternarInteresse(e.id)}
                aria-pressed={marcado}
                aria-label={`${e.titulo}: ${e.texto}`}
                className="ficha group block w-full text-left"
              >
                <span
                  className={`block rounded-[3px] bg-folha p-2.5 pb-5 shadow-[0_1px_0_rgb(13_11_10/0.06),0_24px_50px_-28px_rgb(13_11_10/0.45)] ring-1 transition-[translate,rotate,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2 md:group-hover:rotate-0 ${inclinacao[i % 4]} ${
                    marcado ? "ring-caneta" : "ring-preto/8"
                  }`}
                >
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-papel">
                    {e.video ? (
                      <LoopVideo name={e.video} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <img src={`/fotos/${e.foto}-700.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </span>

                  <span className="mt-4 flex items-start justify-between gap-3 px-1.5">
                    <span>
                      <span className="display block text-[2.6rem] md:text-[clamp(2.2rem,3.2vw,3.2rem)]">{e.ingles}</span>
                      <span className="nota mt-1 block text-preto/55">
                        {e.fonetica} · {e.titulo.toLowerCase()}
                      </span>
                    </span>
                    {/* Caixinha de marcar, com o ✓ da caneta. */}
                    <span className={`relative mt-1 grid size-8 shrink-0 place-items-center border transition-colors ${marcado ? "border-caneta" : "border-preto/30"}`} aria-hidden>
                      {marcado && <Traco forma="check" quando="agora" espessura="3px" className="-top-2 left-0.5 h-10 w-9" />}
                    </span>
                  </span>
                  <span className="mt-3 block px-1.5 text-[0.95rem] leading-snug text-preto/70">{e.texto}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="recuo mx-auto mt-2 flex min-h-[3.5rem] max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-3" aria-live="polite">
        {interesses.length > 0 ? (
          <>
            <p className="text-lg text-preto/80">
              Sua aula grátis com foco em <strong className="font-semibold text-caneta-escura">{listarInteresses(interesses)}</strong>.
            </p>
            <a data-agendar href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-caneta text-off hover:bg-preto">
              Agendar com esse foco <span className="seta" aria-hidden>→</span>
            </a>
          </>
        ) : (
          <p className="text-sm text-preto/45">Nenhuma ficha marcada ainda.</p>
        )}
      </div>
    </div>
  );
}
