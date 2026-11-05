import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { listaAlunos as lista } from "@/lib/alunos";
import { Ingles, Titulo } from "./Secao";
import { useSequencia } from "./useSequencia";

// Depoimentos em vídeo dos alunos. Toca um vídeo de cada vez e passa pro
// próximo quando ele termina.

const n = lista.length;
const mp4 = (v: string) => `/media/${v}.mp4`;
const capa = (v: string) => `/media/${v}.jpg`;
const dois = (k: number) => String(k + 1).padStart(2, "0");

type Tom = "claro" | "escuro" | "vinho";

function Cabecalho({ tom, className = "" }: { tom: Tom; className?: string }) {
  return (
    <div className={className}>
      <Titulo>Quem fala por mim são eles.</Titulo>
      <Ingles tom={tom} className="mt-4 md:mt-6">
        Don’t take my word for it.
      </Ingles>
    </div>
  );
}

function Barras({ barra, atual, className = "" }: { barra: (k: number) => (el: HTMLElement | null) => void; atual: number; className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`} aria-hidden>
      {lista.map((d, k) => (
        <span key={d.video} className="h-[3px] flex-1 overflow-hidden rounded-full bg-off/30">
          <span ref={barra(k)} className="block h-full origin-left bg-off" style={{ transform: `scaleX(${k < atual ? 1 : 0})` }} />
        </span>
      ))}
    </div>
  );
}

function BotaoSom({ comSom, alternar, tom = "escuro" }: { comSom: boolean; alternar: () => void; tom?: Tom }) {
  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={comSom}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold backdrop-blur-sm transition-colors ${
        tom === "claro" ? "border border-preto/20 text-preto hover:bg-preto hover:text-off" : "bg-preto/55 text-off hover:bg-caneta"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2" aria-hidden>
        <path d="M4 9h4l5-4v14l-5-4H4z" strokeLinejoin="round" />
        {comSom ? <path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11" strokeLinecap="round" /> : <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />}
      </svg>
      {comSom ? "Com som" : "Ouvir"}
    </button>
  );
}

function Seta({ lado, onClick, tom = "escuro", className = "" }: { lado: "esq" | "dir"; onClick: () => void; tom?: Tom; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={lado === "esq" ? "Depoimento anterior" : "Próximo depoimento"}
      className={`grid size-12 place-items-center rounded-full border text-xl transition-colors ${
        tom === "claro" ? "border-preto/25 hover:border-preto hover:bg-preto hover:text-off" : "border-off/30 hover:border-off hover:bg-off hover:text-preto"
      } ${className}`}
    >
      {lado === "esq" ? "←" : "→"}
    </button>
  );
}

// Stories: os vídeos em leque, o do meio grande e tocando, com as barras
// dos stories em cima. Toque nas laterais pra voltar ou avançar; quando um
// termina, o leque gira pro próximo.
export function Alunos() {
  const s = useSequencia(n);
  const d = lista[s.atual];
  const palco = useRef<HTMLDivElement>(null);
  const arrasto = useRef({ x0: 0, dx: 0, ativo: false });
  const [arrastando, setArrastando] = useState(false);
  // O vídeo só aparece depois que o cartão novo assenta no centro, pra não
  // surgir no meio do giro do leque.
  const [assentou, setAssentou] = useState(true);
  // A transição do CSS só liga depois que o leque abre, pra não brigar com
  // a animação de entrada (que mexe na mesma variável a cada quadro).
  const [abriu, setAbriu] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    setAssentou(false);
    const t = window.setTimeout(() => setAssentou(true), 520);
    return () => window.clearTimeout(t);
  }, [s.atual]);

  // Entrada: o leque abre a partir do centro quando a seção chega.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".leque", {
          "--abre": 0,
          duration: 1.4,
          ease: "power4.out",
          onComplete: () => setAbriu(true),
          scrollTrigger: { trigger: palco.current, start: "top 80%" },
        });
      });
    },
    { scope: s.secao },
  );

  // Distância de cada vídeo até o atual, pelo caminho mais curto do leque.
  const distancia = (k: number) => {
    let x = k - s.atual;
    if (x > n / 2) x -= n;
    if (x < -n / 2) x += n;
    return x;
  };

  // Arrastar com o dedo (ou o mouse): o leque acompanha; passou de 60 px,
  // troca. Um toque curto nas laterais volta ou avança; no meio, pausa.
  const mover = (dx: number) => {
    const el = palco.current;
    if (!el) return;
    el.style.setProperty("--arrasto", `${dx}px`);
    el.style.setProperty("--giro", `${dx / 45}deg`);
  };
  const comecar = (e: React.PointerEvent<HTMLDivElement>) => {
    arrasto.current = { x0: e.clientX, dx: 0, ativo: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const arrastar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrasto.current.ativo) return;
    const dx = e.clientX - arrasto.current.x0;
    arrasto.current.dx = dx;
    if (Math.abs(dx) > 6 && !arrastando) setArrastando(true);
    mover(dx * 0.85);
  };
  const soltar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arrasto.current.ativo) return;
    const { dx } = arrasto.current;
    arrasto.current.ativo = false;
    setArrastando(false);
    mover(0);
    if (dx < -60) return s.proximo();
    if (dx > 60) return s.anterior();
    if (Math.abs(dx) > 6) return;
    const r = e.currentTarget.getBoundingClientRect();
    const onde = (e.clientX - r.left) / r.width;
    if (onde < 0.33) s.anterior();
    else if (onde > 0.67) s.proximo();
    else s.tocarOuPausar();
  };

  const curva = arrastando || !abriu ? "" : "transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(.32,.72,0,1)]";

  return (
    <section id="alunos" ref={s.secao} className="relative overflow-hidden bg-vinho py-20 text-off md:py-32">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <Cabecalho tom="vinho" className="recuo relative mx-auto max-w-[1500px] text-center [&_h2]:mx-auto" />

      <div
        ref={palco}
        className="leque relative mx-auto mt-12 h-[64svh] max-h-[720px] min-h-[440px] [--abre:1] [--arrasto:0px] [--giro:0deg] md:mt-16 md:h-[74svh]"
      >
        {lista.map((v, k) => {
          const x = distancia(k);
          const longe = Math.abs(x) > 2;
          return (
            <button
              key={v.video}
              type="button"
              onClick={() => s.ir(k)}
              tabIndex={x === 0 || longe ? -1 : 0}
              aria-label={`Assistir: ${v.nome}`}
              className={`absolute top-1/2 left-1/2 aspect-[9/16] h-full overflow-hidden rounded-[22px] bg-preto shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] will-change-transform ${curva}`}
              style={{
                transform: `translate(-50%, -50%) translateX(calc(${x * 64}% * var(--abre) + var(--arrasto))) scale(${x === 0 ? 1 : 0.8 - Math.abs(x) * 0.04}) rotate(calc(${x * 3}deg * var(--abre) + var(--giro)))`,
                opacity: longe ? 0 : 1,
                zIndex: 10 - Math.abs(x),
                pointerEvents: longe ? "none" : undefined,
              }}
            >
              <img src={capa(v.video)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              {/* Véu escuro nas laterais: mais leve que um filtro de cor. */}
              <span
                className={`absolute inset-0 bg-vinho-escuro transition-opacity duration-[700ms] ${x === 0 ? "opacity-0" : "opacity-55"}`}
                aria-hidden
              />
              {x !== 0 && <span className="absolute inset-x-0 bottom-0 p-4 text-left font-semibold">{v.nome}</span>}
            </button>
          );
        })}

        {/* O vídeo que toca, por cima da capa do meio, e a área de arrasto. */}
        <div
          onPointerDown={comecar}
          onPointerMove={arrastar}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          className={`absolute top-1/2 left-1/2 z-20 aspect-[9/16] h-full cursor-grab touch-pan-y overflow-hidden rounded-[22px] ring-2 ring-off/90 select-none active:cursor-grabbing will-change-transform ${curva}`}
          style={{ transform: "translate(-50%, -50%) translateX(var(--arrasto)) rotate(var(--giro))" }}
        >
          <img src={capa(d.video)} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          <video
            {...s.propsVideo}
            src={mp4(d.video)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${s.tocando && assentou ? "opacity-100" : "opacity-0"}`}
            aria-label={`Depoimento: ${d.nome}`}
          />
          <Barras barra={s.barra} atual={s.atual} className="absolute inset-x-3 top-3 z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/85 to-transparent p-5 pt-20">
            <div key={s.atual} className="animate-[abrir_0.7s_cubic-bezier(.32,.72,0,1)_0.15s_both]">
              <p className="display text-[2.1rem] md:text-[2.6rem]">{d.nome}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recuo relative mt-8 flex items-center justify-center gap-4">
        <Seta lado="esq" onClick={s.anterior} />
        <p className="display w-24 text-center text-3xl tabular-nums" aria-live="polite">
          {dois(s.atual)} <span className="text-off/45">/ {dois(n - 1)}</span>
        </p>
        <Seta lado="dir" onClick={s.proximo} />
        <BotaoSom comSom={s.comSom} alternar={s.alternarSom} />
      </div>
    </section>
  );
}
