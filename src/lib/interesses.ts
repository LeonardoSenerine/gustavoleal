import { useSyncExternalStore } from "react";
import { experiencias, linkWhatsApp } from "./content";

// O que o visitante marcou nos cartões do hero. Fica em memória enquanto a
// página está aberta e personaliza os botões de WhatsApp do site todo.
let escolhidos: string[] = [];
const ouvintes = new Set<() => void>();

function avisar() {
  ouvintes.forEach((ouvir) => ouvir());
}

export function alternarInteresse(id: string) {
  escolhidos = escolhidos.includes(id) ? escolhidos.filter((e) => e !== id) : [...escolhidos, id];
  avisar();
}

export function useInteresses() {
  return useSyncExternalStore(
    (ouvir) => {
      ouvintes.add(ouvir);
      return () => ouvintes.delete(ouvir);
    },
    () => escolhidos,
  );
}

// "trabalho e cultura", "trabalho, viagens e cultura"
export function listarInteresses(ids: string[]) {
  const nomes = experiencias.filter((e) => ids.includes(e.id)).map((e) => e.titulo.toLowerCase());
  if (nomes.length <= 1) return nomes.join("");
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

// Mensagem pronta do WhatsApp com o foco escolhido e, quando houver, o plano.
export function linkPersonalizado(ids: string[], plano?: string) {
  const partes = ["Oi, Gustavo! Quero agendar uma aula experimental grátis."];
  if (ids.length) partes.push(`Meu foco é inglês pra ${listarInteresses(ids)}.`);
  if (plano) partes.push(`Tenho interesse no plano de ${plano}.`);
  return linkWhatsApp(partes.join(" "));
}
