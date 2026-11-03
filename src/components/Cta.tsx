import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkPersonalizado, listarInteresses, useInteresses } from "@/lib/interesses";
import { LoopVideo } from "./LoopVideo";
import { Traco } from "./Caneta";

// Fechamento em tela escura com o show ao fundo. A caneta desenha uma seta
// do título até o botão.
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
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
        gsap.fromTo(
          ".cta-fundo",
          { scale: 1.2 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="contato" ref={root} className="relative overflow-hidden bg-preto text-off">
      <LoopVideo name="cta" className="cta-fundo absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_11_10/0.7),rgb(61_9_18/0.55)_55%,rgb(13_11_10/0.92))]" aria-hidden />

      <div className="recuo relative mx-auto flex min-h-[88svh] max-w-[1500px] flex-col justify-between gap-16 py-20 md:py-28">
        <p className="nota-caps flex items-center gap-3 text-off/65">
          <span className="text-caneta">07</span>
          <span className="h-px w-8 bg-current opacity-40" aria-hidden />
          Aula experimental grátis · online ou presencial
        </p>

        <div>
          <h2 className="display text-[clamp(4.2rem,17vw,16rem)]">
            <span className="block overflow-hidden pt-[0.06em]">
              <span className="cta-linha block">Bora</span>
            </span>
            <span className="block overflow-hidden pt-[0.06em]">
              <span className="cta-linha block">destravar?</span>
            </span>
          </h2>

          <div className="relative mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p data-revela className="max-w-[40ch] text-lg leading-relaxed text-off/80 md:text-xl">
              {interesses.length > 0
                ? `Me chama no WhatsApp e a gente marca sua primeira aula com foco em ${listarInteresses(interesses)}.`
                : "Me chama no WhatsApp, conta seu objetivo e a gente marca a primeira aula."}
            </p>
            <div className="relative self-start md:self-auto">
              <Traco forma="seta" espessura="2.5px" className="-top-24 -left-20 hidden h-24 w-20 md:block" />
              <a
                href={linkPersonalizado(interesses)}
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
