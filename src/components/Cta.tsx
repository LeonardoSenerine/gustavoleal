import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkWhatsApp } from "@/lib/content";
import { LoopVideo } from "./LoopVideo";

export function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta-linha", {
          yPercent: 105,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
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
    <section id="contato" ref={root} className="grao relative overflow-hidden bg-vinho bg-[linear-gradient(135deg,var(--color-vinho-claro),var(--color-vinho)_45%,var(--color-vinho-escuro))] px-4 py-28 text-off md:px-8 md:py-40">
      <LoopVideo name="cta" className="cta-fundo absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-multiply grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-vinho/60 via-transparent to-vinho-escuro" aria-hidden />

      <div className="relative">
        <span className="text-lg font-semibold text-off/80 [font-stretch:90%]">Aula experimental</span>
        <h2 className="mt-6">
          {["Bora", "destravar?"].map((linha) => (
            <span key={linha} className="-mt-[0.16em] block overflow-hidden pt-[0.16em]">
              <span className="cta-linha letreiro block text-[24vw] md:text-[16vw]">{linha}</span>
            </span>
          ))}
        </h2>

        <div data-revela className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[40ch] text-xl leading-snug font-semibold [font-stretch:90%]">
            Me chama no WhatsApp, conta teu objetivo e a gente marca a primeira conversa.
          </p>
          <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="botao bg-off !px-8 !py-5 !text-xl text-vinho hover:bg-preto hover:text-off">
            Chamar no WhatsApp <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
