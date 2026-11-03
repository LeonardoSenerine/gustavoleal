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

        // No celular cabe um cartão por vez, então a rolagem para com cada
        // etapa centralizada na tela em vez de deixá-la cortada no meio.
        const pontosNoCelular = (valor: number) => {
          const blocos = Array.from(trilho.current!.children as HTMLCollectionOf<HTMLElement>).slice(0, -1);
          const pontos = blocos.map((b) => gsap.utils.clamp(0, 1, (b.offsetLeft - (window.innerWidth - b.offsetWidth) / 2) / distancia()));
          return gsap.utils.snap(pontos, valor);
        };

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
            snap: window.innerWidth < 768 ? { snapTo: pontosNoCelular, duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: "power2.inOut" } : undefined,
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
    <section id="metodo" ref={root} className="relative bg-off md:px-4 md:py-2">
      <div className="relative flex h-svh flex-col justify-center overflow-hidden bg-preto bg-[radial-gradient(80%_60%_at_30%_0%,var(--color-vinho),transparent_70%),linear-gradient(180deg,var(--color-vinho-escuro),var(--color-preto)_60%)] text-off motion-reduce:overflow-x-auto md:h-[calc(100svh-1rem)] md:rounded-[36px]">
        <div ref={trilho} className="flex w-max items-center gap-4 px-5 md:items-start md:gap-6 md:px-[5vw]">
          <div className="w-[84vw] shrink-0 md:w-[38vw] md:pr-[3vw]">
            <Rotulo tom="escuro">O método</Rotulo>
            <Titulo antes="Da sala" destaque="pra rua." tom="escuro" className="mt-6" />
            <div className="mt-6 space-y-4 leading-relaxed text-off/75 md:mt-8 md:text-lg">
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
            <article key={etapa.numero} className="etapa relative w-[80vw] shrink-0 md:w-[23vw]">
              {/* No celular o texto fica sobre a foto, que ocupa quase a tela toda; no desktop, embaixo dela. */}
              <div className="relative h-[66svh] overflow-hidden rounded-[24px] bg-vinho-escuro md:h-auto md:aspect-[4/5] md:rounded-[20px]">
                <img src={`/fotos/${etapa.foto}.webp`} alt="" className="etapa-foto absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-preto/95 via-preto/50 to-transparent md:h-1/2 md:from-preto/70 md:via-transparent" aria-hidden />
                <span className="absolute top-4 left-4 rounded-full bg-preto/45 px-3 py-1 text-sm font-semibold text-off backdrop-blur-sm">
                  Etapa {etapa.numero}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 md:static md:p-0 md:pt-5">
                <h3 className="etapa-texto font-serif text-[2.3rem] leading-none italic md:text-[2.1rem]">{etapa.titulo}</h3>
                <p className="etapa-texto mt-3 leading-relaxed text-off/80 md:text-off/75">{etapa.texto}</p>
              </div>
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
