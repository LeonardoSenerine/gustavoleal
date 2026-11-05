import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkPersonalizado, listarInteresses, useInteresses } from "@/lib/interesses";

// Fechamento em tela escura com o Coliseu iluminado à noite ao fundo.
export function Cta() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta-linha", {
          yPercent: 105,
          stagger: 0.1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
        gsap.fromTo(
          ".cta-fundo",
          { scale: 1.08 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.8 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="contato" ref={root} className="relative overflow-hidden bg-preto text-off">
      <img
        src="/fotos/fundo-coliseu-noite-800.webp"
        srcSet="/fotos/fundo-coliseu-noite-800.webp 800w, /fotos/fundo-coliseu-noite.webp 1600w"
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="cta-fundo absolute inset-0 h-full w-full object-cover object-[50%_55%]"
      />
      {/* Escurece só onde está o texto (embaixo e à esquerda); a foto aparece no resto. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_11_10/0.35)_0%,transparent_30%,rgb(13_11_10/0.15)_55%,rgb(13_11_10/0.8)_100%)]" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(61_9_18/0.45),transparent_60%)]" aria-hidden />

      <div className="recuo relative mx-auto flex min-h-[88svh] max-w-[1500px] flex-col justify-between gap-16 py-20 md:py-28">
        <p className="text-off/65">Aula experimental grátis, online ou presencial</p>

        <div>
          <h2 className="display text-[clamp(4.2rem,17vw,16rem)]">
            <span className="block overflow-hidden pt-[0.06em]">
              <span className="cta-linha block">Bora</span>
            </span>
            <span className="block overflow-hidden pt-[0.06em]">
              <span className="cta-linha block">destravar?</span>
            </span>
          </h2>
          <p lang="en" data-revela className="mt-5 text-[clamp(1.2rem,2.1vw,1.85rem)] font-medium tracking-[-0.02em] text-rosa">
            Ready to start talking?
          </p>

          <div className="relative mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p data-revela className="max-w-[40ch] text-lg leading-relaxed text-off/80 md:text-xl">
              {interesses.length > 0
                ? `Me chama no WhatsApp e a gente marca sua primeira aula com foco em ${listarInteresses(interesses)}.`
                : "Me chama no WhatsApp, conta seu objetivo e a gente marca a primeira aula."}
            </p>
            <div className="relative self-start md:self-auto">
              <a
                data-agendar href={linkPersonalizado(interesses)}
                target="_blank"
                rel="noreferrer"
                className="botao bg-off !px-8 !py-5 !text-lg text-preto hover:bg-caneta hover:text-off"
              >
                Chamar no WhatsApp <span className="seta" aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
