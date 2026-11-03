import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { numeroSecao } from "@/lib/content";
import { Placa } from "./Placa";

export function Apresentacao() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".apres-linha", {
          yPercent: 105,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".apres-titulo", start: "top 80%" },
        });
        gsap.from(".apres-player", {
          rotate: 6,
          y: 120,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
        });
      });
    },
    { scope: root },
  );

  function assistir() {
    const v = video.current;
    if (!v) return;
    v.controls = true;
    v.muted = false;
    v.play().catch(() => {});
    setTocando(true);
  }

  return (
    <section id="apresentacao" ref={root} className="grao relative overflow-hidden bg-off px-4 py-24 text-preto md:px-8 md:py-36">
      <div className="grid gap-14 md:grid-cols-12 md:items-center md:gap-8">
        <div className="md:col-span-7">
          <Placa numero={numeroSecao("apresentacao")} nome="Quem é o Leal" />

          <h2 className="apres-titulo mt-8">
            {["Inglês não", "é pra ser", "entediante."].map((linha, i) => (
              <span key={linha} className="-mt-[0.16em] block overflow-hidden pt-[0.16em]">
                <span className={`apres-linha letreiro block text-[17vw] md:text-[8.6vw] ${i === 2 ? "text-vinho" : ""}`}>{linha}</span>
              </span>
            ))}
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-10">
            <p data-revela className="text-xl leading-snug font-semibold [font-stretch:90%]">
              Eu sou o teacher Gustavo, apaixonado pela ideia de que aprender um idioma pode ir muito além de livros e regras gramaticais.
            </p>
            <p data-revela className="leading-relaxed text-preto/70">
              Cada aluno é único. Minhas aulas envolvem conversação, música, filmes, cultura e situações reais, conectadas aos seus interesses e objetivos. Aqui, as aulas se adaptam a você, não o contrário.
            </p>
          </div>
        </div>

        <div className="relative md:col-span-4 md:col-start-9">
          <div className="apres-player relative mx-auto w-[min(82vw,380px)]">
            <div className="relative overflow-hidden rounded-[10px] bg-preto shadow-[14px_14px_0_var(--color-vinho)]">
              <video
                ref={video}
                className="aspect-[9/16] w-full object-cover"
                src="/media/apresentacao.mp4"
                poster="/media/apresentacao.jpg"
                playsInline
                preload="metadata"
                onEnded={() => setTocando(false)}
                aria-label="Gustavo Leal se apresentando e explicando como são as aulas"
              />
              {!tocando && (
                <button
                  type="button"
                  onClick={assistir}
                  className="group absolute inset-0 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-preto/80 via-preto/10 to-transparent p-6 text-off"
                >
                  <span className="grid size-20 place-items-center rounded-full bg-vermelho text-off transition-transform group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="ml-1 size-8 fill-current" aria-hidden>
                      <path d="M6 4l14 8-14 8z" />
                    </svg>
                  </span>
                  <span className="etiqueta">Assistir com som · 0:21</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
