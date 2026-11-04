// Versões do hero pra mostrar ao cliente: ?hero=1 a ?hero=4 no endereço.
// Sem o parâmetro, fica a abertura atual com as três tiras de viagem.
const param = typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("hero") ?? "");

export const versaoHero = ["1", "2", "3", "4"].includes(param) ? param : "";
