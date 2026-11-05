import { useCallback, useEffect, useRef, useState } from "react";

// Um único <video> que toca os depoimentos em sequência: quando um termina,
// o próximo entra. Começa sem som (o navegador só deixa tocar sozinho
// assim) e só toca enquanto a seção está na tela. As barras de progresso
// são atualizadas direto no estilo, a cada quadro, sem re-render.
export function useSequencia(total: number) {
  const secao = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const barras = useRef<(HTMLElement | null)[]>([]);
  const [atual, setAtual] = useState(0);
  const [comSom, setComSom] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [naTela, setNaTela] = useState(false);
  const reduzir = useRef(false);

  useEffect(() => {
    reduzir.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = secao.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Troca de vídeo ou entrada/saída da tela.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    setTocando(false);
    if (naTela && !reduzir.current) v.play().catch(() => {});
    else v.pause();
  }, [atual, naTela]);

  // Progresso: a barra do vídeo atual enche; as anteriores ficam cheias.
  useEffect(() => {
    let raf = 0;
    const passo = () => {
      const v = video.current;
      const p = v && v.duration ? v.currentTime / v.duration : 0;
      barras.current.forEach((b, k) => {
        if (b) b.style.transform = `scaleX(${k < atual ? 1 : k === atual ? p : 0})`;
      });
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [atual]);

  // Esconde o vídeo na mesma renderização da troca, pra capa antiga não piscar.
  const ir = useCallback(
    (k: number) => {
      setTocando(false);
      setAtual(((k % total) + total) % total);
    },
    [total],
  );
  const proximo = useCallback(() => {
    setTocando(false);
    setAtual((a) => (a + 1) % total);
  }, [total]);
  const anterior = useCallback(() => {
    setTocando(false);
    setAtual((a) => (a - 1 + total) % total);
  }, [total]);

  function alternarSom() {
    const v = video.current;
    if (!v) return;
    v.muted = comSom;
    setComSom(!comSom);
    if (v.paused) v.play().catch(() => {});
  }

  function tocarOuPausar() {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  // Propriedades do <video>: o React não atualiza "muted" depois de montar,
  // então ele é ajustado no alternarSom.
  const propsVideo = {
    ref: video,
    muted: true,
    playsInline: true,
    preload: "metadata" as const,
    onEnded: proximo,
    onPlaying: () => setTocando(true),
    onWaiting: () => setTocando(false),
  };

  const barra = (k: number) => (el: HTMLElement | null) => {
    barras.current[k] = el;
  };

  return { secao, atual, ir, proximo, anterior, comSom, alternarSom, tocarOuPausar, tocando, propsVideo, barra };
}
