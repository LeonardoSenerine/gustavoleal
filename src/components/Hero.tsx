import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { foto } from "@/lib/foto";
import { Marca } from "./Caneta";

function Agendar({ tom = "claro" }: { tom?: "claro" | "escuro" }) {
  const interesses = useInteresses();
  return (
    <div className="hero-sobe flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        data-agendar href={linkPersonalizado(interesses)}
        target="_blank"
        rel="noreferrer"
        className={`botao ${tom === "claro" ? "bg-preto text-off hover:bg-caneta" : "bg-off text-vinho hover:bg-caneta hover:text-off"}`}
      >
        Agendar aula experimental grátis <span className="seta" aria-hidden>→</span>
      </a>
      <span className={`text-sm ${tom === "claro" ? "text-preto/55" : "text-off/70"}`}>Online ou presencial</span>
    </div>
  );
}

// A promessa do site: título, "decorar regra" riscado e a legenda em inglês.
function Promessa({ tamanho, tom = "claro" }: { tamanho: string; tom?: "claro" | "escuro" }) {
  return (
    <div>
      <h1>
        <span className="sr-only">Inglês pra viver o mundo. Não pra decorar regra.</span>
        <span className={`display block ${tamanho}`} aria-hidden>
          Inglês pra
          <br />
          viver o mundo.
        </span>
      </h1>
      <p className="hero-sobe mt-5 text-[clamp(1.75rem,4.6vw,3.9rem)] leading-[1] font-medium tracking-[-0.035em] lg:mt-7 lg:text-[min(2.6vw,3.3rem)]" aria-hidden>
        Não pra{" "}
        <Marca forma="risco" atraso={0.9} espessura="0.075em">
          decorar regra.
        </Marca>
      </p>
      <p
        lang="en"
        className={`hero-sobe mt-4 text-lg font-medium lg:mt-5 lg:text-[min(1.5vw,1.6rem)] ${tom === "claro" ? "text-caneta-escura" : "text-rosa"}`}
      >
        Learn English to live it, not to memorize it.
      </p>
    </div>
  );
}

// Entrada comum: os textos sobem, a foto principal abre de baixo pra cima
// e assenta, e cada versão pode somar o seu momento.
function useEntrada(root: React.RefObject<HTMLElement | null>, extra?: (tl: gsap.core.Timeline) => void) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-sobe", { y: 18, opacity: 0, stagger: 0.08, duration: 1.3 }, 0.15);
        if (root.current?.querySelector(".hero-foto")) {
          tl.fromTo(".hero-foto", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 }, 0).from(
            ".hero-foto img",
            { scale: 1.18, duration: 2.2 },
            0,
          );

          // A foto desce um pouco mais devagar que a página.
          gsap.to(".hero-foto img", {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
          });
        }
        extra?.(tl);
      });
    },
    { scope: root },
  );
}

// Abertura: a promessa na folha pautada e, ao lado, o Gustavo na cabine
// vermelha com o telefone no ouvido. Por cima do retrato, o vídeo de
// apresentação toca sem som como uma chamada; "Ouvir" liga o som e a
// chamada cresce. As fichas de estudo vêm logo depois (ver Fichas.tsx).
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [comSom, setComSom] = useState(false);

  useEntrada(root, (tl) => {
    tl.from(".chamada", { y: 60, opacity: 0, scale: 0.92, duration: 1.3, ease: "back.out(1.4)" }, 0.9);
  });

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  function ouvir() {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.loop = false;
    v.controls = true;
    v.play().catch(() => {});
    setComSom(true);
  }

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-off text-preto">
      <div className="relative lg:grid lg:min-h-[100svh] lg:grid-cols-2">
        <div className="pauta absolute inset-0" aria-hidden />
        <div className="recuo relative flex flex-col gap-9 pt-24 pb-12 md:pt-32 lg:justify-center lg:gap-14 lg:pt-24 lg:pb-16 lg:!pr-16">
          <Promessa tamanho="text-[clamp(3.5rem,14.6vw,14.5rem)] lg:text-[min(calc(8.1vw-22px),9rem)]" />
          <Agendar />
        </div>

        <div className="relative h-[82svh] lg:h-auto">
          <div className="hero-foto absolute inset-0 overflow-hidden bg-carvao">
            <img
              {...foto("londres-cabine")}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Gustavo Leal numa cabine telefônica vermelha, com o telefone no ouvido"
              fetchPriority="high"
              className="absolute inset-x-0 -top-[4%] h-[108%] w-full object-cover object-[45%_28%]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-preto/60 to-transparent" aria-hidden />
          </div>

          {/* A chamada: o vídeo dele, em pé, flutuando sobre o retrato. */}
          <div
            className={`chamada absolute bottom-5 left-4 z-10 transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] lg:bottom-10 lg:-left-16 ${
              comSom ? "w-[min(70vw,320px)]" : "w-[40vw] max-w-[230px] lg:w-[210px]"
            }`}
          >
            <p lang="en" className="mb-2 inline-block rounded-[14px] rounded-bl-[4px] bg-off px-3.5 py-2 text-[0.95rem] font-semibold text-vinho shadow-lg">
              Hi, I’m Gustavo!
            </p>
            <div className="relative overflow-hidden rounded-[16px] bg-preto shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ring-4 ring-off">
              <video
                ref={video}
                className="aspect-[9/16] w-full object-cover"
                src="/media/apresentacao.mp4"
                poster="/media/apresentacao.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Gustavo Leal se apresentando e explicando como são as aulas"
              />
              {!comSom && (
                <button type="button" onClick={ouvir} className="group absolute inset-0 flex items-end justify-center p-3" aria-label="Ouvir o vídeo com som">
                  <span className="flex items-center gap-2 rounded-full bg-preto/65 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-off backdrop-blur-sm">
                    <span className="grid size-8 place-items-center rounded-full bg-caneta transition-transform duration-500 group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="ml-0.5 size-3.5 fill-current" aria-hidden>
                        <path d="M6 4l14 8-14 8z" />
                      </svg>
                    </span>
                    Ouvir
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
