// Todo o texto do site num lugar só. Itens marcados com PENDENTE ainda
// dependem de material do Gustavo (número, vídeos, valores, trajetória).

// PENDENTE: @ do Instagram.
export const contato = {
  whatsapp: "5511964113005",
  instagram: "",
};

export function linkWhatsApp(mensagem = "Oi, Leal! Quero agendar uma aula experimental.") {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const cidades = ["London", "Paris", "Roma", "Madrid", "Barcelona"];

// Etapas tiradas do texto de metodologia do Gustavo.
export const etapas = [
  {
    numero: "01",
    titulo: "Você no centro",
    texto: "Cada pessoa aprende de um jeito diferente. Conteúdos e atividades são preparados individualmente, a partir dos seus interesses, objetivos, dificuldades e ritmo.",
    foto: "cafe-paris",
  },
  {
    numero: "02",
    titulo: "Fala desde o início",
    texto: "O inglês é aprendido na prática, com foco na comunicação desde a primeira aula. É praticando que você ganha confiança pra se comunicar.",
    foto: "madrid-rooftop",
  },
  {
    numero: "03",
    titulo: "Cultura",
    texto: "Músicas, filmes e séries entram como material de aula. O idioma aparece do jeito que é usado de verdade, e o aprendizado fica natural e interessante.",
    foto: "louvre-estatua",
  },
  {
    numero: "04",
    titulo: "Vida real",
    texto: "Conversas, situações do cotidiano e assuntos que fazem parte da sua vida. Você aprende o inglês que cabe na sua rotina.",
    foto: "rua-noite",
  },
  {
    numero: "05",
    titulo: "Sem decoreba",
    texto: "Não se trata de decorar regras ou traduzir frases. A ideia é entender o idioma, experimentar e praticar até ele ficar seu.",
    foto: "sagrada-sorriso",
  },
  {
    numero: "06",
    titulo: "Dentro e fora",
    texto: "Aprender inglês deve fazer sentido dentro e fora da sala de aula. O idioma vem pro seu mundo, e não o contrário.",
    foto: "eiffel-noite",
  },
];

// PENDENTE: vídeos dos alunos. Enquanto a lista estiver vazia, a seção de
// depoimentos some da página e do menu. Para cada vídeo novo: colocar o
// arquivo em assets/videos, registrar em scripts/prepare-media.mjs e
// adicionar aqui, por exemplo { nome: "Ana", contexto: "Aluna há 1 ano", video: "aluno-ana" }.
export const depoimentos: { nome: string; contexto: string; video: string }[] = [];

export const temDepoimentos = depoimentos.length > 0;

// Ordem das seções numeradas. O número de cada placa sai daqui, então
// esconder uma seção não deixa buraco na contagem.
const secoes = ["apresentacao", "metodo", ...(temDepoimentos ? ["alunos"] : []), "trajetoria", "planos"];

export function numeroSecao(id: string) {
  return String(secoes.indexOf(id) + 1).padStart(2, "0");
}

// As cidades e fotos são reais. As frases de cada parada ainda são rascunho:
// confirmar com o Gustavo.
export const paradas = [
  {
    cidade: "London",
    pais: "UK",
    fotos: ["big-ben", "londres-bandeira"],
    texto: "Onde o inglês saiu do livro e virou conversa de verdade, com sotaque, pressa e gíria.",
  },
  {
    cidade: "Paris",
    pais: "FR",
    fotos: ["arco-triunfo", "piramide", "sacre-coeur"],
    texto: "Até onde ninguém fala inglês primeiro, é ele que abre a porta: museu, café, metrô e amizade nova.",
  },
  {
    cidade: "Barcelona",
    pais: "ES",
    fotos: ["sagrada"],
    texto: "Turistas do mundo inteiro e uma língua em comum pra todo mundo se entender.",
  },
  {
    cidade: "Roma",
    pais: "IT",
    fotos: ["coliseu"],
    texto: "História em cada esquina e o inglês servindo de ponte em cada pergunta.",
  },
  {
    cidade: "Madrid",
    pais: "ES",
    fotos: ["madrid-gran-via", "retiro", "madrid-galeria"],
    texto: "Rooftop, Gran Vía e a prova de que dá pra se virar em qualquer lugar.",
  },
];

// Valores mensais da tabela do Gustavo. Em dupla, o preço é por pessoa.
export const planos = [
  { duracao: "1h", detalhe: "por semana", individual: 220, dupla: 160 },
  { duracao: "1h15", detalhe: "por semana", individual: 260, dupla: 200 },
  { duracao: "1h30", detalhe: "por semana", individual: 320, dupla: 240, destaque: true },
  { duracao: "2h", detalhe: "por semana", individual: 415, dupla: 320 },
];

// Tirado da fala dele no vídeo de apresentação.
export const incluso = [
  "Aula 100% personalizada pra você",
  "Do jeito que você aprende melhor",
  "Com o que você curte: música, série, viagem",
  "Inglês sem ser entediante",
];
