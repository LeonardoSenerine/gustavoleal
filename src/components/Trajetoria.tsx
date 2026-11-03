import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { paradas, numeroSecao } from "@/lib/content";
import { Placa } from "./Placa";

function Carimbo({ cidade, pais, numero }: { cidade: string; pais: string; numero: number }) {
  return (
    <div className="carimbo relative grid size-32 shrink-0 place-items-center rounded-full border-[3px] border-vinho text-vinho md:size-44">
      <div className="absolute inset-2 rounded-full border border-dashed border-vinho/70" />
      <div className="text-center">
        <span className="etiqueta block text-[0.65rem]">Stop {String(numero).padStart(2, "0")}</span>
        <span className={`letreiro block ${cidade.length > 6 ? "text-[1.7rem] md:text-[2.4rem]" : "text-4xl md:text-6xl"}`}>{cidade}</span>
        <span className="etiqueta block text-[0.65rem]">{pais} ✶ English</span>
      </div>
    </div>
  );
}

export function Trajetoria() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".parada").forEach((parada, i) => {
          gsap.from(parada.querySelector(".carimbo"), {
            scale: 1.8,
            rotate: i % 2 ? 30 : -30,
            opacity: 0,
            duration: 0.5,
            ease: "power4.in",
            scrollTrigger: { trigger: parada, start: "top 70%" },
          });
          gsap.from(parada.querySelectorAll(".parada-foto img"), {
            scale: 1.25,
            opacity: 0,
            stagger: 0.12,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: parada, start: "top 75%" },
          });
          if (!window.matchMedia("(min-width: 768px)").matches) return;
          parada.querySelectorAll<HTMLElement>(".parada-foto").forEach((foto, j) => {
            gsap.fromTo(
              foto,
              { yPercent: 6 + j * 8 },
              { yPercent: -6 - j * 8, ease: "none", scrollTrigger: { trigger: parada, start: "top bottom", end: "bottom top", scrub: true } },
            );
          });
        });

        gsap.fromTo(
          ".bio-foto img",
          { scale: 1.25 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: ".bio-foto", start: "top bottom", end: "bottom center", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="trajetoria" ref={root} className="grao relative overflow-hidden bg-off px-4 py-24 text-preto md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <figure className="bio-foto relative overflow-hidden rounded-[10px]">
            <img src="/fotos/sena-baguete.webp" alt="Gustavo sentado à beira do rio Sena com uma baguete" className="aspect-[4/5] w-full object-cover" loading="lazy" />
            <figcaption className="etiqueta absolute bottom-3 left-3 rounded-full bg-preto/70 px-3 py-1.5 text-off">Paris · Seine</figcaption>
          </figure>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <Placa numero={numeroSecao("trajetoria")} nome="Trajetória" />
          <h2 className="letreiro mt-6 text-[16vw] md:text-[7vw]">
            O inglês me
            <br />
            levou <span className="text-vinho">longe</span>
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-preto/80">
            <p data-revela>
              Ensinei inglês para alunos de diferentes idades e níveis, em aulas particulares, escolas de idiomas e no ambiente escolar. Cada experiência me ajudou a entender as dificuldades e as formas de aprender de cada aluno.
            </p>
            <p data-revela>
              Também viajei por vários países usando o inglês como minha principal ferramenta de comunicação. Na prática, vi como o idioma conecta pessoas, culturas e experiências, mesmo quando a gente não fala a língua local.
            </p>
          </div>
          <blockquote data-revela className="mt-10 border-l-4 border-vermelho pl-5 text-2xl leading-tight font-extrabold [font-stretch:80%]">
            “Aprender inglês não é apenas estudar uma língua, é ganhar confiança e liberdade pra conhecer pessoas e explorar o mundo.”
          </blockquote>
        </div>
      </div>

      <div className="mt-24 space-y-20 md:mt-32 md:space-y-16">
        {paradas.map((p, i) => (
          <article key={p.cidade} className={`parada flex flex-col gap-8 md:items-center md:gap-14 ${i % 2 ? "md:flex-row-reverse" : "md:flex-row"}`}>
            <div className="flex items-center gap-6 md:w-[30%] md:flex-col md:items-start">
              <Carimbo cidade={p.cidade} pais={p.pais} numero={i + 1} />
              <p data-revela className="max-w-[32ch] text-lg leading-relaxed text-preto/80">{p.texto}</p>
            </div>
            {/* Colagem de fotos coladas no muro, sobrepostas em alturas diferentes. */}
            <div className="relative h-[96vw] w-full md:h-[min(46vw,640px)] md:flex-1">
              {p.fotos.map((foto, j) => (
                <figure
                  key={foto}
                  className={`parada-foto absolute overflow-hidden rounded-[6px] bg-papel p-1.5 shadow-[0_10px_30px_rgb(0_0_0/0.18)] ${
                    p.fotos.length === 1
                      ? "top-0 left-[16%] w-[62%] -rotate-1"
                      : j === 0
                      ? "top-0 left-0 w-[58%] -rotate-2"
                      : j === 1
                        ? "top-[14%] right-0 w-[40%] rotate-3"
                        : "bottom-0 left-[38%] z-10 w-[34%] -rotate-1"
                  }`}
                >
                  <img src={`/fotos/${foto}.webp`} alt="" className="aspect-[4/5] w-full rounded-[3px] object-cover" loading="lazy" />
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
