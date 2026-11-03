import { useState } from "react";
import { perguntas } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Ingles, Titulo } from "./Secao";

// Perguntas frequentes em sanfona. A altura anima pelo truque do grid
// (0fr → 1fr), então a resposta abre suave sem medir nada em JS.
export function Perguntas() {
  const interesses = useInteresses();
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="perguntas" className="relative bg-papel pt-20 pb-20 text-preto md:pt-28 md:pb-32">
      <div className="recuo mx-auto grid max-w-[1500px] gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Titulo className="md:!text-[clamp(3rem,6.2vw,6.4rem)]">Perguntas frequentes.</Titulo>
            <Ingles className="mt-4 md:mt-5">Got questions?</Ingles>
            <p data-revela className="mt-8 max-w-[34ch] text-lg text-preto/70">
              Não achou o que procurava? Manda sua pergunta no WhatsApp que eu respondo.
            </p>
            <a
              href={linkPersonalizado(interesses)}
              target="_blank"
              rel="noreferrer"
              className="botao mt-6 border border-preto text-preto hover:bg-preto hover:text-off"
            >
              Perguntar no WhatsApp <span className="seta" aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="border-t border-preto/15 md:col-span-7 md:col-start-6 md:mt-2">
          {perguntas.map((item, i) => {
            const aberto = aberta === i;
            const id = `pergunta-${i}`;
            return (
              <div key={item.pergunta} data-revela className="border-b border-preto/15">
                <h3>
                  <button
                    type="button"
                    id={`${id}-botao`}
                    aria-expanded={aberto}
                    aria-controls={id}
                    onClick={() => setAberta(aberto ? null : i)}
                    className="group flex w-full items-center gap-6 py-6 text-left text-xl font-medium tracking-[-0.015em] md:gap-6 md:text-2xl"
                  >
                    <span className="flex-1 transition-colors group-hover:text-caneta">{item.pergunta}</span>
                    <span
                      className={`relative size-4 shrink-0 self-center transition-transform duration-500 ${aberto ? "rotate-45 text-caneta" : ""}`}
                      aria-hidden
                    >
                      <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                      <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  aria-labelledby={`${id}-botao`}
                  inert={!aberto}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[58ch] pb-7 text-lg leading-relaxed text-preto/70">{item.resposta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
