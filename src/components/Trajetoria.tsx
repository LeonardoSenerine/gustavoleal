import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experienciaProfissional, viagens } from "@/lib/content";
import { Ingles, LerMais } from "./Secao";

// Foto das viagens: escolhe 700 ou 1400 px pelo tamanho na tela e aparece
// com um esmaecimento quando termina de carregar, sem surgir de repente.
// "carregar" troca o lazy por eager quando a seção está chegando.
function Foto({
  nome,
  sizes,
  carregar,
  alt = "",
  className = "",
  style,
}: {
  nome: string;
  sizes: string;
  carregar: boolean;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={`/fotos/${nome}-700.webp`}
      srcSet={`/fotos/${nome}-700.webp 700w, /fotos/${nome}.webp 1400w`}
      sizes={sizes}
      alt={alt}
      loading={carregar ? "eager" : "lazy"}
      decoding="async"
      onLoad={(e) => e.currentTarget.setAttribute("data-pronta", "")}
      className={`foto-suave ${className}`}
      style={style}
    />
  );
}

// Trajetória como um passeio pelos países: cada um é um capítulo com o nome
// enorme, a foto principal dele e fotos do lugar. Em tela larga a rolagem
// vertical vira um passeio horizontal; no celular, os capítulos ficam num
// carrossel de arrastar. Depois vem a sala de aula e a frase dele.
export function Trajetoria() {
  const root = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const carrossel = useRef<HTMLDivElement>(null);
  const barraCelular = useRef<HTMLSpanElement>(null);
  const [carregar, setCarregar] = useState(false);

  // As fotos ficam fora da tela, pro lado, e o lazy do navegador só as
  // pediria em cima da hora. Começa a baixar quando faltam ~2 telas.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setCarregar(true);
          io.disconnect();
        }
      },
      { rootMargin: "200% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const distancia = () => trilho.current!.scrollWidth - window.innerWidth;
        const passeio = gsap.to(trilho.current, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: ".viagens",
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".viagens-barra", { scaleX: self.progress }),
          },
        });

        // A foto desliza dentro da moldura e o nome do país sobe ao chegar.
        gsap.utils.toArray<HTMLElement>(".viagem").forEach((capitulo) => {
          gsap.fromTo(
            capitulo.querySelectorAll(".viagem-foto"),
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: capitulo, containerAnimation: passeio, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(capitulo.querySelectorAll(".viagem-nome"), {
            yPercent: 30,
            opacity: 0,
            ease: "power3.out",
            duration: 1.1,
            scrollTrigger: { trigger: capitulo, containerAnimation: passeio, start: "left 80%" },
          });
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
        gsap.from(".viagem", {
          x: 70,
          opacity: 0,
          stagger: 0.08,
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger: carrossel.current, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  // Barra de progresso do carrossel no celular, pela rolagem lateral.
  function aoRolar() {
    const el = carrossel.current;
    const barra = barraCelular.current;
    if (!el || !barra) return;
    const total = el.scrollWidth - el.clientWidth;
    barra.style.transform = `scaleX(${total > 0 ? el.scrollLeft / total : 0})`;
  }

  return (
    <section id="trajetoria" ref={root} className="relative bg-off text-preto">
      <div className="viagens relative pt-20 pb-16 md:pt-28 lg:h-[100svh] lg:pb-0 lg:overflow-hidden lg:pt-0 lg:motion-reduce:overflow-x-auto">
        <div ref={trilho} className="lg:flex lg:h-full lg:w-max lg:items-center lg:gap-[3.5vw] lg:pr-[6vw] lg:pl-[calc(var(--margem)+2.5rem)]">
          <div className="recuo lg:w-[30vw] lg:shrink-0 lg:!p-0">
            <h2 className="display text-[clamp(3.1rem,10.5vw,8.6rem)] text-balance lg:text-[min(5.6vw,7.5rem)]">O inglês me levou longe.</h2>
            <Ingles className="mt-4 lg:mt-6">English took me places.</Ingles>
            <p data-revela className="mt-6 max-w-[38ch] text-lg leading-relaxed text-preto/70 lg:mt-8">
              Na prática, pude perceber como o idioma conecta pessoas, culturas e experiências, mesmo quando não falamos a língua local.
            </p>
            <p className="mt-6 text-sm text-preto/50 lg:hidden" aria-hidden>
              Arraste pro lado →
            </p>
          </div>

          {/* No desktop este bloco some (display: contents) e os capítulos entram direto no trilho. */}
          <div
            ref={carrossel}
            onScroll={aoRolar}
            className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-[calc(var(--margem)+1.15rem)] pr-5 pl-[calc(var(--margem)+1.15rem)] [scrollbar-width:none] lg:contents"
          >
            {viagens.map((v) => (
              <article key={v.pais} className="viagem w-[84vw] max-w-[420px] shrink-0 snap-start lg:flex lg:h-[76vh] lg:w-auto lg:max-w-none lg:gap-6">
                {/* Foto principal. No celular, o nome do país fica por cima dela. */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-papel lg:aspect-auto lg:h-full lg:w-[31vw]">
                  <Foto
                    nome={v.principal}
                    sizes="(min-width: 1024px) 36vw, 90vw"
                    carregar={carregar}
                    alt={`Gustavo em ${v.cidades}`}
                    className="viagem-foto absolute inset-y-0 left-[-7%] h-full w-[114%] max-w-none object-cover"
                    style={{ objectPosition: v.foco }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-preto/75 to-transparent lg:hidden" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-off lg:hidden">
                    <p className="text-sm font-medium text-off/80">{v.cidades}</p>
                    <h3 className="display mt-1 text-[3.4rem]">{v.pais}</h3>
                    <p lang="en" className="mt-1 font-medium text-rosa">{v.ingles}</p>
                  </div>
                </div>

                {/* Coluna do desktop: nome enorme em cima, fotos do lugar embaixo. */}
                <div className="hidden lg:flex lg:w-[25vw] lg:flex-col lg:justify-between">
                  <div className="viagem-nome">
                    <p className="text-lg font-medium text-preto/55">{v.cidades}</p>
                    <h3 className="display mt-2 text-[min(5.2vw,7rem)]">{v.pais}</h3>
                    <p lang="en" className="mt-2 text-xl font-medium text-caneta-escura">{v.ingles}</p>
                  </div>
                  {v.extras.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {v.extras.map((foto) => (
                        <div key={foto} className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-papel">
                          <Foto
                            nome={foto}
                            sizes="14vw"
                            carregar={carregar}
                            className="viagem-foto absolute inset-y-0 left-[-7%] h-full w-[114%] max-w-none object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fotos do lugar no celular, embaixo da principal. */}
                {v.extras.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2 lg:hidden" aria-hidden>
                    {v.extras.map((foto) => (
                      <div key={foto} className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-papel">
                        <Foto nome={foto} sizes="45vw" carregar={carregar} className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="recuo mt-6 lg:hidden" aria-hidden>
          <div className="h-[2px] overflow-hidden bg-preto/10">
            <span ref={barraCelular} className="block h-full origin-left bg-caneta transition-transform duration-150" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
        <div className="absolute right-[6vw] bottom-8 left-[calc(var(--margem)+2.5rem)] hidden h-[2px] overflow-hidden bg-preto/10 motion-reduce:hidden lg:block" aria-hidden>
          <div className="viagens-barra h-full origin-left bg-caneta" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      {/* A sala de aula e a frase dele, numa folha vinho. */}
      <div className="relative bg-vinho text-off">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <div className="recuo relative mx-auto max-w-[1500px] pt-20 pb-20 md:pt-28 md:pb-32">
        <div className="grid gap-6 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <h3 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Na sala de aula</h3>
            <p lang="en" className="mt-1 text-lg font-medium text-rosa">In the classroom</p>
          </div>
          <div className="flex flex-col gap-6 md:col-span-7 md:col-start-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lg font-medium" aria-label="Experiência como professor">
              {experienciaProfissional.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-[2px] w-3 bg-rosa" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <LerMais tom="escuro">
              <p className="max-w-[60ch] text-lg leading-relaxed text-off/75">
                Ao longo da minha trajetória como professor, tive a oportunidade de ensinar inglês para alunos de diferentes idades e níveis, tanto em aulas
                particulares quanto em escolas de idiomas e no ambiente escolar. Cada experiência me ajudou a entender melhor as dificuldades, necessidades e
                diferentes formas de aprender de cada aluno.
              </p>
            </LerMais>
          </div>
        </div>

        <blockquote className="mt-20 grid gap-4 md:mt-32 md:grid-cols-12 md:gap-6">
          <span className="display text-[6rem] leading-[0.6] text-rosa md:col-span-1 md:text-right md:text-[8rem]" aria-hidden>
            “
          </span>
          <p className="text-[clamp(1.7rem,3.9vw,3.6rem)] leading-[1.06] font-medium tracking-[-0.035em] text-balance md:col-span-10">
            Aprender inglês não é apenas estudar uma língua, mas ganhar confiança e liberdade para conhecer pessoas, explorar o mundo e viver novas experiências.
          </p>
        </blockquote>
      </div>
      </div>
    </section>
  );
}
