import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Ingles, LerMais, Titulo } from "./Secao";
import { foto } from "@/lib/foto";

// Quem é: uma foto dele sorrindo e o texto em primeira pessoa ao lado. O
// vídeo de apresentação fica na abertura.
export function Apresentacao() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".apres-player",
          { clipPath: "inset(12% 10% 12% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: ".apres-player", start: "top bottom", end: "center 60%", scrub: 0.8 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="apresentacao" ref={root} className="relative bg-vinho pt-16 pb-20 text-off md:pt-28 md:pb-32">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <div className="recuo relative mx-auto max-w-[1500px]">
        <Titulo className="max-w-[11ch]">
          Inglês <span className="text-rosa">não</span> é pra ser entediante.
        </Titulo>
        <Ingles tom="vinho" className="mt-4 md:mt-6">English isn’t meant to be boring.</Ingles>

        <div className="mt-12 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-6">
          {/* O vídeo dele já está na abertura; aqui entra uma foto dele sorrindo. */}
          <figure className="md:col-span-5">
            <div className="apres-player relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[3px] bg-preto shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] md:mx-0 md:max-w-none">
              <img {...foto("sorrento-sorriso")} sizes="(min-width: 768px) 40vw, 90vw" alt="Gustavo Leal sorrindo num mirante" className="aspect-[4/5] w-full object-cover object-[62%_45%]" loading="lazy" />
            </div>
          </figure>

          <div className="flex flex-col gap-8 md:col-span-6 md:col-start-7 md:gap-14 md:pt-4">
            <p data-revela className="text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.03em]">
              Eu sou o teacher Gustavo e apaixonado pela ideia de que aprender um idioma pode ir muito além de livros e regras gramaticais.
            </p>

            <LerMais tom="escuro" className="grid gap-6 border-t border-off/15 pt-8 sm:grid-cols-2 sm:gap-8">
              <p className="leading-relaxed text-off/75">
                Acredito que o inglês deve fazer parte da sua vida, conectado aos seus interesses, à sua personalidade e aos seus objetivos. Por isso, minhas aulas
                envolvem conversação, música, filmes, cultura e situações reais, tornando o aprendizado mais natural e significativo.
              </p>
              <p className="leading-relaxed text-off/75">
                Cada aluno é único, e é assim que enxergo o ensino. Não existe uma única maneira de aprender. Meu objetivo é ajudar você a desenvolver confiança, se
                comunicar de verdade e descobrir tudo o que um novo idioma pode proporcionar.
              </p>
            </LerMais>

            <p data-revela className="text-2xl leading-tight font-medium tracking-[-0.02em] md:text-3xl">
              Aqui, as aulas se adaptam a você,{" "}
              <span className="relative isolate inline-block whitespace-nowrap">
                não o contrário.
                <span className="absolute inset-x-0 bottom-1 -z-10 h-[0.4em] bg-rosa/30" aria-hidden />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
