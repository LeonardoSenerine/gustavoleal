import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Marca } from "./Caneta";
import { Fichas } from "./Fichas";
import { foto } from "@/lib/foto";

// Quatro propostas de abertura pra apresentar ao cliente (?hero=1 a 4).
// Todas mostram o Gustavo como professor: as fotos são recortadas nele,
// como retrato, e o lugar fica em segundo plano.

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

/* ------------------------------------------------------------------ */
/* 1. Você falando: o retrato dele na cabine vermelha, com o telefone   */
/*    no ouvido, e o vídeo de apresentação por cima como uma chamada.   */
/* ------------------------------------------------------------------ */
export function HeroVideo() {
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

/* ------------------------------------------------------------------ */
/* 2. A aula acontecendo: ele no café, em tela cheia, e a conversa da   */
/*    aula saindo dele em balões, com a correção da caneta.             */
/* ------------------------------------------------------------------ */
const conversa: { quem: "aluno" | "teacher"; conteudo: ReactNode }[] = [
  { quem: "teacher", conteudo: "So, tell me about you!" },
  {
    quem: "aluno",
    conteudo: (
      <>
        I{" "}
        <span className="relative inline-block">
          <span className="conversa-errado">have</span>
          <span className="conversa-certo absolute -top-[1.1em] left-1/2 -translate-x-1/2 text-[0.85em] font-bold whitespace-nowrap text-caneta-escura">am</span>
          <span className="conversa-risco absolute top-1/2 -left-[8%] h-[2.5px] w-[116%] origin-left -rotate-3 rounded-full bg-caneta" aria-hidden />
        </span>{" "}
        25{" "}
        <span className="relative inline-block">
          <span className="conversa-errado">years</span>
          <span className="conversa-risco absolute top-1/2 -left-[6%] h-[2.5px] w-[112%] origin-left -rotate-2 rounded-full bg-caneta" aria-hidden />
        </span>{" "}
        and I love Friends.
      </>
    ),
  },
  { quem: "teacher", conteudo: "Me too! Let’s use your favorite episode today." },
];

export function HeroConversa() {
  const root = useRef<HTMLElement>(null);

  useEntrada(root, (tl) => {
    tl.from(".conversa-msg", { y: 18, opacity: 0, scale: 0.96, duration: 0.8, stagger: 1, ease: "power3.out" }, 0.9)
      .from(".conversa-risco", { scaleX: 0, duration: 0.5, stagger: 0.25, ease: "power2.inOut" }, 2.4)
      .to(".conversa-errado", { opacity: 0.45, duration: 0.4 }, 2.5)
      .from(".conversa-certo", { y: 6, opacity: 0, duration: 0.5 }, 2.8);
  });

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-carvao text-off">
      <div className="relative flex min-h-[100svh] flex-col lg:block">
        {/* A foto ocupa a tela (no celular, a parte de cima). */}
        <div className="hero-foto relative h-[64svh] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[68%]">
          <img
            {...foto("cafe-paris")}
            sizes="(min-width: 1024px) 68vw, 100vw"
            alt="Gustavo Leal sentado à mesa de um café, conversando"
            fetchPriority="high"
            className="absolute inset-x-0 -top-[4%] h-[108%] w-full object-cover object-[58%_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carvao via-carvao/10 to-transparent lg:bg-gradient-to-r lg:from-carvao lg:via-carvao/40 lg:to-transparent" aria-hidden />
        </div>

        <div className="recuo relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-10 pb-14 lg:min-h-[100svh] lg:justify-end lg:pt-28 lg:pb-16">
          {/* Balões: no desktop saem perto do rosto dele; no celular sobem sobre a foto. */}
          <ol
            lang="en"
            aria-label="Exemplo de conversa na aula"
            className="-mt-40 flex max-w-[340px] flex-col gap-3 self-end lg:absolute lg:top-[16%] lg:left-[40%] lg:mt-0 lg:max-w-[360px] lg:self-auto"
          >
            {conversa.map((m, i) => (
              <li
                key={i}
                className={`conversa-msg max-w-[92%] rounded-[18px] px-4 py-3 text-[1.05rem] leading-snug shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] ${
                  m.quem === "teacher" ? "self-start rounded-bl-[4px] bg-vinho text-off" : "self-end rounded-br-[4px] bg-off pt-4 text-preto"
                }`}
              >
                {m.conteudo}
              </li>
            ))}
          </ol>

          <div className="flex max-w-[640px] flex-col gap-9 lg:gap-12">
            <Promessa tom="escuro" tamanho="text-[clamp(3.5rem,14.6vw,14.5rem)] lg:text-[min(7vw,8rem)]" />
            <Agendar tom="escuro" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Inglês pra quê?: a pergunta, o retrato dele sorrindo como quem    */
/*    vai guiar, e as fichas de objetivo logo abaixo.                   */
/* ------------------------------------------------------------------ */
export function HeroObjetivos() {
  const root = useRef<HTMLElement>(null);
  useEntrada(root);

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-off pb-10 text-preto lg:pb-16">
      <div className="pauta absolute inset-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" aria-hidden />
      <div className="recuo relative mx-auto max-w-[1500px] pt-24 md:pt-32 lg:pt-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="display text-[clamp(3.5rem,14.6vw,14.5rem)] lg:text-[min(10.5vw,12rem)]">Inglês pra quê?</h1>
            <p lang="en" className="hero-sobe mt-4 text-[clamp(1.2rem,2vw,1.8rem)] leading-tight font-medium tracking-[-0.02em] text-caneta-escura">
              What do you want English for?
            </p>
          </div>

          {/* O teacher, sorrindo, apresentando as fichas. */}
          <figure className="hero-sobe flex items-center gap-4 lg:col-span-4 lg:flex-col lg:items-start lg:gap-5 lg:pb-2">
            <div className="hero-foto relative size-24 shrink-0 overflow-hidden rounded-full bg-papel ring-4 ring-folha shadow-[0_20px_40px_-20px_rgb(13_11_10/0.6)] lg:size-auto lg:aspect-[4/5] lg:w-full lg:max-w-[300px] lg:rounded-[3px]">
              <img {...foto("sena-baguete")} sizes="(min-width: 1024px) 300px, 96px" alt="Gustavo Leal sorrindo" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[48%_62%] lg:object-[50%_70%]" />
            </div>
            <figcaption className="text-lg leading-snug">
              <strong className="font-semibold">Teacher Gustavo.</strong> Marque o que você quer destravar e a aula é montada em volta disso.
            </figcaption>
          </figure>
        </div>
        <div className="mt-8 lg:mt-10">
          <Agendar />
        </div>
      </div>
      <Fichas cabecalho={false} className="mt-10 lg:mt-12" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. É pra ser pessoal: folha vinho, a frase dele em letra enorme e o  */
/*    retrato em preto e branco ocupando a lateral inteira.             */
/* ------------------------------------------------------------------ */
export function HeroPessoal() {
  const root = useRef<HTMLElement>(null);
  useEntrada(root);

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-vinho text-off">
      <div className="relative lg:grid lg:min-h-[100svh] lg:grid-cols-[1.15fr_1fr]">
        <div className="pauta-clara absolute inset-0" aria-hidden />
        <div className="recuo relative flex flex-col gap-9 pt-24 pb-12 md:pt-32 lg:justify-center lg:gap-12 lg:pt-24 lg:pb-16 lg:!pr-12">
          <div>
            <p className="hero-sobe text-[clamp(1.35rem,3.2vw,2.4rem)] leading-[1.08] font-medium tracking-[-0.03em] text-off/85">Aqui, tudo é personalizado pra você.</p>
            <h1 className="display mt-4 text-[clamp(3.6rem,15.5vw,15rem)] lg:text-[min(calc(9.6vw-20px),10.5rem)]">
              É pra ser <span className="text-rosa">pessoal.</span>
            </h1>
            <p lang="en" className="hero-sobe mt-5 text-lg font-medium text-rosa lg:text-[min(1.6vw,1.7rem)]">
              English should feel like yours.
            </p>
          </div>
          <Agendar tom="escuro" />
        </div>

        <figure className="relative h-[80svh] lg:h-auto">
          <div className="hero-foto absolute inset-0 overflow-hidden bg-vinho-escuro">
            <img
              src="/fotos/retrato-pb.webp"
              alt="Retrato de Gustavo Leal em preto e branco"
              fetchPriority="high"
              className="absolute inset-x-0 -top-[4%] h-[108%] w-full object-cover object-[40%_40%]"
            />
            {/* Funde a borda da foto com o vinho. */}
            <div className="absolute inset-0 bg-gradient-to-b from-vinho/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-vinho/70 lg:via-transparent" aria-hidden />
          </div>
          <figcaption className="absolute right-4 bottom-4 z-10 text-sm font-medium text-off/85 lg:right-8 lg:bottom-8">Gustavo Leal, teacher de inglês</figcaption>
        </figure>
      </div>
    </section>
  );
}
