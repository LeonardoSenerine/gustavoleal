import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { linkWhatsApp } from "@/lib/content";
import { Header } from "@/components/Header";
import { montar } from "./montar";

function NaoEncontrada() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".erro-fundo", { scale: 1.15, opacity: 0, duration: 2 })
          .from(".erro-numero", { yPercent: 110, duration: 1.4 }, 0.1)
          .from(".erro-sobe", { y: 28, opacity: 0, stagger: 0.08, duration: 1.1 }, 0.5);
      });
    },
    { scope: root },
  );

  return (
    <>
      <Header interna />
      <main
        ref={root}
        className="relative flex min-h-svh items-end overflow-hidden bg-preto px-4 pt-32 pb-16 text-off md:items-center md:px-8 md:pb-24"
      >
        <img src="/fotos/rua-noite.webp" alt="" className="erro-fundo absolute inset-0 h-full w-full object-cover opacity-45" />
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,var(--color-preto)_15%,rgb(61_9_18/0.85)_55%,rgb(107_16_32/0.35))]"
          aria-hidden
        />

        <div className="relative max-w-3xl">
          <span className="block overflow-hidden">
            <span className="erro-numero block text-[40vw] leading-[0.85] font-medium tracking-[-0.06em] md:text-[18vw]">404</span>
          </span>
          <h1 className="erro-sobe mt-6 text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.02] font-medium tracking-[-0.03em]">
            Lost in translation.
            <br />
            <span className="font-serif text-[1.1em] font-normal text-rosa italic">Essa página não existe.</span>
          </h1>
          <p className="erro-sobe mt-5 max-w-[46ch] text-lg leading-relaxed text-off/75">
            O endereço pode ter mudado ou foi digitado errado. Volta pro início ou me chama no WhatsApp que eu te ajudo.
          </p>
          <div className="erro-sobe mt-8 flex flex-wrap gap-3">
            <a href="/" className="botao bg-off text-vinho hover:bg-vermelho hover:text-off">
              Voltar pro início <span aria-hidden>→</span>
            </a>
            <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="botao border border-off/25 text-off hover:border-off hover:bg-off hover:text-preto">
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

montar(<NaoEncontrada />);
