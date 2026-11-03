import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experiencias } from "@/lib/content";
import { alternarInteresse, linkPersonalizado, listarInteresses, useInteresses } from "@/lib/interesses";
import { LoopVideo } from "./LoopVideo";
import { Marca, Traco } from "./Caneta";

// Inclinação de cada ficha no desktop, como fichas soltas na mesa.
const inclinacao = ["md:-rotate-[1.6deg]", "md:rotate-[1.1deg]", "md:-rotate-[0.6deg]", "md:rotate-[1.8deg]"];

// A primeira folha do caderno: a promessa em letra grande, a caneta riscando
// "decorar regra" e um verbete de dicionário pra "live". Embaixo, as fichas
// de estudo: o visitante marca o que quer destravar e isso vai junto na
// mensagem do WhatsApp (ver lib/interesses.ts).
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // O título (LCP) não anima: aparece pronto. O resto entra em volta dele.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-sobe", { y: 18, opacity: 0, stagger: 0.08, duration: 1.3 }, 0.1)
          .from(".ficha", { y: 70, opacity: 0, stagger: 0.09, duration: 1.6 }, 0.4);
      });

      // As fichas sobem em velocidades diferentes enquanto a página rola.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".ficha").forEach((ficha, i) => {
          gsap.to(ficha, {
            yPercent: [-8, -18, -4, -14][i % 4],
            ease: "none",
            scrollTrigger: { trigger: ".fichas", start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-off pt-24 pb-16 text-preto md:pt-32 md:pb-28">
      <div className="pauta absolute inset-0 [mask-image:linear-gradient(to_bottom,black_30%,transparent_80%)]" aria-hidden />

      <div className="recuo relative mx-auto max-w-[1500px]">
        <h1>
          <span className="sr-only">Inglês pra viver o mundo. Não pra decorar regra.</span>
          <span className="display block text-[clamp(3.5rem,15.2vw,14.5rem)]" aria-hidden>
            Inglês pra
            <br />
            viver o mundo.
          </span>
        </h1>

        <div className="mt-6 grid gap-8 md:mt-10 md:grid-cols-12 md:items-start md:gap-6">
          <p className="hero-sobe text-[clamp(1.75rem,4.6vw,3.9rem)] leading-[1] font-medium tracking-[-0.035em] md:col-span-7" aria-hidden>
            Não pra{" "}
            <Marca forma="risco" atraso={0.6} espessura="0.075em">
              decorar regra.
            </Marca>
          </p>

          {/* Verbete de dicionário, como anotação na margem do caderno. */}
          <dl className="hero-sobe nota max-w-[34ch] border-l border-preto/15 pl-4 text-preto/70 md:col-span-4 md:col-start-9 md:mt-2">
            <dt className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[1.1rem] text-preto">live</span>
              <span>/lɪv/</span>
              <span className="text-preto/45 italic">verbo</span>
            </dt>
            <dd className="mt-1.5">1. viver; ter experiências de verdade.</dd>
            <dd>2. ao vivo; na hora, sem ensaio.</dd>
            <dd className="mt-2 text-preto/50">
              ≠ <span className="text-caneta line-through decoration-1">memorize</span> /ˈmem.ə.raɪz/ decorar.
            </dd>
          </dl>
        </div>

        <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="hero-sobe max-w-[46ch] text-lg leading-relaxed text-preto/70">
            Aulas personalizadas pra você usar o inglês no trabalho, nas viagens, na cultura que você ama e no jeito de ver o mundo.
          </p>
          <div className="hero-sobe flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-preto text-off hover:bg-caneta">
              Agendar aula experimental grátis <span className="seta" aria-hidden>→</span>
            </a>
            <span className="text-sm text-preto/55">Online ou presencial</span>
          </div>
        </div>
      </div>

      {/* Fichas de estudo que o visitante marca. */}
      <div className="relative mt-20 md:mt-36">
        <div className="recuo mx-auto flex max-w-[1500px] flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <p className="text-2xl leading-tight font-medium tracking-[-0.02em] md:text-3xl">O que você quer destravar?</p>
          <p className="text-preto/55">Marque quantos quiser. Vai junto na mensagem.</p>
        </div>

        <div
          className="fichas recuo mx-auto mt-8 flex max-w-[1500px] snap-x snap-mandatory gap-4 overflow-x-auto pt-4 pb-8 [scrollbar-width:none] md:mt-12 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible"
          role="group"
          aria-label="Escolha o foco das suas aulas"
        >
          {experiencias.map((e, i) => {
            const marcado = interesses.includes(e.id);
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => alternarInteresse(e.id)}
                aria-pressed={marcado}
                aria-label={`${e.titulo}: ${e.texto}`}
                className={`ficha group w-[72vw] max-w-[320px] shrink-0 snap-start scroll-ml-[calc(var(--margem)+1.15rem)] text-left md:w-auto md:max-w-none`}
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
                      <img src={`/fotos/${e.foto}.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
            );
          })}
        </div>

        <div className="recuo mx-auto mt-2 flex min-h-[3.5rem] max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-3" aria-live="polite">
          {interesses.length > 0 ? (
            <>
              <p className="text-lg text-preto/80">
                Sua aula grátis com foco em <strong className="font-semibold text-caneta">{listarInteresses(interesses)}</strong>.
              </p>
              <a href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-caneta text-off hover:bg-preto">
                Agendar com esse foco <span className="seta" aria-hidden>→</span>
              </a>
            </>
          ) : (
            <p className="text-sm text-preto/45">Nenhuma ficha marcada ainda.</p>
          )}
        </div>
      </div>
    </section>
  );
}
