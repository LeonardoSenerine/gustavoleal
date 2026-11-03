// Todo o texto do site num lugar só. Itens marcados com PENDENTE ainda
// dependem de material ou confirmação do Gustavo.

// PENDENTE: @ do Instagram.
export const contato = {
  whatsapp: "5511964113005",
  instagram: "",
};

export function linkWhatsApp(mensagem = "Oi, Gustavo! Quero agendar uma aula experimental grátis.") {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// Cartões do hero: o que o inglês abre na vida do aluno, além das viagens.
// O visitante marca os que importam pra ele, e a escolha vai junto na
// mensagem do WhatsApp (ver lib/interesses.ts).
export const experiencias: { id: string; titulo: string; texto: string; video?: string; foto?: string; alt?: string }[] = [
  {
    id: "trabalho",
    titulo: "Trabalho",
    texto: "Reuniões, entrevistas e novas oportunidades de carreira.",
    foto: "cafe-paris",
    alt: "Gustavo sentado numa mesa de café em Paris",
  },
  {
    id: "viagens",
    titulo: "Viagens",
    texto: "Perguntar, pedir e se virar em qualquer lugar.",
    foto: "londres-cabine",
    alt: "Gustavo numa cabine telefônica vermelha em Londres",
  },
  { id: "cultura", titulo: "Cultura", texto: "Música, filmes e séries sem depender da legenda.", video: "exp-cultura" },
  {
    id: "perspectivas",
    titulo: "Novas perspectivas",
    texto: "Conhecer gente de outros lugares e ver o mundo de outro jeito.",
    foto: "piramide",
    alt: "A pirâmide de vidro do Louvre vista de baixo",
  },
];

// Etapas tiradas do texto de metodologia do Gustavo.
export const etapas = [
  {
    numero: "01",
    titulo: "Você no centro",
    texto: "Cada pessoa aprende de um jeito diferente. Conteúdos e atividades são preparados individualmente, a partir dos seus interesses, objetivos, dificuldades e ritmo.",
    foto: "madrid-rooftop",
  },
  {
    numero: "02",
    titulo: "Fala desde o início",
    texto: "O inglês é aprendido na prática, com foco na comunicação desde a primeira aula. É praticando que você ganha confiança pra se comunicar.",
    foto: "londres-big-ben-gustavo",
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

// Experiência de sala de aula, do texto de trajetória dele.
export const experienciaProfissional = ["Aulas particulares", "Escolas de idiomas", "Ensino escolar", "Alunos de várias idades e níveis"];

// Países onde ele usou o inglês, pelas fotos que mandou.
export const paises = ["Inglaterra", "França", "Espanha", "Itália"];

// Fotos que passam por trás da trajetória, em duas fileiras.
export const galeriaViagens = [
  [
    { foto: "big-ben", lugar: "Londres" },
    { foto: "arco-triunfo", lugar: "Paris" },
    { foto: "sena-baguete", lugar: "Paris" },
    { foto: "sagrada", lugar: "Barcelona" },
    { foto: "londres-bandeira", lugar: "Londres" },
    { foto: "place-des-vosges", lugar: "Paris" },
    { foto: "madrid-gran-via", lugar: "Madrid" },
  ],
  [
    { foto: "coliseu", lugar: "Roma" },
    { foto: "eiffel-noite", lugar: "Paris" },
    { foto: "retiro", lugar: "Madrid" },
    { foto: "cafe-paris", lugar: "Paris" },
    { foto: "sacre-coeur", lugar: "Paris" },
    { foto: "madrid-galeria", lugar: "Madrid" },
    { foto: "louvre-estatua", lugar: "Paris" },
  ],
];

// Valores mensais da tabela do Gustavo. Em dupla, o preço é por pessoa.
export const planos = [
  { duracao: "1h", extenso: "1 hora", individual: 220, dupla: 160 },
  { duracao: "1h15", extenso: "1 hora e 15 minutos", individual: 260, dupla: 200 },
  { duracao: "1h30", extenso: "1 hora e 30 minutos", individual: 320, dupla: 240 },
  { duracao: "2h", extenso: "2 horas", individual: 415, dupla: 320 },
];

// Tirado da fala dele no vídeo de apresentação.
export const incluso = [
  "Aula 100% personalizada pra você",
  "Do jeito que você aprende melhor",
  "Com o que você curte: música, série, viagem",
  "Online ou presencial",
];

// Só o que já foi confirmado: aula experimental grátis, online ou presencial,
// valores mensais da tabela e a metodologia dele.
// PENDENTE: confirmar com o Gustavo regras de remarcação e forma de pagamento
// antes de adicionar perguntas sobre isso.
export const perguntas = [
  {
    pergunta: "A aula experimental é grátis mesmo?",
    resposta:
      "Sim. É uma primeira conversa pra entender seu nível, seus objetivos e o que você curte, e mostrar como as aulas funcionam na prática.",
  },
  {
    pergunta: "As aulas são online ou presenciais?",
    resposta: "Você escolhe. Dá pra fazer online, de onde estiver, ou presencial. Local e horários a gente combina pelo WhatsApp.",
  },
  {
    pergunta: "Preciso ter algum nível de inglês pra começar?",
    resposta:
      "Não. Já dei aula pra alunos de diferentes idades e níveis. O conteúdo parte de onde você está hoje, do primeiro “hi” até a conversa fluente.",
  },
  {
    pergunta: "Como é uma aula na prática?",
    resposta:
      "Muita conversa e pouca decoreba. A aula usa músicas, filmes, séries e situações do dia a dia, sempre conectadas aos seus interesses e ao seu objetivo, seja trabalho, viagem ou cultura.",
  },
  {
    pergunta: "Como funciona a aula em dupla?",
    resposta:
      "Vocês estudam juntos, na mesma aula, e cada um paga o valor por pessoa da tabela. É uma boa pra casais, amigos ou colegas de trabalho com objetivos parecidos.",
  },
  {
    pergunta: "Como são os valores?",
    resposta:
      "O valor é mensal e depende de quantas horas por semana você quer estudar: de 1 hora a 2 horas semanais. A tabela completa está logo acima, em Planos.",
  },
  {
    pergunta: "Você dá aula pra crianças e adolescentes?",
    resposta: "Sim. Quando o aluno é menor de idade, o agendamento e a contratação são feitos com o responsável.",
  },
];
