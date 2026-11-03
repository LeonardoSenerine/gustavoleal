import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { etapas } from "@/lib/content";
import { Marca } from "./Caneta";
import { Titulo } from "./Secao";

// O método como plano de aula, numa folha escura (o quadro da sala). A foto
// fica presa na tela e troca conforme cada etapa passa. No celular ela fica
// no alto e as etapas rolam embaixo, então a seção ocupa a tela inteira.
export function Metodologia() {
  const root = useRef<HTMLElement>(null);
  const [ativa, setAtiva] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".etapa").forEach((etapa, i) => {
        ScrollTrigger.create({
          trigger: etapa,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setAtiva(i),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="metodo" ref={root} className="relative bg-carvao text-off">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <div className="relative pt-20 md:pt-32">
        <div className="recuo mx-auto max-w-[1500px]">
          <Titulo>
            Da sala pra{" "}
            <Marca forma="sublinhado" espessura="0.05em">
              rua.
            </Marca>
          </Titulo>

          <div className="mt-10 grid gap-6 text-off/70 md:mt-16 md:grid-cols-12 md:gap-6 md:text-lg">
            <p data-revela className="text-xl leading-snug font-medium text-off md:col-span-5 md:text-2xl">
              Minha metodologia parte de uma ideia simples: cada pessoa aprende de um jeito diferente, e as aulas devem respeitar isso.
            </p>
            <div className="grid gap-6 md:col-span-6 md:col-start-7 md:grid-cols-2">
              <p data-revela className="leading-relaxed">
                Aqui, o inglês é aprendido na prática, com foco na comunicação desde o início. Utilizamos músicas, filmes, séries, conversas, situações do cotidiano e
                assuntos que fazem parte da sua vida para tornar o aprendizado mais natural e interessante.
              </p>
              <p data-revela className="leading-relaxed">
                Não se trata de decorar regras ou traduzir frases, mas de entender o idioma, experimentar, praticar e ganhar confiança para se comunicar. Os conteúdos
                e atividades são preparados individualmente, considerando seus interesses, objetivos, dificuldades e ritmo de aprendizagem.
              </p>
              <p data-revela className="border-t border-off/15 pt-6 text-lg leading-relaxed font-medium text-off md:col-span-2 md:text-xl">
                Acredito que aprender inglês deve fazer sentido dentro e fora da sala de aula. Por isso, minha proposta é trazer o idioma para o seu mundo, e não
                fazer você se adaptar a um método engessado.
              </p>
            </div>
          </div>
        </div>

        {/* Foto presa + etapas. */}
        <div className="recuo mx-auto mt-14 max-w-[1500px] pb-[8svh] md:mt-24 md:grid md:grid-cols-12 md:gap-6 md:pb-[14vh]">
          <div className="sticky top-0 z-10 bg-carvao pt-[4.6rem] pb-3 md:top-[13vh] md:col-span-5 md:self-start md:bg-transparent md:p-0">
            <div className="relative h-[38svh] overflow-hidden md:h-[74vh] md:rounded-[3px] bg-vinho-escuro shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]">
              {etapas.map((etapa, i) => (
                <img
                  key={etapa.foto}
                  src={`/fotos/${etapa.foto}.webp`}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] will-change-[opacity,scale] ${
                    i === ativa ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  }`}
                />
              ))}
              {/* Barrinha com as seis etapas. */}
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-preto/50 to-transparent p-4 pt-10" aria-hidden>
                {etapas.map((etapa, i) => (
                  <span key={etapa.numero} className={`h-[2px] flex-1 transition-colors duration-700 ${i <= ativa ? "bg-off" : "bg-off/25"}`} />
                ))}
              </div>
            </div>
          </div>

          <ol className="relative md:col-span-6 md:col-start-7">
            {etapas.map((etapa, i) => (
              <li
                key={etapa.numero}
                className={`etapa border-b border-off/10 py-[7svh] transition-opacity duration-700 ease-out first:pt-[5svh] md:py-[13vh] md:first:pt-[12vh] ${
                  i === ativa ? "opacity-100" : "opacity-30"
                }`}
              >
                <h3 className="display text-[clamp(2.8rem,6.4vw,6.2rem)]">{etapa.titulo}</h3>
                <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-off/75">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
