// Seção de depoimentos (components/Alunos.tsx). Ela só aparece no site
// quando há vídeos de alunos em "depoimentos" (lib/content.ts). Pra ver
// antes, abra o site com ?alunos no endereço: aí ela usa clipes de exemplo
// (trechos do vídeo do Gustavo), com aviso de prévia na tela. Os exemplos
// nunca vão pro ar como se fossem alunos.
import { depoimentos } from "./content";

export const previaAlunos = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("alunos");

export type Depoimento = { nome: string; contexto: string; video: string };

const exemplos: Depoimento[] = [1, 2, 3, 4, 5].map((n) => ({
  nome: `Aluno ${n}`,
  contexto: "Vídeo de exemplo",
  video: `exemplo-aluno-${n}`,
}));

export const ehExemplo = depoimentos.length === 0;
export const listaAlunos: Depoimento[] = ehExemplo ? exemplos : depoimentos;
