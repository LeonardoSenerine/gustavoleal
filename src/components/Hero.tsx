import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experiencias } from "@/lib/content";
import { alternarInteresse, linkPersonalizado, listarInteresses, useInteresses } from "@/lib/interesses";
import { LoopVideo } from "./LoopVideo";

const primeiraLinha = "Inglês pra viver o mundo.";

// Abertura clara e centralizada: a promessa em duas vozes (grotesca e serifa
// itálica) e, embaixo, um balão de fala escuro, já que a aula é conversa.
// Os cartões saem de dentro do balão e são escolhas: o que o visitante marca
// vai junto na mensagem do WhatsApp. A ponta do balão aponta pro vídeo dele
// na seção seguinte, ligando as duas.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".hero-sobe", { y: 24, opacity: 0, stagger: 0.08, duration: 1.1 })
          .from(".hero-palavra", { yPercent: 60, opacity: 0, stagger: 0.06, duration: 1.2 }, 0.1)
          .from(".hero-serifa", { y: 30, opacity: 0, filter: "blur(10px)", duration: 1.4 }, 0.45)
          .from(".hero-balao", { scale: 0.88, opacity: 0, duration: 1.3, ease: "back.out(1.3)" }, 0.4)
          .from(".hero-ponta", { scaleY: 0, duration: 0.8, ease: "back.out(2)" }, 1)
          .from(".hero-cartao", { y: 160, opacity: 0, stagger: { each: 0.09, from: "center" }, duration: 1.5 }, 0.6)
          .from(".hero-escolha", { y: 16, opacity: 0, duration: 1 }, 1.1);
      });

      // No desktop, os cartões das pontas sobem mais rápido que os do meio
      // e escapam pela borda de cima do balão enquanto a página rola.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const rolagem = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        const cartoes = gsap.utils.toArray<HTMLElement>(".hero-cartao");
        const meio = (cartoes.length - 1) / 2;
        cartoes.forEach((cartao, i) => {
          gsap.to(cartao, { yPercent: -10 - Math.abs(i - meio) * 12, ease: "none", scrollTrigger: rolagem });
        });
        gsap.to(".hero-ponta", { scaleY: 1.35, ease: "none", scrollTrigger: rolagem });
      });
    },
    { scope: root },
  );

  return (
    <section id="topo" ref={root} className="relative bg-off pt-32 pb-20 text-preto md:pt-40 md:pb-24">
      <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
        <p className="hero-sobe inline-flex rounded-full bg-papel px-4 py-1.5 text-sm font-semibold text-preto/70 [font-stretch:90%]">
          Trabalho · Viagens · Cultura · Novas perspectivas
        </p>

        <h1 className="mt-6 text-[clamp(2.6rem,6.6vw,5.6rem)] leading-[0.98] font-medium tracking-[-0.035em]">
          <span className="sr-only">Inglês pra viver o mundo. Não pra decorar regra.</span>
          <span className="block" aria-hidden>
            {primeiraLinha.split(" ").map((palavra, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="hero-palavra inline-block">{palavra}</span>
              </Fragment>
            ))}
          </span>
          <span className="hero-serifa block font-serif text-[1.12em] tracking-[-0.01em] text-vinho italic" aria-hidden>
            Não pra decorar regra.
          </span>
        </h1>

        <p className="hero-sobe mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-preto/70">
          Aulas personalizadas pra você usar o inglês no trabalho, nas viagens, na cultura que você ama e no jeito de ver o mundo.
        </p>

        <div className="hero-sobe mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-vinho text-off hover:bg-vermelho">
            Agendar aula experimental grátis
          </a>
          <div className="flex items-center gap-3 text-left">
            <img src="/media/apresentacao.jpg" alt="" className="size-11 rounded-full object-cover object-[50%_28%] ring-2 ring-off" />
            <div className="leading-tight">
              <p className="text-sm font-bold">Gustavo Leal</p>
              <p className="text-sm text-preto/60">Online ou presencial</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-2 mt-16 md:mx-4 md:mt-24">
        <div className="hero-balao relative rounded-[28px] bg-preto bg-[radial-gradient(70%_70%_at_50%_0%,var(--color-vinho),transparent_75%),linear-gradient(180deg,var(--color-vinho-escuro),var(--color-preto)_70%)] pt-8 text-off md:rounded-[40px] md:pt-10">
          <p className="hero-escolha flex items-center justify-center gap-3 px-4 pb-6 text-center text-sm font-medium text-off/80 md:text-base">
            <span className="inline-flex gap-1" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="digitando size-1.5 rounded-full bg-rosa" style={{ animationDelay: `${i * 0.16}s` }} />
              ))}
            </span>
            O que você quer destravar? Toque nos cartões pra montar sua aula.
          </p>

          <div
            className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pt-2 pb-6 [scrollbar-width:none] md:justify-center md:gap-5 md:overflow-visible md:px-8"
            role="group"
            aria-label="Escolha o foco das suas aulas"
          >
            {experiencias.map((e) => {
              const marcado = interesses.includes(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => alternarInteresse(e.id)}
                  aria-pressed={marcado}
                  className="hero-cartao group w-[66vw] max-w-[300px] shrink-0 snap-center text-left transition-[translate] duration-500 hover:-translate-y-2 sm:w-[40vw] md:w-[21vw]"
                >
                  <span
                    className={`relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-vinho-escuro shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] outline-offset-4 transition-[outline-color] duration-300 ${
                      marcado ? "outline-2 outline-off" : "outline-2 outline-transparent"
                    }`}
                  >
                    {e.video ? (
                      <LoopVideo
                        name={e.video}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={`/fotos/${e.foto}.webp`}
                        alt={e.alt ?? ""}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-preto/85 via-preto/30 to-transparent" aria-hidden />
                    <span
                      className={`absolute top-4 right-4 grid size-9 place-items-center rounded-full text-lg font-bold transition-colors duration-300 ${
                        marcado ? "bg-off text-vinho" : "bg-preto/40 text-off backdrop-blur-sm"
                      }`}
                      aria-hidden
                    >
                      {marcado ? "✓" : "+"}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-5 text-off">
                      <span className="block font-serif text-[2rem] leading-none italic">{e.titulo}</span>
                      <span className="mt-2 block text-sm leading-snug text-off/80">{e.texto}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="hero-escolha flex min-h-[4.5rem] flex-wrap items-center justify-center gap-x-5 gap-y-3 px-4 pt-4 pb-10 text-center md:pb-12"
            aria-live="polite"
          >
            {interesses.length > 0 ? (
              <>
                <p className="text-off/85">
                  Sua aula grátis com foco em <strong className="font-serif text-xl font-normal text-rosa italic">{listarInteresses(interesses)}</strong>
                </p>
                <a href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-off text-vinho hover:bg-vermelho hover:text-off">
                  Agendar com esse foco
                </a>
              </>
            ) : (
              <p className="text-sm text-off/50">Nenhum foco escolhido ainda. Pode marcar mais de um.</p>
            )}
          </div>
        </div>

        {/* Ponta do balão, alinhada com a coluna do vídeo na seção de baixo. */}
        <div className="pointer-events-none absolute inset-x-0 top-full mx-auto max-w-6xl px-4 md:px-8" aria-hidden>
          <svg
            viewBox="0 0 100 80"
            className="hero-ponta -mt-px ml-[12%] h-16 w-20 origin-top text-preto md:ml-[calc(66.666%+3rem)] md:h-24 md:w-28"
            preserveAspectRatio="none"
          >
            <path d="M0 0H100C78 6 52 30 30 80C33 46 20 16 0 0Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
