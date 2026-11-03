import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { etapas } from "@/lib/content";
import { Rotulo, Titulo } from "./Secao";

// O scroll vertical vira um passeio horizontal pelas etapas do método,
// dentro de um painel escuro com o mesmo degradê do arco do hero.
export function Metodologia() {
  const root = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distancia = () => trilho.current!.scrollWidth - window.innerWidth;

        const passeio = gsap.to(trilho.current, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".metodo-barra", { scaleX: self.progress }),
          },
        });

        gsap.utils.toArray<HTMLElement>(".etapa").forEach((card) => {
          const st = { trigger: card, containerAnimation: passeio, scrub: true };
          gsap.fromTo(
            card.querySelector(".etapa-foto"),
            { scale: 1.25 },
            { scale: 1, ease: "none", scrollTrigger: { ...st, start: "left 100%", end: "center 50%" } },
          );
          gsap.from(card.querySelectorAll(".etapa-texto"), {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { ...st, start: "left 95%", end: "left 55%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="metodo" ref={root} className="relative bg-off px-2 md:px-4 md:py-2">
      <div className="relative flex min-h-svh flex-col justify-center overflow-hidden rounded-[28px] bg-preto bg-[radial-gradient(80%_60%_at_30%_0%,var(--color-vinho),transparent_70%),linear-gradient(180deg,var(--color-vinho-escuro),var(--color-preto)_60%)] py-20 text-off motion-reduce:overflow-x-auto md:h-[calc(100svh-1rem)] md:min-h-0 md:rounded-[36px] md:py-0">
        <div ref={trilho} className="flex w-max items-start gap-5 px-5 md:gap-6 md:px-[5vw]">
          <div className="w-[82vw] shrink-0 md:w-[38vw] md:pr-[3vw]">
            <Rotulo tom="escuro">O método</Rotulo>
            <Titulo antes="Da sala" destaque="pra rua." tom="escuro" className="mt-6" />
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-off/75">
              <p data-revela>
                <strong className="font-semibold text-off">Minha metodologia parte de uma ideia simples:</strong> cada pessoa aprende de um jeito diferente, e as aulas devem respeitar isso.
              </p>
              <p data-revela>
                O inglês é aprendido na prática, com foco na comunicação desde o início. Músicas, filmes, séries, conversas e situações do cotidiano deixam o aprendizado mais natural e interessante.
              </p>
              <p data-revela>A proposta é trazer o idioma para o seu mundo, e não fazer você se adaptar a um método engessado.</p>
            </div>
          </div>

          {etapas.map((etapa) => (
            <article key={etapa.numero} className="etapa w-[74vw] shrink-0 md:w-[23vw]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-vinho-escuro">
                <img src={`/fotos/${etapa.foto}.webp`} alt="" className="etapa-foto absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-preto/70 to-transparent" aria-hidden />
                <span className="absolute top-4 left-4 rounded-full bg-preto/45 px-3 py-1 text-sm font-semibold text-off backdrop-blur-sm">
                  Etapa {etapa.numero}
                </span>
              </div>
              <h3 className="etapa-texto mt-5 font-serif text-[2.1rem] leading-none italic">{etapa.titulo}</h3>
              <p className="etapa-texto mt-3 leading-relaxed text-off/75">{etapa.texto}</p>
            </article>
          ))}

          <div className="w-[2vw] shrink-0" aria-hidden />
        </div>

        <div className="absolute inset-x-5 bottom-6 h-[2px] overflow-hidden rounded-full bg-off/15 motion-reduce:hidden md:inset-x-[5vw] md:bottom-8">
          <div className="metodo-barra h-full origin-left bg-off" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
