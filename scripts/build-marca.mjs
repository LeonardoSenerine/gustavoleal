// Gera a capa de compartilhamento (og.jpg) e os ícones do site.
// O texto vira contorno vetorial direto da fonte do site (Archivo), então
// a capa tem a mesma tipografia sem depender de fonte instalada. Rode com: npm run marca
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as fontkit from "fontkit";
import sharp from "sharp";
import wawoff2 from "wawoff2";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);

// O fontkit só aplica os eixos variáveis (largura e peso) em TTF, então os
// WOFF2 do site são descompactados antes.
async function abrirFonte(pacote) {
  return fontkit.create(Buffer.from(await wawoff2.decompress(readFileSync(require.resolve(pacote)))));
}
const archivo = await abrirFonte("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");

// As mesmas cores do caderno no site (src/style.css).
const cor = {
  preto: "#0d0b0a",
  off: "#f1ebdf",
  caneta: "#d7263d",
  vinho: "#6b1020",
  carvao: "#161312",
};

// Texto em contorno: devolve o "d" do path e a largura em pixels.
// "display" é a voz dos títulos do site: Archivo no eixo mais estreito e
// pesado, em caixa alta. "espaco" é o tracking em em.
function texto(conteudo, { fonte = "sans", tamanho, wght = 400, espaco = 0 }) {
  const instancia =
    fonte === "display" ? archivo.getVariation({ wdth: 62, wght: 800 }) : archivo.getVariation({ wdth: 100, wght });
  const run = instancia.layout(fonte === "display" ? conteudo.toLocaleUpperCase("pt-BR") : conteudo);
  const escala = tamanho / instancia.unitsPerEm;
  let x = 0;
  const partes = [];
  run.glyphs.forEach((glifo, i) => {
    const pos = run.positions[i];
    const d = glifo.path
      .scale(escala, -escala)
      .translate(x + pos.xOffset * escala, -pos.yOffset * escala)
      .toSVG();
    if (d) partes.push(d);
    x += pos.xAdvance * escala + espaco * tamanho;
  });
  return { d: partes.join(" "), largura: x - espaco * tamanho };
}

function linha(conteudo, opcoes, x, y, preenchimento) {
  const t = texto(conteudo, opcoes);
  return { svg: `<path transform="translate(${x} ${y})" d="${t.d}" fill="${preenchimento}"/>`, largura: t.largura };
}

// Recorte com ponto de foco: (fx, fy) de 0 a 1 é onde o Gustavo está na
// foto, e o recorte tenta mantê-lo dentro, centralizado na horizontal.
async function recorte(arquivo, largura, altura, fx = 0.5, fy = 0.5) {
  const imagem = sharp(path.join(root, "assets/fotos", arquivo));
  const { width: W, height: H } = await imagem.metadata();
  const escala = Math.max(largura / W, altura / H);
  const [w, h] = [Math.round(largura / escala), Math.round(altura / escala)];
  const left = Math.min(Math.max(Math.round(fx * W - w / 2), 0), W - w);
  const top = Math.min(Math.max(Math.round(fy * H - h / 2), 0), H - h);
  const buffer = await imagem.extract({ left, top, width: w, height: h }).resize(largura * 2, altura * 2).png().toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Peças comuns das capas: o título em duas linhas ajustado à coluna, a
// frase com "decorar regra" riscado, a legenda em inglês, a linha sobre as
// aulas, o botão e o nome. "claro" é tinta no papel; "escuro", off-white na foto.
function blocoTexto({ x0, coluna, yTopo, tom }) {
  const tinta = tom === "claro" ? cor.preto : cor.off;
  const suave = tom === "claro" ? "rgba(13,11,10,0.62)" : "rgba(241,235,223,0.75)";
  const vermelho = tom === "claro" ? cor.caneta : "#f0566a";
  const base = texto("Viver o mundo.", { fonte: "display", tamanho: 100, espaco: -0.012 });
  const t = Math.floor((coluna / base.largura) * 100);
  const y1 = yTopo + (archivo.capHeight / archivo.unitsPerEm) * t;
  const y2 = y1 + t * 0.88;

  const sub = { tamanho: Math.round(t * 0.42), wght: 500, espaco: -0.035 };
  const antes = texto("Não pra ", sub);
  const riscado = texto("decorar regra.", sub);
  const y3 = y2 + sub.tamanho * 1.75;
  const r = { x1: x0 + antes.largura - 5, x2: x0 + antes.largura + riscado.largura + 7, y: y3 - sub.tamanho * 0.3 };

  const fraseIngles = "Learn English to live it, not to memorize it.";
  const tamIngles = Math.min(22, Math.floor((coluna / texto(fraseIngles, { tamanho: 100, wght: 500, espaco: -0.02 }).largura) * 100));
  const ingles = linha(fraseIngles, { tamanho: tamIngles, wght: 500, espaco: -0.02 }, x0, y3 + 46, vermelho);
  const descricao = linha("Aulas de inglês personalizadas, online ou presencial.", { tamanho: 18, wght: 500 }, x0, y3 + 82, suave);

  // A Archivo do site não tem a seta, então ela vai desenhada.
  const botaoTexto = texto("Aula experimental grátis", { tamanho: 18, wght: 650 });
  const botao = { x: x0, y: y3 + 112, w: botaoTexto.largura + 46 + 26, h: 52 };
  const fundoBotao = tom === "claro" ? cor.preto : cor.off;
  const textoBotao = tom === "claro" ? cor.off : cor.vinho;

  return `
  ${linha("Inglês pra", { fonte: "display", tamanho: t, espaco: -0.012 }, x0 - 4, y1, tinta).svg}
  ${linha("Viver o mundo.", { fonte: "display", tamanho: t, espaco: -0.012 }, x0 - 4, y2, tinta).svg}
  <path transform="translate(${x0} ${y3})" d="${antes.d}" fill="${tinta}"/>
  <path transform="translate(${x0 + antes.largura} ${y3})" d="${riscado.d}" fill="${tinta}"/>
  <path d="M${r.x1} ${r.y + 4}C${r.x1 + 80} ${r.y + 2} ${r.x2 - 100} ${r.y - 1} ${r.x2} ${r.y - 4}" fill="none" stroke="${cor.caneta}" stroke-width="4.5" stroke-linecap="round"/>
  ${ingles.svg}
  ${descricao.svg}
  <rect x="${botao.x}" y="${botao.y}" width="${botao.w}" height="${botao.h}" rx="2" fill="${fundoBotao}"/>
  <path transform="translate(${botao.x + 23} ${botao.y + 33})" d="${botaoTexto.d}" fill="${textoBotao}"/>
  <path transform="translate(${botao.x + 23 + botaoTexto.largura + 12} ${botao.y + 26})" d="M0 0H15M9 -6L15 0L9 6" fill="none" stroke="${textoBotao}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function assinatura(x0, y, tom) {
  const nome = linha("Gustavo Leal", { fonte: "display", tamanho: 36 }, x0, y, tom === "claro" ? cor.preto : cor.off);
  const papel = linha("teacher de inglês", { tamanho: 19, wght: 500 }, x0 + nome.largura + 14, y - 4, tom === "claro" ? "rgba(13,11,10,0.6)" : "rgba(241,235,223,0.7)");
  return nome.svg + papel.svg;
}

// Balão de conversa com texto em contorno. "lado" diz de onde sai a ponta.
function balao({ x, y, conteudo, fundo, tinta, tamanho = 19, lado = "esquerda", wght = 500 }) {
  const t = texto(conteudo, { tamanho, wght });
  const w = t.largura + 34;
  const h = tamanho + 26;
  const raio = 16;
  const ponta = lado === "esquerda" ? `M${x + 2} ${y + h - 4}l-8 10 18-4z` : `M${x + w - 2} ${y + h - 4}l8 10-18-4z`;
  return {
    largura: w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${raio}" fill="${fundo}" filter="url(#sombra)"/><path d="${ponta}" fill="${fundo}"/>
  <path transform="translate(${x + 17} ${y + h / 2 + tamanho * 0.36})" d="${t.d}" fill="${tinta}"/>`,
  };
}

const filtros = `<defs><filter id="sombra" x="-20%" y="-40%" width="140%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dy="8"/><feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;

// Capa "cabine" (combina com a versão 1 do hero): a folha pautada com a
// linha vermelha da margem à esquerda e, à direita, o retrato dele na cabine
// vermelha com o telefone no ouvido e o balão "Hi, I'm Gustavo!".
async function capaCabine() {
  const W = 1200;
  const H = 630;
  const margem = 46;
  const x0 = margem + 46;
  const xFoto = 650;
  const foto = await recorte("londres-cabine.jpg", W - xFoto, H, 0.45, 0.3);
  const pauta = Array.from({ length: Math.ceil(H / 36) }, (_, i) => `<path d="M0 ${i * 36 + 35.5}H${xFoto}" stroke="rgba(13,11,10,0.06)"/>`).join("");
  const oi = balao({ x: xFoto + 30, y: 488, conteudo: "Hi, I’m Gustavo!", fundo: cor.off, tinta: cor.vinho, tamanho: 21, wght: 650 });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${filtros}
  <rect width="${W}" height="${H}" fill="${cor.off}"/>
  ${pauta}
  <rect x="${margem}" width="1.5" height="${H}" fill="${cor.caneta}"/>
  <image href="${foto}" x="${xFoto}" y="0" width="${W - xFoto}" height="${H}" preserveAspectRatio="none"/>
  ${oi.svg}
  ${blocoTexto({ x0, coluna: xFoto - x0 - 48, yTopo: 64, tom: "claro" })}
  ${assinatura(x0, 578, "claro")}
</svg>`;
}

// Capa "café" (combina com a versão 2): ele numa mesa de café ocupando a
// tela, a conversa da aula em balões perto do rosto e o título em off-white.
async function capaCafe() {
  const W = 1200;
  const H = 630;
  const margem = 46;
  const x0 = margem + 46;
  const xFoto = 380;
  const foto = await recorte("cafe-paris.jpg", W - xFoto, H, 0.56, 0.44);
  const b1 = balao({ x: 820, y: 62, conteudo: "So, tell me about you!", fundo: cor.vinho, tinta: cor.off });
  const b2 = balao({ x: 860, y: 128, conteudo: "I’m 25 and I love Friends.", fundo: cor.off, tinta: cor.preto, lado: "direita" });
  const b3 = balao({ x: 820, y: 194, conteudo: "Let’s use your favorite episode!", fundo: cor.vinho, tinta: cor.off });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${filtros}
  <defs><linearGradient id="funde" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${cor.carvao}"/><stop offset="0.38" stop-color="${cor.carvao}" stop-opacity="0.55"/><stop offset="0.7" stop-color="${cor.carvao}" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="${cor.carvao}"/>
  <image href="${foto}" x="${xFoto}" y="0" width="${W - xFoto}" height="${H}" preserveAspectRatio="none"/>
  <rect x="${xFoto}" width="${W - xFoto}" height="${H}" fill="url(#funde)"/>
  <rect x="${margem}" width="1.5" height="${H}" fill="${cor.caneta}" opacity="0.8"/>
  ${b1.svg}
  ${b2.svg}
  ${b3.svg}
  ${blocoTexto({ x0, coluna: 520, yTopo: 64, tom: "escuro" })}
  ${assinatura(x0, 578, "escuro")}
</svg>`;
}

// CAPA=cafe troca o desenho; SAIDA grava em outro arquivo (pra comparar).
async function capa() {
  const qual = process.env.CAPA === "cafe" ? "cafe" : "cabine";
  const svg = qual === "cafe" ? await capaCafe() : await capaCabine();
  const saida = process.env.SAIDA ?? path.join(root, "public/og.jpg");
  await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(saida);
  console.log(`capa ${qual} pronta: ${saida}`);
}

// Ícone: o "G" estreito e pesado dos títulos, com o ponto da caneta.
async function icones() {
  const tamanho = 400;
  const G = texto("G", { fonte: "display", tamanho });
  const capAltura = (archivo.capHeight / archivo.unitsPerEm) * tamanho;
  const raio = 30;
  const larguraTotal = G.largura + 14 + raio * 2;
  const x = (512 - larguraTotal) / 2;
  const y = (512 + capAltura) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${cor.preto}"/>
  <path transform="translate(${x} ${y})" d="${G.d}" fill="${cor.off}"/>
  <circle cx="${x + G.largura + 14 + raio}" cy="${y - raio}" r="${raio}" fill="${cor.caneta}"/>
</svg>
`;
  writeFileSync(path.join(root, "public/icon.svg"), svg);
  await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(root, "public/apple-touch-icon.png"));
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(root, "public/favicon-32.png"));
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(root, "public/icon-512.png"));
  console.log("ícones prontos");
}

await capa();
await icones();
