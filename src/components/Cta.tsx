import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkPersonalizado, listarInteresses, useInteresses } from "@/lib/interesses";
import { LoopVideo } from "./LoopVideo";

// Fechamento no mesmo painel escuro do método, com o show ao fundo.
export function Cta() {
  const root = useRef<HTMLElement>(null);
  const interesses = useInteresses();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta-titulo > *", {
          y: 48,
          opacity: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
        gsap.fromTo(
          ".cta-fundo",
          { scale: 1.25 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="contato" ref={root} className="bg-off px-2 pb-2 md:px-4 md:pb-4">
      <div className="relative overflow-hidden rounded-[28px] bg-preto px-5 py-24 text-center text-off md:rounded-[36px] md:px-8 md:py-36">
        <LoopVideo name="cta" className="cta-fundo absolute inset-0 h-full w-full object-cover opacity-55" />
        <div
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(142_28_49/0.8),transparent_70%),linear-gradient(180deg,rgb(61_9_18/0.55),rgb(13_11_10/0.8))]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="inline-flex rounded-full bg-off/10 px-4 py-1.5 text-sm font-semibold text-off/75">Aula experimental grátis · online ou presencial</p>
          <h2 className="cta-titulo mt-6 text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            <span className="block">Bora</span>
            <span className="block font-serif tracking-[-0.01em] text-rosa italic">destravar?</span>
          </h2>
          <p data-revela className="mx-auto mt-8 max-w-[44ch] text-lg leading-relaxed text-off/75">
            {interesses.length > 0
              ? `Me chama no WhatsApp e a gente marca sua primeira aula com foco em ${listarInteresses(interesses)}.`
              : "Me chama no WhatsApp, conta seu objetivo e a gente marca a primeira aula."}
          </p>
          <a
            href={linkPersonalizado(interesses)}
            target="_blank"
            rel="noreferrer"
            className="botao mt-10 bg-off !px-8 !py-5 !text-lg text-vinho hover:bg-vermelho hover:text-off"
          >
            Chamar no WhatsApp <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
