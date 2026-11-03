import type { ReactNode } from "react";
import { contato, linkWhatsApp } from "@/lib/content";
import { Header } from "@/components/Header";
import { Rodape } from "@/components/Rodape";
import { montar } from "./montar";

// Texto escrito a partir do que o site faz hoje: sem formulários, sem
// cookies de rastreamento e contato só pelo WhatsApp. Se entrar alguma
// ferramenta de análise ou anúncio, esta página e um aviso de cookies
// precisam ser atualizados antes.
const atualizacao = "3 de novembro de 2026";

const telefone = contato.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

const secoes: { id: string; titulo: string; conteudo: ReactNode }[] = [
  {
    id: "quem-somos",
    titulo: "Quem cuida dos seus dados",
    conteudo: (
      <p>
        Este site é do professor de inglês Gustavo Leal, responsável pelo tratamento dos dados pessoais descritos aqui, nos termos da Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018, LGPD). Para qualquer assunto sobre privacidade, fale direto pelo WhatsApp {telefone}.
      </p>
    ),
  },
  {
    id: "dados",
    titulo: "Quais dados são coletados",
    conteudo: (
      <>
        <p>
          O site não tem formulário, cadastro nem área de login. Navegar por ele não exige que você informe nenhum dado pessoal.
        </p>
        <p>
          Quando você clica em um botão de contato, é levado ao WhatsApp com uma mensagem pronta. A partir daí, os dados que você decidir enviar na conversa,
          como nome, número de telefone, objetivos com o inglês e disponibilidade de horário, são usados para responder, agendar a aula experimental e,
          se você contratar, organizar as aulas.
        </p>
        <p>
          Como qualquer site, o servidor de hospedagem pode registrar automaticamente dados técnicos de acesso, como endereço IP, tipo de navegador, páginas
          acessadas, data e hora. Esses registros servem apenas para segurança e funcionamento do site.
        </p>
      </>
    ),
  },
  {
    id: "finalidade",
    titulo: "Para que os dados são usados",
    conteudo: (
      <ul>
        <li>Responder seu contato e tirar dúvidas sobre as aulas.</li>
        <li>Agendar a aula experimental e combinar horários.</li>
        <li>Prestar o serviço contratado: planejar aulas, acompanhar sua evolução e enviar materiais.</li>
        <li>Manter o site seguro e funcionando.</li>
      </ul>
    ),
  },
  {
    id: "base-legal",
    titulo: "Base legal",
    conteudo: (
      <p>
        O uso dos dados para responder contatos, agendar e dar aulas se apoia na execução de contrato e nos procedimentos preliminares a ele (art. 7º, V, da
        LGPD). Os registros técnicos de acesso se apoiam no legítimo interesse de manter o site seguro (art. 7º, IX) e, quando aplicável, no cumprimento de
        obrigação legal (art. 7º, II).
      </p>
    ),
  },
  {
    id: "compartilhamento",
    titulo: "Compartilhamento",
    conteudo: (
      <>
        <p>Seus dados não são vendidos nem cedidos para fins de publicidade. Eles só passam por:</p>
        <ul>
          <li>
            <strong>WhatsApp (Meta)</strong>, onde a conversa acontece, de acordo com a política de privacidade do próprio WhatsApp.
          </li>
          <li>
            <strong>Provedor de hospedagem do site</strong>, que guarda os registros técnicos de acesso.
          </li>
          <li>Autoridades públicas, somente quando houver obrigação legal ou ordem judicial.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    titulo: "Cookies",
    conteudo: (
      <>
        <p>
          Cookies são pequenos arquivos que um site pode guardar no seu navegador. <strong>Este site não usa cookies de rastreamento, de análise de audiência
          nem de publicidade</strong>, e por isso não exibe aviso para você aceitar ou recusar.
        </p>
        <p>
          Fontes, fotos e vídeos são servidos pelo próprio site, sem carregar conteúdo de redes sociais ou de outros serviços que poderiam acompanhar sua
          navegação. Ao sair do site pelo botão do WhatsApp, valem os cookies e as regras do WhatsApp.
        </p>
        <p>
          Se no futuro alguma ferramenta de análise ou anúncio for adicionada, esta política será atualizada antes e você poderá escolher se aceita ou não.
          Você também pode apagar ou bloquear cookies a qualquer momento nas configurações do seu navegador.
        </p>
      </>
    ),
  },
  {
    id: "retencao",
    titulo: "Por quanto tempo os dados ficam guardados",
    conteudo: (
      <p>
        As conversas e informações de alunos ficam guardadas enquanto houver relação de aulas e pelo tempo necessário para cumprir obrigações legais. Contatos
        que não viraram aula podem ser apagados a qualquer momento, a seu pedido.
      </p>
    ),
  },
  {
    id: "direitos",
    titulo: "Seus direitos",
    conteudo: (
      <>
        <p>Pela LGPD (art. 18), você pode pedir a qualquer momento:</p>
        <ul>
          <li>Confirmação de que seus dados são tratados e acesso a eles.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>Anonimização, bloqueio ou exclusão de dados desnecessários.</li>
          <li>Portabilidade dos dados para outro fornecedor.</li>
          <li>Informação sobre com quem os dados foram compartilhados.</li>
          <li>Revogação do consentimento, quando for essa a base do tratamento.</li>
        </ul>
        <p>
          É só mandar mensagem no{" "}
          <a href={linkWhatsApp("Oi, Leal! Quero fazer um pedido sobre meus dados pessoais.")} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          . Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </>
    ),
  },
  {
    id: "menores",
    titulo: "Alunos menores de idade",
    conteudo: (
      <p>
        Quando o aluno tem menos de 18 anos, o contato, o agendamento e a contratação são feitos com a mãe, o pai ou o responsável legal, que autoriza o uso
        dos dados necessários para as aulas.
      </p>
    ),
  },
  {
    id: "seguranca",
    titulo: "Segurança",
    conteudo: (
      <p>
        O site é servido com conexão criptografada (HTTPS), e o acesso aos dados de alunos fica restrito ao professor. Nenhum sistema é 100% imune a
        incidentes, mas, se algum acontecer, você será avisado como a lei determina.
      </p>
    ),
  },
  {
    id: "mudancas",
    titulo: "Mudanças nesta política",
    conteudo: <p>Esta política pode ser atualizada. A data da última mudança fica sempre no topo da página.</p>,
  },
];

function Privacidade() {
  return (
    <>
      <Header interna />
      <main className="bg-off text-preto">
        <section className="bg-preto bg-[radial-gradient(70%_80%_at_85%_20%,rgb(142_28_49/0.5),transparent_70%),linear-gradient(170deg,var(--color-preto)_35%,var(--color-vinho-escuro))] px-4 pt-36 pb-16 text-off md:px-8 md:pt-44 md:pb-24">
          <p className="text-base font-semibold text-off/70 [font-stretch:90%]">Atualizada em {atualizacao}</p>
          <h1 className="display mt-5 text-[clamp(3.6rem,11vw,9rem)]">
            Privacidade
            <br />
            <span className="text-caneta">e cookies</span>
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-off/75">
            Em poucas palavras: este site não usa cookies de rastreamento, não tem formulário e só recebe seus dados quando você mesmo chama no WhatsApp.
            Abaixo está tudo em detalhes.
          </p>
        </section>

        <div className="grid gap-12 px-4 py-16 md:grid-cols-12 md:gap-8 md:px-8 md:py-24">
          <nav aria-label="Nesta página" className="md:col-span-3">
            <div className="md:sticky md:top-28">
              <p className="text-sm font-bold text-preto/50 uppercase [font-stretch:85%]">Nesta página</p>
              <ol className="mt-4 space-y-2">
                {secoes.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-preto/70 transition-colors hover:text-vinho">
                      {s.titulo}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-[68ch] md:col-span-8 md:col-start-5">
            {secoes.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-preto/10 py-10 first:border-t-0 first:pt-0">
                <h2 className="flex items-baseline gap-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                  <span className="text-caneta">{String(i + 1).padStart(2, "0")}</span>
                  {s.titulo}
                </h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-preto/80 [&_a]:font-semibold [&_a]:text-vinho [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:text-preto [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-vermelho">
                  {s.conteudo}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <Rodape />
    </>
  );
}

montar(<Privacidade />);
