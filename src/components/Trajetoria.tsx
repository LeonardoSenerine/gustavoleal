import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experienciaProfissional, galeriaViagens, paises } from "@/lib/content";
import { Rotulo, Titulo } from "./Secao";

function Fileira({ fotos, className }: { fotos: { foto: string; lugar: string }[]; className: string }) {
  // A lista vai duas vezes pra fileira nunca acabar no meio do deslize.
  const repetidas = [...fotos, ...fotos];
  return (
    <div className={`${className} flex w-max gap-3 md:gap-5`} aria-hidden>
      {repetidas.map((f, i) => (
        <figure key={i} className="relative aspect-[3/4] h-[52vw] shrink-0 overflow-hidden rounded-[20px] bg-papel md:h-[26vw]">
          <img src={`/fotos/${f.foto}.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-preto/55 px-3 py-1 text-xs font-semibold text-off backdrop-blur-sm">
            {f.lugar}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// Duas fileiras de fotos de viagem deslizando em sentidos opostos com a
// rolagem, passando por trás do cartão com o texto, como no Momento Flanar.
export function Trajetoria() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 };
        gsap.fromTo(".trajetoria-a", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: st });
        gsap.fromTo(".trajetoria-b", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: st });
        gsap.from(".trajetoria-cartao", {
          y: 80,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: ".trajetoria-cartao", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="trajetoria" ref={root} className="relative overflow-hidden bg-off py-20 text-preto md:py-28">
      <Fileira fotos={galeriaViagens[0]} className="trajetoria-a" />

      <div className="relative z-10 -my-[18vw] px-3 md:-my-[9vw] md:px-8">
        <div className="trajetoria-cartao mx-auto max-w-5xl rounded-[28px] bg-off/90 p-6 shadow-[0_40px_90px_-30px_rgb(61_9_18/0.45)] ring-1 ring-preto/5 backdrop-blur-xl md:rounded-[36px] md:p-14">
          <div className="text-center">
            <Rotulo>Trajetória</Rotulo>
            <Titulo antes="O inglês me" destaque="levou longe." className="mt-6" />
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="font-serif text-[2rem] leading-none text-vinho italic">Na sala de aula</h3>
              <p className="mt-4 leading-relaxed text-preto/75">
                Ensinei inglês para alunos de diferentes idades e níveis, em aulas particulares, escolas de idiomas e no ambiente escolar. Cada experiência me ajudou a entender melhor as dificuldades, as necessidades e as diferentes formas de aprender de cada aluno.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Experiência como professor">
                {experienciaProfissional.map((item) => (
                  <li key={item} className="rounded-full border border-preto/15 px-3.5 py-1.5 text-sm font-semibold">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-[2rem] leading-none text-vinho italic">O que o inglês me deu</h3>
              <p className="mt-4 leading-relaxed text-preto/75">
                Viajei por diferentes países usando o inglês como minha principal ferramenta de comunicação em todos eles. Na prática, vi como o idioma conecta pessoas, culturas e experiências, mesmo quando a gente não fala a língua local.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Países onde usei o inglês">
                {paises.map((pais) => (
                  <li key={pais} className="rounded-full bg-vinho px-3.5 py-1.5 text-sm font-semibold text-off">
                    {pais}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <blockquote className="mx-auto mt-12 max-w-3xl border-t border-preto/10 pt-10 text-center font-serif text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.2] text-vinho italic">
            “Aprender inglês não é apenas estudar uma língua, mas ganhar confiança e liberdade para conhecer pessoas, explorar o mundo e viver novas experiências.”
          </blockquote>
        </div>
      </div>

      <Fileira fotos={galeriaViagens[1]} className="trajetoria-b" />
    </section>
  );
}
