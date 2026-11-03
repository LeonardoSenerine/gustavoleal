import { useState } from "react";
import { perguntas } from "@/lib/content";
import { linkPersonalizado, useInteresses } from "@/lib/interesses";
import { Rotulo, Titulo } from "./Secao";

// Perguntas frequentes em sanfona. A altura anima pelo truque do grid
// (0fr → 1fr), então a resposta abre suave sem medir nada em JS.
export function Perguntas() {
  const interesses = useInteresses();
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="perguntas" className="relative bg-off px-4 pb-16 text-preto md:px-8 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-preto/10 pt-14 md:grid-cols-12 md:gap-8 md:pt-20">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Rotulo>Dúvidas</Rotulo>
            <Titulo antes="Perguntas" destaque="frequentes." className="mt-6" />
            <p data-revela className="mt-6 max-w-[34ch] text-preto/70">
              Não achou o que procurava? Manda sua pergunta no WhatsApp que eu respondo.
            </p>
            <a
              href={linkPersonalizado(interesses)}
              target="_blank"
              rel="noreferrer"
              className="botao mt-6 border border-preto/20 text-preto hover:border-vinho hover:bg-vinho hover:text-off"
            >
              Perguntar no WhatsApp
            </a>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          {perguntas.map((item, i) => {
            const aberto = aberta === i;
            const id = `pergunta-${i}`;
            return (
              <div key={item.pergunta} data-revela className="border-b border-preto/10">
                <h3>
                  <button
                    type="button"
                    id={`${id}-botao`}
                    aria-expanded={aberto}
                    aria-controls={id}
                    onClick={() => setAberta(aberto ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl font-medium tracking-[-0.01em] transition-colors hover:text-vinho"
                  >
                    {item.pergunta}
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full border text-lg transition-[transform,background-color,color,border-color] duration-500 ${
                        aberto ? "rotate-45 border-vinho bg-vinho text-off" : "border-preto/20"
                      }`}
                      aria-hidden
                    >
                      +
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
                    <p className="max-w-[60ch] pb-6 text-lg leading-relaxed text-preto/70">{item.resposta}</p>
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
