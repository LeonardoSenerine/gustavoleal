import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { depoimentos } from "@/lib/content";
import { Ingles, Titulo } from "./Secao";

export function Alunos() {
  const root = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".aluno-card", {
          y: 80,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: trilho.current, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  function passar(direcao: 1 | -1) {
    const el = trilho.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".aluno-card");
    el.scrollBy({ left: direcao * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
  }

  function tocar(i: number, video: HTMLVideoElement) {
    trilho.current?.querySelectorAll("video").forEach((v) => v !== video && v.pause());
    video.play().catch(() => {});
    setAtivo(i);
  }

  return (
    <section id="alunos" ref={root} className="relative overflow-hidden bg-preto py-24 text-off md:py-36">
      <div className="flex flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Titulo>Quem fala por mim são eles.</Titulo>
          <Ingles tom="escuro" className="mt-4">Don’t take my word for it.</Ingles>
        </div>
        <div className="flex gap-3">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => passar(d)}
              aria-label={d === 1 ? "Próximo depoimento" : "Depoimento anterior"}
              className="grid size-14 place-items-center rounded-full border border-off/30 text-2xl transition-colors hover:border-vermelho hover:bg-vermelho hover:text-off"
            >
              {d === 1 ? "→" : "←"}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trilho}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] md:scroll-px-8 md:px-8"
      >
        {depoimentos.map((d, i) => (
          <article key={d.nome} className="aluno-card w-[68vw] shrink-0 snap-start sm:w-[42vw] md:w-[22vw]">
            <div className={`relative aspect-[9/16] overflow-hidden rounded-[10px] ${i % 2 ? "bg-vinho-escuro" : "bg-carvao"}`}>
              <video
                className="h-full w-full object-cover"
                src={`/media/${d.video}.mp4`}
                poster={`/media/${d.video}.jpg`}
                playsInline
                controls={ativo === i}
                preload="metadata"
                onPlay={(e) => tocar(i, e.currentTarget)}
                aria-label={`Depoimento de ${d.nome}`}
              />
              {ativo !== i && (
                <button
                  type="button"
                  onClick={(e) => tocar(i, e.currentTarget.previousElementSibling as HTMLVideoElement)}
                  className="absolute inset-0 grid place-items-center"
                  aria-label={`Assistir depoimento de ${d.nome}`}
                >
                  <span className="grid size-16 place-items-center rounded-full bg-vermelho text-off">▶</span>
                </button>
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold [font-stretch:85%]">{d.nome}</h3>
              <span className="text-sm text-off/55">{d.contexto}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
