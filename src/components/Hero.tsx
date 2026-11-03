import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkWhatsApp } from "@/lib/content";

// Londres à noite: a foto principal no Big Ben, a cabine vermelha por cima,
// e a torre e a bandeira como detalhe. "profundidade" define quanto cada foto
// acompanha o mouse e o scroll, pra composição ganhar camadas.
const fotos = [
  {
    src: "big-ben",
    alt: "",
    className: "top-[3%] left-[6%] w-[30%] md:left-[4%]",
    aspecto: "aspect-[3/4]",
    profundidade: 0.4,
  },
  {
    src: "londres-big-ben-gustavo",
    alt: "Gustavo em frente ao Big Ben, em Londres, à noite",
    className: "top-0 right-[6%] z-10 w-[54%]",
    aspecto: "aspect-[3/4]",
    profundidade: 1,
  },
  {
    src: "londres-cabine",
    alt: "Gustavo dentro de uma cabine telefônica vermelha em Londres",
    className: "bottom-[2%] left-0 z-20 w-[40%]",
    aspecto: "aspect-[3/4]",
    profundidade: 1.6,
  },
  {
    src: "londres-bandeira",
    alt: "",
    className: "right-0 bottom-0 z-20 w-[30%]",
    aspecto: "aspect-[4/5]",
    profundidade: 2.2,
  },
];

function Letras({ texto }: { texto: string }) {
  return (
    <span className="block overflow-hidden pb-[0.02em]" aria-hidden>
      {[...texto].map((letra, i) => (
        <span key={i} className="hero-letra inline-block will-change-transform">
          {letra}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const colagem = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 } });
        intro
          .from(".hero-letra", { yPercent: 115, rotate: 8, stagger: 0.035, duration: 1.3 })
          .from(".hero-foto", { clipPath: "inset(100% 0% 0% 0%)", stagger: 0.12, duration: 1.6, ease: "expo.inOut" }, 0)
          .from(".hero-foto img", { scale: 1.4, stagger: 0.12, duration: 2.2 }, 0)
          .from(".hero-sobe", { y: 28, opacity: 0, stagger: 0.08, duration: 1.1 }, 0.7);

        // Cada foto sobe numa velocidade diferente ao rolar.
        gsap.utils.toArray<HTMLElement>(".hero-camada").forEach((camada) => {
          const p = Number(camada.dataset.profundidade);
          gsap.to(camada, {
            yPercent: -10 * p,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
        gsap.to(".hero-texto", {
          yPercent: -25,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      // Parallax leve seguindo o mouse, só em telas com ponteiro.
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const movers = gsap.utils.toArray<HTMLElement>(".hero-mouse").map((el) => ({
          p: Number(el.dataset.profundidade),
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
        }));
        const mover = (e: PointerEvent) => {
          const dx = e.clientX / window.innerWidth - 0.5;
          const dy = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(dx * 14 * m.p);
            m.y(dy * 10 * m.p);
          });
        };
        window.addEventListener("pointermove", mover);
        return () => window.removeEventListener("pointermove", mover);
      });
    },
    { scope: root },
  );

  return (
    <section
      id="topo"
      ref={root}
      className="relative overflow-hidden bg-preto bg-[radial-gradient(70%_70%_at_80%_35%,rgb(142_28_49/0.55),transparent_70%),linear-gradient(170deg,var(--color-preto)_35%,var(--color-vinho-escuro))] pt-28 pb-16 md:flex md:min-h-svh md:items-center md:pt-24 md:pb-12"
    >
      <div className="grid w-full gap-12 px-4 md:grid-cols-12 md:items-center md:gap-6 md:px-8">
        <div className="hero-texto md:col-span-6">
          <p className="hero-sobe text-base font-semibold text-off/70 [font-stretch:90%]">
            Teacher de inglês
          </p>

          <h1 className="letreiro mt-5 text-[25vw] text-off md:text-[12.5vw]">
            <span className="sr-only">Gustavo Leal</span>
            <Letras texto="Gustavo" />
            <Letras texto="Leal" />
          </h1>

          <p className="hero-sobe mt-8 text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.05] font-extrabold [font-stretch:80%]">
            Inglês pra viver o mundo,
            <br />
            <span className="text-vermelho">não pra decorar regra.</span>
          </p>
          <p className="hero-sobe mt-5 max-w-[46ch] text-lg leading-relaxed text-off/70">
            Aulas que se adaptam a você, com conversação, música, filmes e situações reais. Do primeiro “hi” até a próxima viagem.
          </p>
          <div className="hero-sobe mt-8 flex flex-wrap gap-3">
            <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="botao bg-vermelho text-off hover:bg-off hover:text-preto">
              Agendar aula experimental <span aria-hidden>→</span>
            </a>
            <a href="#metodo" className="botao border border-off/25 text-off hover:border-off hover:bg-off hover:text-preto">
              Ver o método
            </a>
          </div>
        </div>

        <div ref={colagem} className="relative order-first h-[112vw] md:order-none md:col-span-6 md:h-[min(78svh,46vw)]">
          {fotos.map((f) => (
            <div key={f.src} className={`hero-camada absolute ${f.className}`} data-profundidade={f.profundidade}>
              <div className="hero-mouse" data-profundidade={f.profundidade}>
                <figure className="hero-foto overflow-hidden rounded-[6px] shadow-[0_24px_60px_rgb(0_0_0/0.55)]">
                  <img
                    src={`/fotos/${f.src}.webp`}
                    alt={f.alt}
                    className={`${f.aspecto} w-full object-cover`}
                    fetchPriority={f.profundidade === 1 ? "high" : undefined}
                  />
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
