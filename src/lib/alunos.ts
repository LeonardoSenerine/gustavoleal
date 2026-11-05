// Versões da seção de depoimentos pra mostrar ao cliente: ?alunos=1 a 3.
// Enquanto os vídeos dos alunos não chegam, as versões usam clipes de
// exemplo (trechos dos vídeos que já existem), marcados como exemplo na
// tela. Quando chegarem, entram em "depoimentos" (lib/content.ts).
import { depoimentos } from "./content";

const param = typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("alunos") ?? "");
export const versaoAlunos = ["1", "2", "3"].includes(param) ? param : "";

export type Depoimento = { nome: string; contexto: string; video: string };

const exemplos: Depoimento[] = [1, 2, 3, 4, 5].map((n) => ({
  nome: `Aluno ${n}`,
  contexto: "Vídeo de exemplo",
  video: `exemplo-aluno-${n}`,
}));

export const ehExemplo = depoimentos.length === 0;
export const listaAlunos: Depoimento[] = ehExemplo ? exemplos : depoimentos;
