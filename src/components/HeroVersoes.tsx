import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Marca } from "./Caneta";
import { Fichas } from "./Fichas";

// Quatro propostas de abertura pra apresentar ao cliente (?hero=1 a 4).
// Todas mostram o Gustavo como professor, não como viajante: a fala dele
// no vídeo, uma aula acontecendo, o objetivo do aluno e a frase dele.

function Agendar({ tom = "claro" }: { tom?: "claro" | "vinho" }) {
  const interesses = useInteresses();
  return (
    <div className="hero-sobe flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={linkPersonalizado(interesses)}
        target="_blank"
        rel="noreferrer"
        className={`botao ${tom === "claro" ? "bg-preto text-off hover:bg-caneta" : "bg-off text-vinho hover:bg-preto hover:text-off"}`}
      >
        Agendar aula experimental grátis <span className="seta" aria-hidden>→</span>
      </a>
      <span className={`text-sm ${tom === "claro" ? "text-preto/55" : "text-off/65"}`}>Online ou presencial</span>
    </div>
  );
}

// A promessa do site, igual à abertura atual: título, "decorar regra"
// riscado e a legenda em inglês.
function Promessa({ tamanho, className = "" }: { tamanho: string; className?: string }) {
  return (
    <div className={className}>
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
      <p lang="en" className="hero-sobe mt-4 text-lg font-medium text-caneta-escura lg:mt-5 lg:text-[min(1.5vw,1.6rem)]">
        Learn English to live it, not to memorize it.
      </p>
    </div>
  );
}

function useEntrada(root: React.RefObject<HTMLElement | null>, extra?: (tl: gsap.core.Timeline) => void) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-sobe", { y: 18, opacity: 0, stagger: 0.08, duration: 1.3 }, 0.15);
        extra?.(tl);
      });
    },
    { scope: root },
  );
}

/* ------------------------------------------------------------------ */
/* 1. Ele falando: o vídeo de apresentação toca sem som, com a legenda */
/*    que ele mesmo gravou, ao lado da promessa.                        */
/* ------------------------------------------------------------------ */
export function HeroVideo() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [comSom, setComSom] = useState(false);

  useEntrada(root, (tl) => {
    tl.fromTo(".fala-video", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 }, 0.05).from(
      ".fala-oi",
      { y: 20, opacity: 0, duration: 1.1 },
      0.6,
    );
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
      <div className="relative lg:grid lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr]">
        <div className="pauta absolute inset-0" aria-hidden />
        <div className="recuo relative flex flex-col gap-9 pt-24 pb-12 md:pt-32 lg:justify-center lg:gap-14 lg:pt-24 lg:pb-16 lg:!pr-12">
          <Promessa tamanho="text-[clamp(3.5rem,14.6vw,14.5rem)] lg:text-[min(calc(8.6vw-22px),9.6rem)]" />
          <Agendar />
        </div>

        {/* Painel vinho com o vídeo dele em pé, como uma chamada. */}
        <div className="relative flex flex-col items-center justify-center gap-5 bg-vinho px-6 py-12 lg:py-24">
          <div className="pauta-clara absolute inset-0" aria-hidden />
          <p lang="en" className="fala-oi relative text-2xl font-medium tracking-[-0.02em] text-rosa lg:text-3xl">
            Hi, I’m Gustavo.
          </p>
          <div className="fala-video relative w-[min(78vw,340px)] overflow-hidden rounded-[3px] bg-preto shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] lg:w-auto lg:h-[min(72vh,700px)] lg:aspect-[9/16]">
            <video
              ref={video}
              className="aspect-[9/16] h-full w-full object-cover"
              src="/media/apresentacao.mp4"
              poster="/media/apresentacao.jpg"
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Gustavo Leal se apresentando e explicando como são as aulas"
            />
            {!comSom && (
              <button
                type="button"
                onClick={ouvir}
                className="group absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full bg-preto/60 py-1.5 pr-5 pl-1.5 text-left text-off backdrop-blur-sm"
              >
                <span className="grid size-10 place-items-center rounded-full bg-off text-vinho transition-transform duration-500 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current" aria-hidden>
                    <path d="M6 4l14 8-14 8z" />
                  </svg>
                </span>
                <span className="text-sm font-semibold">Ouvir com som · 21 s</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. A aula acontecendo: uma conversa em inglês com a correção da      */
/*    caneta, do jeito que ele corrige na aula, sem decoreba.           */
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
          <span className="conversa-certo absolute -top-[1.05em] left-1/2 -translate-x-1/2 text-[0.85em] font-semibold whitespace-nowrap text-caneta-escura">am</span>
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
    tl.from(".conversa-cartao", { y: 40, opacity: 0, duration: 1.2 }, 0.3)
      .from(".conversa-msg", { y: 16, opacity: 0, duration: 0.8, stagger: 1.1, ease: "power3.out" }, 0.9)
      .from(".conversa-risco", { scaleX: 0, duration: 0.5, stagger: 0.25, ease: "power2.inOut" }, 2.6)
      .from(".conversa-certo", { y: 6, opacity: 0, duration: 0.5 }, 3.0)
      .to(".conversa-errado", { opacity: 0.45, duration: 0.4 }, 2.7);
  });

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-off text-preto">
      <div className="pauta absolute inset-0" aria-hidden />
      <div className="recuo relative mx-auto grid max-w-[1500px] gap-12 pt-24 pb-16 md:pt-32 lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-6 lg:pt-24 lg:pb-16">
        <div className="flex flex-col gap-9 lg:col-span-7 lg:gap-14">
          <Promessa tamanho="text-[clamp(3.5rem,14.6vw,14.5rem)] lg:text-[min(calc(10.4vw-22px),11rem)]" />
          <Agendar />
        </div>

        {/* Cartão de aula: o teacher, o aluno e a caneta corrigindo. */}
        <div className="conversa-cartao lg:col-span-5">
          <div className="rounded-[4px] bg-folha shadow-[0_1px_0_rgb(13_11_10/0.06),0_40px_80px_-40px_rgb(13_11_10/0.5)] ring-1 ring-preto/8">
            <div className="flex items-center gap-3 border-b border-preto/10 px-5 py-4">
              <img src="/fotos/retrato-rosto.webp" alt="" className="size-11 rounded-full object-cover" />
              <div>
                <p className="font-semibold">Teacher Gustavo</p>
                <p className="text-sm text-preto/55">Conversação · online</p>
              </div>
              <span className="ml-auto flex shrink-0 items-center gap-1.5 text-sm text-preto/55">
                <span className="size-2 rounded-full bg-[#2bb24c]" aria-hidden />
                ao vivo
              </span>
            </div>
            <ol className="flex flex-col gap-4 px-5 pt-8 pb-6" lang="en" aria-label="Exemplo de conversa na aula">
              {conversa.map((m, i) => (
                <li
                  key={i}
                  className={`conversa-msg max-w-[85%] rounded-[18px] px-4 py-3 text-lg leading-snug ${
                    m.quem === "teacher" ? "self-start rounded-bl-[4px] bg-vinho text-off" : "self-end rounded-br-[4px] bg-papel text-preto"
                  }`}
                >
                  {m.conteudo}
                </li>
              ))}
            </ol>
            <p className="border-t border-preto/10 px-5 py-4 text-sm text-preto/60">Errou? Faz parte. A correção vem na hora, no meio da conversa.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. O objetivo do aluno: as fichas sobem pra abertura e a pergunta    */
/*    vira o assunto. O Gustavo aparece como quem vai guiar.            */
/* ------------------------------------------------------------------ */
export function HeroObjetivos() {
  const root = useRef<HTMLElement>(null);
  useEntrada(root);

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-off pb-10 text-preto lg:pb-16">
      <div className="pauta absolute inset-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" aria-hidden />
      <div className="recuo relative mx-auto max-w-[1500px] pt-24 md:pt-32 lg:pt-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <h1 className="display text-[clamp(3.5rem,14.6vw,14.5rem)] lg:col-span-7 lg:text-[min(8.4vw,9.5rem)]">
            Inglês pra quê?
            <span lang="en" className="mt-4 block font-sans text-[clamp(1.2rem,2vw,1.8rem)] leading-tight font-medium tracking-[-0.02em] text-caneta-escura normal-case [font-stretch:100%]">
              What do you want English for?
            </span>
          </h1>
          <div className="hero-sobe flex flex-col gap-6 lg:col-span-5 lg:pb-3">
            <div className="flex items-center gap-4">
              <img src="/fotos/retrato-rosto.webp" alt="Gustavo Leal" className="size-16 rounded-full object-cover ring-2 ring-off" />
              <p className="text-lg leading-snug">
                <strong className="font-semibold">Teacher Gustavo.</strong> Marque o que você quer destravar e a aula é montada em volta disso.
              </p>
            </div>
            <Agendar />
          </div>
        </div>
      </div>
      <Fichas cabecalho={false} className="mt-10 lg:mt-14" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. A frase dele: folha vinho, a fala do vídeo em letra enorme e o    */
/*    retrato dele dando a aula de apresentação.                        */
/* ------------------------------------------------------------------ */
export function HeroPessoal() {
  const root = useRef<HTMLElement>(null);
  useEntrada(root, (tl) => {
    tl.fromTo(".pessoal-foto", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 }, 0.1).from(
      ".pessoal-img",
      { scale: 1.2, duration: 2 },
      0.1,
    );
  });

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-vinho text-off">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <div className="recuo relative mx-auto grid max-w-[1500px] gap-10 pt-24 pb-14 md:pt-32 lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-6 lg:pt-24 lg:pb-16">
        <div className="flex flex-col gap-9 lg:col-span-7 lg:gap-12">
          <div>
            <p className="hero-sobe text-[clamp(1.4rem,3.4vw,2.6rem)] leading-[1.05] font-medium tracking-[-0.03em] text-off/85">Aqui, tudo é personalizado pra você.</p>
            <h1 className="display mt-3 text-[clamp(3.6rem,15.5vw,15rem)] lg:text-[min(calc(10vw-14px),11.5rem)]">
              É pra ser <span className="text-rosa">pessoal.</span>
            </h1>
            <p lang="en" className="hero-sobe mt-5 text-lg font-medium text-rosa lg:text-[min(1.6vw,1.7rem)]">
              English should feel like yours.
            </p>
          </div>
          <Agendar tom="vinho" />
        </div>

        <figure className="lg:col-span-4 lg:col-start-9">
          <div className="pessoal-foto relative overflow-hidden rounded-[3px] bg-vinho-escuro shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
            <img src="/fotos/retrato-aula-quadrado.webp" alt="Gustavo Leal gravando o vídeo de apresentação das aulas" className="pessoal-img aspect-square w-full object-cover" />
          </div>
          <figcaption className="hero-sobe mt-3 flex items-center justify-between gap-4 text-sm text-off/70">
            <span>Gustavo Leal, teacher de inglês</span>
            <a href="#apresentacao" className="font-semibold text-off underline decoration-rosa decoration-2 underline-offset-4">
              Ver o vídeo
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
