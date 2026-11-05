import { useRef, useState, type PointerEvent as PE } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ehExemplo, listaAlunos as lista } from "@/lib/alunos";
import { Ingles, Titulo } from "./Secao";
import { useSequencia } from "./useSequencia";

// Três propostas pra seção de depoimentos em vídeo (?alunos=1 a 3). Todas
// tocam um vídeo de cada vez e passam pro próximo quando ele termina.

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
      {ehExemplo && (
        <p className={`mt-6 inline-flex rounded-full border px-3 py-1 text-sm ${tom === "claro" ? "border-preto/20 text-preto/60" : "border-off/25 text-off/70"}`}>
          Prévia com vídeos de exemplo. Aqui entram os depoimentos dos alunos.
        </p>
      )}
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

/* ------------------------------------------------------------------ */
/* 1. Carrossel: duas fileiras de capas deslizando em sentidos opostos  */
/*    com a rolagem e, no meio, o player que vai trocando sozinho. A    */
/*    capa do vídeo que está tocando acende nas fileiras.               */
/* ------------------------------------------------------------------ */
function Fileira({ classe, atual, ir }: { classe: string; atual: number; ir: (k: number) => void }) {
  const repetidas = [...lista, ...lista, ...lista];
  return (
    <div className={`${classe} flex w-max gap-3 md:gap-5`}>
      {repetidas.map((d, k) => {
        const ativo = k % n === atual;
        return (
          <button
            key={k}
            type="button"
            tabIndex={k < n ? 0 : -1}
            aria-hidden={k >= n || undefined}
            onClick={() => ir(k % n)}
            aria-label={`Assistir: ${d.nome}`}
            className={`relative aspect-[9/16] h-[38vw] shrink-0 overflow-hidden rounded-[4px] bg-preto transition-[opacity,outline-color] duration-500 md:h-[17vw] ${
              ativo ? "opacity-100 outline-2 outline-offset-2 outline-caneta" : "opacity-45 outline-2 outline-transparent hover:opacity-80"
            }`}
          >
            <img src={capa(d.video)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/80 to-transparent p-2 pt-6 text-left text-xs font-semibold md:text-sm">{d.nome}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AlunosCarrossel() {
  const s = useSequencia(n);
  const d = lista[s.atual];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: s.secao.current, start: "top bottom", end: "bottom top", scrub: 0.8 };
        gsap.fromTo(".fila-a", { xPercent: 0 }, { xPercent: -22, ease: "none", scrollTrigger: st });
        gsap.fromTo(".fila-b", { xPercent: -22 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: s.secao },
  );

  return (
    <section id="alunos" ref={s.secao} className="relative overflow-hidden bg-carvao py-20 text-off md:py-32">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <Cabecalho tom="escuro" className="recuo relative mx-auto max-w-[1500px]" />

      <div className="relative mt-14 md:mt-20">
        <Fileira classe="fila-a" atual={s.atual} ir={s.ir} />

        <div className="relative z-10 -my-[19vw] flex items-center justify-center gap-6 md:-my-[8vw]">
          <Seta lado="esq" onClick={s.anterior} className="hidden bg-carvao/80 backdrop-blur-sm md:grid" />
          <div className="relative aspect-[9/16] w-[60vw] overflow-hidden rounded-[18px] bg-preto shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] ring-4 ring-off md:w-[22vw] md:max-w-[340px]">
            <video {...s.propsVideo} src={mp4(d.video)} poster={capa(d.video)} className="absolute inset-0 h-full w-full object-cover" aria-label={`Depoimento: ${d.nome}`} />
            <Barras barra={s.barra} atual={s.atual} className="absolute inset-x-3 top-3" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-preto/85 to-transparent p-4 pt-16">
              <div key={s.atual} className="animate-[abrir_0.6s_cubic-bezier(.22,1,.36,1)]">
                <p className="display text-[1.9rem] md:text-[2.2rem]">{d.nome}</p>
                <p className="text-sm text-off/75">{d.contexto}</p>
              </div>
              <BotaoSom comSom={s.comSom} alternar={s.alternarSom} />
            </div>
          </div>
          <Seta lado="dir" onClick={s.proximo} className="hidden bg-carvao/80 backdrop-blur-sm md:grid" />
        </div>

        <Fileira classe="fila-b" atual={s.atual} ir={s.ir} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Stories: os vídeos em leque, o do meio grande e tocando, com as   */
/*    barras dos stories em cima. Toque nas laterais pra voltar ou      */
/*    avançar; quando um termina, o leque gira pro próximo.             */
/* ------------------------------------------------------------------ */
export function AlunosStories() {
  const s = useSequencia(n);
  const d = lista[s.atual];

  // Distância de cada vídeo até o atual, pelo caminho mais curto do leque.
  const distancia = (k: number) => {
    let x = k - s.atual;
    if (x > n / 2) x -= n;
    if (x < -n / 2) x += n;
    return x;
  };

  return (
    <section id="alunos" ref={s.secao} className="relative overflow-hidden bg-vinho py-20 text-off md:py-32">
      <div className="pauta-clara absolute inset-0" aria-hidden />
      <Cabecalho tom="vinho" className="recuo relative mx-auto max-w-[1500px] text-center [&_h2]:mx-auto" />

      <div className="relative mx-auto mt-12 h-[64svh] max-h-[720px] min-h-[440px] md:mt-16 md:h-[74svh]">
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
              className="absolute top-1/2 left-1/2 aspect-[9/16] h-full overflow-hidden rounded-[22px] bg-preto shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] transition-[transform,opacity,filter] duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                transform: `translate(-50%, -50%) translateX(${x * 64}%) scale(${x === 0 ? 1 : 0.8 - Math.abs(x) * 0.04}) rotate(${x * 3}deg)`,
                opacity: longe ? 0 : x === 0 ? 1 : 0.5,
                filter: x === 0 ? "none" : "saturate(0.6)",
                zIndex: 10 - Math.abs(x),
                pointerEvents: longe ? "none" : undefined,
              }}
            >
              <img src={capa(v.video)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              {x !== 0 && <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/80 to-transparent p-4 pt-10 text-left font-semibold">{v.nome}</span>}
            </button>
          );
        })}

        {/* O vídeo que toca, por cima da capa do meio. */}
        <div className="absolute top-1/2 left-1/2 z-20 aspect-[9/16] h-full -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] ring-2 ring-off/90">
          <video
            {...s.propsVideo}
            src={mp4(d.video)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${s.tocando ? "opacity-100" : "opacity-0"}`}
            aria-label={`Depoimento: ${d.nome}`}
          />
          <Barras barra={s.barra} atual={s.atual} className="absolute inset-x-3 top-3 z-10" />
          <button type="button" onClick={s.anterior} aria-label="Depoimento anterior" className="absolute inset-y-0 left-0 w-1/3" />
          <button type="button" onClick={s.proximo} aria-label="Próximo depoimento" className="absolute inset-y-0 right-0 w-1/3" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/85 to-transparent p-5 pt-20">
            <div key={s.atual} className="animate-[abrir_0.6s_cubic-bezier(.22,1,.36,1)]">
              <p className="display text-[2.1rem] md:text-[2.6rem]">{d.nome}</p>
              <p className="text-sm text-off/75">{d.contexto}</p>
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

/* ------------------------------------------------------------------ */
/* 3. Pilha de fichas: os vídeos são fichas empilhadas na mesa. A de    */
/*    cima toca; quando termina (ou você arrasta ela pro lado), ela     */
/*    voa e vai pro fundo da pilha, e a próxima começa.                 */
/* ------------------------------------------------------------------ */
const giros = [0, -4, 3.5, -2.2, 5, -3];

export function AlunosPilha() {
  const s = useSequencia(n);
  const d = lista[s.atual];
  const [saindo, setSaindo] = useState<number | null>(null);
  const arrasto = useRef<{ x0: number; dx: number; ativo: boolean }>({ x0: 0, dx: 0, ativo: false });
  const topo = useRef<HTMLDivElement>(null);

  function avancar() {
    if (saindo !== null) return;
    setSaindo(s.atual);
    s.proximo();
    window.setTimeout(() => setSaindo(null), 520);
  }

  // Arrastar a ficha de cima: passa de 70 px, ela voa e a próxima entra.
  const mover = (dx: number) => {
    const el = topo.current;
    const carta = el?.parentElement?.querySelector<HTMLElement>("[data-topo]");
    const t = dx ? `translateX(${dx}px) rotate(${dx / 18}deg)` : "";
    if (el) el.style.transform = t;
    if (carta) carta.style.translate = dx ? `${dx}px 0` : "";
    if (carta) carta.style.rotate = dx ? `${dx / 18}deg` : "";
  };
  const comecar = (e: PE) => {
    arrasto.current = { x0: e.clientX, dx: 0, ativo: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const arrastar = (e: PE) => {
    if (!arrasto.current.ativo) return;
    arrasto.current.dx = e.clientX - arrasto.current.x0;
    mover(arrasto.current.dx);
  };
  const soltar = () => {
    if (!arrasto.current.ativo) return;
    const { dx } = arrasto.current;
    arrasto.current.ativo = false;
    mover(0);
    if (Math.abs(dx) > 70) avancar();
    else if (Math.abs(dx) < 6) s.tocarOuPausar();
  };

  return (
    <section id="alunos" ref={s.secao} className="relative overflow-hidden bg-off py-20 text-preto md:py-32">
      <div className="pauta absolute inset-0" aria-hidden />
      <div className="recuo relative mx-auto grid max-w-[1500px] gap-14 md:grid-cols-12 md:items-center md:gap-6">
        <div className="md:col-span-5">
          <Cabecalho tom="claro" />

          <div className="mt-12 hidden border-t border-preto/12 pt-8 md:block">
            <p className="display text-[7rem] leading-none tabular-nums">
              {dois(s.atual)}
              <span className="text-[0.45em] text-preto/35"> / {dois(n - 1)}</span>
            </p>
            <div key={s.atual} className="mt-4 animate-[abrir_0.6s_cubic-bezier(.22,1,.36,1)]">
              <p className="display text-5xl">{d.nome}</p>
              <p className="mt-1 text-lg text-preto/60">{d.contexto}</p>
            </div>
          </div>

          <div className="mt-8 hidden flex-wrap items-center gap-3 md:flex">
            <button type="button" onClick={avancar} className="botao bg-preto text-off hover:bg-caneta">
              Próximo depoimento <span className="seta" aria-hidden>→</span>
            </button>
            <BotaoSom comSom={s.comSom} alternar={s.alternarSom} tom="claro" />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="relative mx-auto aspect-[9/17] w-[min(74vw,360px)] touch-pan-y select-none">
            {lista.map((v, k) => {
              const pos = (k - s.atual + n) % n;
              const voando = k === saindo;
              return (
                <div
                  key={v.video}
                  {...(pos === 0 && !voando ? { "data-topo": "" } : {})}
                  className="absolute inset-0 rounded-[4px] bg-folha p-2.5 pb-14 shadow-[0_1px_0_rgb(13_11_10/0.06),0_30px_60px_-30px_rgb(13_11_10/0.55)] ring-1 ring-preto/8 transition-[transform,opacity] duration-[520ms] ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{
                    transform: voando
                      ? "translate(135%, -6%) rotate(22deg)"
                      : `translate(${pos * 5}px, ${pos * 11}px) rotate(${giros[pos % giros.length]}deg) scale(${1 - pos * 0.035})`,
                    opacity: voando ? 0 : pos > 3 ? 0 : 1,
                    zIndex: voando ? 2 * n + 2 : 2 * (n - pos),
                  }}
                  aria-hidden
                >
                  <div className="relative h-full overflow-hidden rounded-[2px] bg-preto">
                    <img src={capa(v.video)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <p className="absolute inset-x-4 bottom-4 flex items-baseline justify-between gap-2">
                    <span className="display text-2xl">{v.nome}</span>
                    <span className="nota text-preto/55">{dois(k)}</span>
                  </p>
                </div>
              );
            })}

            {/* Vídeo por cima da ficha do topo, no mesmo recorte da foto. */}
            <div
              ref={topo}
              onPointerDown={comecar}
              onPointerMove={arrastar}
              onPointerUp={soltar}
              onPointerCancel={soltar}
              className="absolute inset-x-2.5 top-2.5 bottom-14 cursor-grab overflow-hidden rounded-[2px] active:cursor-grabbing"
              style={{ zIndex: 2 * n + 1 }}
            >
              <video
                {...s.propsVideo}
                onEnded={avancar}
                src={mp4(d.video)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${s.tocando && saindo === null ? "opacity-100" : "opacity-0"}`}
                aria-label={`Depoimento: ${d.nome}`}
              />
              <Barras barra={s.barra} atual={s.atual} className="absolute inset-x-3 top-3" />
            </div>
          </div>

          {/* Controles no celular, embaixo da pilha. */}
          <div className="mt-10 flex items-center justify-between gap-4 md:hidden">
            <div key={s.atual} className="animate-[abrir_0.6s_cubic-bezier(.22,1,.36,1)]">
              <p className="display text-3xl">
                {d.nome}
                <span className="ml-3 text-preto/35">
                  {dois(s.atual)}/{dois(n - 1)}
                </span>
              </p>
              <p className="text-sm text-preto/60">Arraste a ficha pro lado pra passar.</p>
            </div>
            <BotaoSom comSom={s.comSom} alternar={s.alternarSom} tom="claro" />
          </div>
          <p className="mt-6 hidden text-center text-sm text-preto/50 md:block">Arraste a ficha pro lado pra passar, ou toque pra pausar.</p>
        </div>
      </div>
    </section>
  );
}
