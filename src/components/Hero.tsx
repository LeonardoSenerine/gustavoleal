import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { tirasHero } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Marca } from "./Caneta";

// A primeira folha do caderno: a promessa em letra grande com a caneta
// riscando "decorar regra" e, ao lado, o Gustavo em Londres, Paris e
// Barcelona. As fichas de estudo vêm logo depois (ver Fichas.tsx).
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // O título (LCP) não anima: aparece pronto. As tiras sobem uma de cada
        // vez, a foto assenta dentro delas e o resto entra em volta.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo(".tira", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.12, duration: 1.5 }, 0.05)
          .from(".tira-foto", { scale: 1.25, stagger: 0.12, duration: 2 }, 0.05)
          .from(".tira-cidade", { y: 12, opacity: 0, stagger: 0.12, duration: 1 }, 0.8)
          .from(".hero-sobe", { y: 18, opacity: 0, stagger: 0.08, duration: 1.3 }, 0.2);

        // Enquanto a página rola, cada foto desliza devagar dentro da tira.
        gsap.utils.toArray<HTMLElement>(".tira-movel").forEach((foto, i) => {
          gsap.fromTo(
            foto,
            { yPercent: -3 },
            {
              yPercent: 4 + i * 1.5,
              ease: "none",
              scrollTrigger: { trigger: ".tiras", start: "top top", end: "bottom top", scrub: 0.8 },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="topo" ref={root} className="relative overflow-hidden bg-off text-preto">
      {/* Abertura: a folha com a promessa e o Gustavo em três lugares. */}
      <div className="relative lg:grid lg:min-h-[100svh] lg:grid-cols-[1fr_1.12fr]">
        <div className="pauta absolute inset-0" aria-hidden />

        <div className="recuo relative flex flex-col pt-24 pb-10 md:pt-32 lg:justify-center lg:pt-24 lg:pb-16 lg:!pr-12">
          <div>
            <h1>
              <span className="sr-only">Inglês pra viver o mundo. Não pra decorar regra.</span>
              <span className="display block text-[clamp(3.5rem,14.6vw,14.5rem)] lg:text-[min(calc(8.1vw-22px),9rem)]" aria-hidden>
                Inglês pra
                <br />
                viver o mundo.
              </span>
            </h1>
            <p
              className="hero-sobe mt-5 text-[clamp(1.75rem,4.6vw,3.9rem)] leading-[1] font-medium tracking-[-0.035em] lg:mt-8 lg:text-[min(2.7vw,3.4rem)]"
              aria-hidden
            >
              Não pra{" "}
              <Marca forma="risco" atraso={0.9} espessura="0.075em">
                decorar regra.
              </Marca>
            </p>
            <p lang="en" className="hero-sobe mt-4 text-lg font-medium text-caneta-escura lg:mt-6 lg:text-[min(1.5vw,1.6rem)]">
              Learn English to live it, not to memorize it.
            </p>
          </div>

          <div className="hero-sobe mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-14">
            <a href={linkPersonalizado(interesses)} target="_blank" rel="noreferrer" className="botao bg-preto text-off hover:bg-caneta">
              Agendar aula experimental grátis <span className="seta" aria-hidden>→</span>
            </a>
            <span className="text-sm text-preto/55">Online ou presencial</span>
          </div>
        </div>

        {/* Três tiras. Em tela larga, a tira sob o mouse se alarga. */}
        <div className="tiras relative flex h-[62svh] gap-1.5 lg:h-auto lg:gap-2">
          {tirasHero.map((t, i) => (
            <figure
              key={t.foto}
              className="tira group relative min-w-0 flex-1 overflow-hidden bg-carvao transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] lg:hover:grow-[1.75]"
            >
              <div className="tira-movel absolute inset-x-0 -top-[5%] h-[110%]">
                <img
                  src={`/fotos/${t.foto}.webp`}
                  alt={t.alt}
                  fetchPriority={i === 0 ? "high" : undefined}
                  className="tira-foto h-full w-full object-cover transition-[filter] duration-700 lg:group-hover:brightness-110"
                  style={{ objectPosition: t.foco }}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-preto/60 to-transparent" aria-hidden />
              <figcaption className="tira-cidade absolute bottom-3 left-3 text-sm font-medium text-off lg:bottom-5 lg:left-5 lg:text-base">{t.cidade}</figcaption>
            </figure>
          ))}
        </div>
      </div>

    </section>
  );
}
