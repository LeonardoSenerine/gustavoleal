import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { etapas, numeroSecao } from "@/lib/content";
import { Placa } from "./Placa";

// O scroll vertical vira um passeio horizontal pelas etapas do método,
// todas do mesmo tamanho e alinhadas pelo topo.
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
    <section
      id="metodo"
      ref={root}
      className="grao relative bg-vinho bg-[linear-gradient(160deg,var(--color-vinho)_0%,var(--color-vinho-escuro)_60%,var(--color-preto)_100%)] text-off"
    >
      <div className="relative flex min-h-svh flex-col justify-center overflow-hidden py-24 motion-reduce:overflow-x-auto md:h-svh md:py-0">
        <div ref={trilho} className="flex w-max items-start gap-5 px-4 md:gap-8 md:px-[6vw]">
          <div className="w-[86vw] shrink-0 md:w-[40vw] md:pr-[3vw]">
            <Placa numero={numeroSecao("metodo")} nome="O método" className="!bg-preto" />
            <h2 className="letreiro mt-6 text-[20vw] md:text-[7.5vw]">
              Da sala
              <br />
              <span className="letreiro-contorno">pra rua</span>
            </h2>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-off/80">
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
            <article key={etapa.numero} className="etapa w-[76vw] shrink-0 md:w-[24vw]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-vinho-escuro">
                <img src={`/fotos/${etapa.foto}.webp`} alt="" className="etapa-foto absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-preto/75 to-transparent" aria-hidden />
                <span className="letreiro absolute bottom-3 left-4 text-6xl text-off md:text-7xl">{etapa.numero}</span>
              </div>
              <h3 className="etapa-texto letreiro mt-6 text-[11vw] md:text-[3.2vw]">{etapa.titulo}</h3>
              <p className="etapa-texto mt-3 leading-relaxed text-off/80">{etapa.texto}</p>
            </article>
          ))}

          <div className="w-[2vw] shrink-0" aria-hidden />
        </div>

        <div className="absolute inset-x-4 bottom-6 h-[2px] overflow-hidden bg-off/15 motion-reduce:hidden md:inset-x-[6vw] md:bottom-8">
          <div className="metodo-barra h-full origin-left bg-off" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
