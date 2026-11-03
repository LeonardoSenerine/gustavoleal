import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cidades, colagem, experienciaProfissional, paises } from "@/lib/content";


// Ritmo da colagem no desktop: coluna, largura e quanto cada foto desce.
const posicoes = [
  "md:col-span-4 md:col-start-1",
  "md:col-span-3 md:col-start-6 md:mt-[14vw]",
  "md:col-span-3 md:col-start-10 md:mt-[4vw]",
  "md:col-span-3 md:col-start-2 md:mt-[2vw]",
  "md:col-span-4 md:col-start-6 md:mt-[8vw]",
  "md:col-span-2 md:col-start-11 md:mt-[22vw]",
];
const velocidades = [-6, -16, -10, -4, -12, -20];

// Trajetória como página de caderno de viagem: uma frase enorme com as
// cidades e uma foto dentro de cada nome, a sala de aula, as viagens e uma
// colagem de fotos.
export function Trajetoria() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // As fotos dentro da frase abrem do centro, uma depois da outra.
        gsap.fromTo(
          ".cidade-foto",
          { clipPath: "inset(50% 50% 50% 50%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.12,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: ".cidades", start: "top 75%" },
          },
        );
        gsap.utils.toArray<HTMLElement>(".figura").forEach((fig, i) => {
          gsap.to(fig, {
            yPercent: velocidades[i % velocidades.length],
            ease: "none",
            scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="trajetoria" ref={root} className="relative bg-off pt-20 pb-20 text-preto md:pt-32 md:pb-32">
      <div className="recuo mx-auto max-w-[1500px]">

        <h2 className="cidades display mt-6 text-[clamp(2.7rem,8.4vw,8.4rem)] md:mt-8">
          O inglês me levou pra{" "}
          {cidades.map((c, i) => (
            <Fragment key={c.nome}>
              <span className="whitespace-nowrap">
                {c.nome}
                <img
                  src={`/fotos/${c.foto}.webp`}
                  alt=""
                  loading="lazy"
                  className="cidade-foto mx-[0.12em] inline-block h-[0.74em] w-[1.05em] rounded-[0.06em] object-cover align-[-0.02em]"
                />
              </span>
              {i < cidades.length - 2 ? " " : i === cidades.length - 2 ? " e " : ""}
            </Fragment>
          ))}
          <span className="text-caneta">.</span>
        </h2>

        {/* A sala de aula e o que o inglês deu. */}
        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
          <div data-revela className="md:col-span-5">
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">Na sala de aula</h3>
            <p className="mt-4 text-lg leading-relaxed text-preto/75">
              Ao longo da minha trajetória como professor, tive a oportunidade de ensinar inglês para alunos de diferentes idades e níveis, tanto em aulas
              particulares quanto em escolas de idiomas e no ambiente escolar. Cada experiência me ajudou a entender melhor as dificuldades, necessidades e
              diferentes formas de aprender de cada aluno.
            </p>
            <ul className="mt-6 border-t border-preto/12" aria-label="Experiência como professor">
              {experienciaProfissional.map((item) => (
                <li key={item} className="border-b border-preto/12 py-3 font-medium text-preto/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div data-revela className="md:col-span-5 md:col-start-8">
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">O que o inglês me deu</h3>
            <p className="mt-4 text-lg leading-relaxed text-preto/75">
              Além da experiência em sala de aula, tive a oportunidade de viajar por diferentes países e utilizar o inglês como minha principal ferramenta de
              comunicação em todos eles. Na prática, pude perceber como o idioma conecta pessoas, culturas e experiências, mesmo quando não falamos a língua
              local.
            </p>
            <ul className="mt-6 border-t border-preto/12" aria-label="Países onde usei o inglês">
              {paises.map((pais) => (
                <li key={pais} className="border-b border-preto/12 py-3 font-medium text-preto/80">
                  {pais}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colagem de fotos de viagem. */}
        <div className="mt-20 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-32 md:grid-cols-12 md:gap-x-6 md:gap-y-0" aria-hidden>
          {colagem.map((f, i) => (
            <figure key={f.foto} className={`figura ${i % 2 === 1 ? "mt-12" : ""} ${posicoes[i % posicoes.length]}`}>
              <div className="overflow-hidden rounded-[3px] bg-papel">
                <img src={`/fotos/${f.foto}.webp`} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </div>
              <figcaption className="mt-2 text-sm text-preto/50">{f.lugar}</figcaption>
            </figure>
          ))}
        </div>

        <p data-revela className="mt-24 max-w-[52ch] text-lg leading-relaxed text-preto/70 md:mt-40 md:ml-[calc(100%/12)] md:pl-6">
          Essas vivências contribuíram para desenvolver minha maneira de ensinar e reforçaram algo em que acredito muito:
        </p>
        <blockquote className="mt-8 grid gap-4 md:mt-10 md:grid-cols-12 md:gap-6">
          <span className="display text-[6rem] leading-[0.6] text-caneta md:col-span-1 md:text-right md:text-[8rem]" aria-hidden>
            “
          </span>
          <p className="text-[clamp(1.8rem,3.9vw,3.6rem)] leading-[1.06] font-medium tracking-[-0.035em] text-balance md:col-span-10">
            Aprender inglês não é apenas estudar uma língua, mas ganhar confiança e liberdade para conhecer pessoas, explorar o mundo e viver novas experiências.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
