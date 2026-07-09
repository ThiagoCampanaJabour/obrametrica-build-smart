import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  Shield,
  Mail,
  Lock,
  Cookie,
  Eye,
  FileText,
  Users,
  Database,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

const PATH = "/politica-de-privacidade";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Política de Privacidade", path: PATH },
];

const EMAIL = "obrametricasite@gmail.com";

const sections = [
  {
    id: "introducao",
    icon: FileText,
    title: "1. Introdução",
    content: [
      "A Obra Métrica valoriza a privacidade dos usuários e está comprometida em proteger as informações pessoais tratadas em nosso site.",
      "Esta Política de Privacidade descreve de forma transparente quais dados coletamos, como os utilizamos, quais tecnologias empregamos (como cookies, Google Analytics, Google Search Console e Google AdSense) e quais são os direitos dos usuários de acordo com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).",
      "Ao acessar e utilizar o site, você concorda com as práticas aqui descritas. Recomendamos a leitura atenta deste documento.",
    ],
  },
  {
    id: "quem-somos",
    icon: Users,
    title: "2. Quem somos",
    content: [
      "A Obra Métrica é um portal brasileiro de calculadoras técnicas voltadas para construção civil, energia solar e conversores de unidades. Operamos sob o domínio obrametrica.com.br e somos responsáveis pelo tratamento dos dados coletados por meio deste site.",
      "Para dúvidas, sugestões ou exercício de direitos relacionados à privacidade, entre em contato pelo e-mail:",
    ],
  },
  {
    id: "informacoes-coletadas",
    icon: Database,
    title: "3. Quais informações coletamos",
    content: [
      "Coletamos informações de diferentes formas, conforme descrito abaixo:",
      "3.1. Dados de navegação e uso\nRegistros automáticos gerados durante a visita ao site, incluindo endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência, origem do acesso e outras estatísticas de uso. Esses dados são coletados por meio de cookies e tecnologias semelhantes.",
      "3.2. Dados fornecidos voluntariamente\nQuando você entra em contato pelo formulário de contato ou por e-mail, podemos coletar seu nome, e-mail e o conteúdo da mensagem. Esses dados são utilizados exclusivamente para responder à sua solicitação.",
      "3.3. Dados de publicidade\nPor meio do Google AdSense, podemos coletar informações relacionadas a interesses e comportamento de navegação para exibir anúncios mais relevantes, sempre respeitando as configurações de privacidade do usuário.",
    ],
  },
  {
    id: "uso-dos-dados",
    icon: Eye,
    title: "4. Como utilizamos os dados",
    content: [
      "As informações coletadas são utilizadas para as seguintes finalidades:",
      "• Melhorar a experiência de navegação e o funcionamento das calculadoras;\n• Analisar o desempenho do site e entender como os usuários interagem com as páginas;\n• Responder a dúvidas, sugestões e solicitações de contato;\n• Exibir anúncios relevantes por meio do Google AdSense;\n• Verificar a indexação e o desempenho do site no Google Search Console;\n• Garantir a segurança e a estabilidade da plataforma.",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "5. Cookies",
    content: [
      "Cookies são pequenos arquivos de texto armazenados no navegador do usuário quando ele visita um site. Eles ajudam a lembrar preferências, medir audiência e personalizar conteúdos.",
      "Utilizamos cookies para:\n• Manter o funcionamento correto das ferramentas e da interface;\n• Coletar dados estatísticos de uso (Google Analytics);\n• Viabilizar a exibição de anúncios (Google AdSense);\n• Registrar escolhas de consentimento, quando aplicável.",
      "O usuário pode gerenciar, bloquear ou excluir cookies a qualquer momento por meio das configurações do navegador. A desativação de cookies, no entanto, pode afetar o funcionamento de algumas funcionalidades do site.",
    ],
  },
  {
    id: "google-analytics",
    icon: AlertCircle,
    title: "6. Google Analytics",
    content: [
      "Utilizamos o Google Analytics 4 para entender como os visitantes utilizam o site. Essa ferramenta coleta dados como páginas visitadas, tempo de permanência, localização geográfica aproximada, tipo de dispositivo e origem do tráfego.",
      "O Google Analytics utiliza cookies para identificar sessões de navegação e gerar relatórios agregados. As informações são processadas pelo Google de acordo com a Política de Privacidade do Google.",
      "Você pode instalar o plugin de navegador para desativação do Google Analytics, disponível em: https://tools.google.com/dlpage/gaoptout",
    ],
  },
  {
    id: "google-search-console",
    icon: AlertCircle,
    title: "7. Google Search Console",
    content: [
      "Utilizamos o Google Search Console para monitorar o desempenho do site nos resultados de busca, identificar erros de indexação, verificar consultas de pesquisa e melhorar a visibilidade do conteúdo.",
      "Essa ferramenta pode exibir dados agregados sobre cliques, impressões, posições médias e palavras-chave utilizadas para encontrar o site. Esses dados não identificam usuários individualmente.",
    ],
  },
  {
    id: "google-adsense",
    icon: AlertCircle,
    title: "8. Google AdSense",
    content: [
      "A Obra Métrica utiliza o Google AdSense para exibir anúncios. O Google pode usar cookies e tecnologias semelhantes para coletar informações sobre as visitas a este e a outros sites, com o objetivo de exibir anúncios relacionados aos interesses do usuário.",
      "Os anúncios são exibidos com base em critérios automáticos definidos pelo Google. A Obra Métrica não seleciona individualmente os anúncios apresentados a cada usuário.",
      "Para mais informações, consulte a Política de Privacidade do Google e as Configurações de anúncios do Google.",
    ],
  },
  {
    id: "cookies-publicidade",
    icon: Cookie,
    title: "9. Cookies de publicidade",
    content: [
      "Cookies de publicidade são utilizados para limitar a frequência de exibição de um anúncio, medir a eficácia de campanhas e apresentar anúncios mais relevantes com base no histórico de navegação.",
      "O Google e seus parceiros podem usar cookies para personalizar a publicidade exibida. O usuário pode gerenciar suas preferências de anúncios personalizados acessando:\nhttps://adssettings.google.com",
      "A Obra Métrica respeita as configurações de privacidade do usuário e segue as diretrizes do Google para sites que exibem anúncios.",
    ],
  },
  {
    id: "armazenamento",
    icon: Database,
    title: "10. Armazenamento de informações",
    content: [
      "As informações coletadas são armazenadas por meio de serviços seguros de hospedagem e infraestrutura, com acesso restrito e medidas de proteção adequadas.",
      "Dados de navegação e uso são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política e para atender a obrigações legais. Mensagens de contato são armazenadas apenas pelo período necessário para responder e dar seguimento às solicitações.",
    ],
  },
  {
    id: "compartilhamento",
    icon: ExternalLink,
    title: "11. Compartilhamento de dados",
    content: [
      "A Obra Métrica não vende, aluga ou compartilha dados pessoais com terceiros para fins comerciais. Podemos compartilhar dados apenas nas seguintes situações:",
      "• Com provedores de serviços essenciais ao funcionamento do site (hospedagem, estatísticas, publicidade);\n• Quando exigido por lei, determinação judicial ou autoridade competente;\n• Para proteger nossos direitos, segurança ou a integridade da plataforma.",
    ],
  },
  {
    id: "direitos-lgpd",
    icon: Shield,
    title: "12. Direitos do usuário segundo a LGPD",
    content: [
      "De acordo com a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos:",
      "• Confirmar a existência de tratamento de dados pessoais;\n• Acessar seus dados pessoais;\n• Corrigir dados incompletos, inexatos ou desatualizados;\n• Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;\n• Revogar o consentimento, quando o tratamento tiver como base o consentimento;\n• Solicitar a portabilidade dos dados;\n• Ser informado sobre entidades com as quais seus dados foram compartilhados;\n• Reclamar perante a Autoridade Nacional de Proteção de Dados (ANPD).",
      "Para exercer seus direitos, entre em contato conosco pelo e-mail:",
    ],
  },
  {
    id: "seguranca",
    icon: Lock,
    title: "13. Segurança das informações",
    content: [
      "Adotamos medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui o uso de conexão segura (HTTPS), acesso restrito a sistemas internos e acompanhamento contínuo de boas práticas de segurança.",
      "Embora nos esforcemos para garantir a segurança dos dados, nenhum sistema é totalmente invulnerável. Por isso, recomendamos que os usuários também mantenham seus dispositivos e navegadores atualizados.",
    ],
  },
  {
    id: "links-externos",
    icon: ExternalLink,
    title: "14. Links para sites externos",
    content: [
      "Nosso site pode conter links para sites e serviços de terceiros, como Google, fornecedores de conteúdo e parceiros. Esta Política de Privacidade se aplica apenas à Obra Métrica.",
      "Ao acessar links externos, recomendamos que você leia as respectivas políticas de privacidade, pois não nos responsabilizamos pelas práticas de privacidade de sites de terceiros.",
    ],
  },
  {
    id: "alteracoes",
    icon: FileText,
    title: "15. Alterações nesta política",
    content: [
      "Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas, serviços ou legislação aplicável. A data da última atualização será sempre indicada ao final desta página.",
      "Recomendamos que você consulte este documento regularmente. Alterações relevantes serão publicadas com a devida destaque.",
    ],
  },
  {
    id: "contato",
    icon: Mail,
    title: "16. Contato",
    content: [
      "Se tiver dúvidas, sugestões ou desejar exercer seus direitos relacionados à privacidade, entre em contato conosco pelo e-mail:",
    ],
  },
];

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    pageHead({
      title: "Política de Privacidade | Obra Métrica",
      description:
        "Saiba como a Obra Métrica coleta, usa e protege seus dados. Política de Privacidade compatível com LGPD, Google AdSense, Analytics e Search Console.",
      path: PATH,
      type: "article",
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Política de Privacidade",
        url: `${SITE_URL}${PATH}`,
        description:
          "Política de Privacidade do site Obra Métrica, com informações sobre coleta de dados, cookies, Google AdSense, Analytics, Search Console e direitos dos usuários sob a LGPD.",
        isPartOf: {
          "@type": "WebSite",
          name: "Obra Métrica",
          url: SITE_URL,
        },
      },
    }),
  component: PoliticaPrivacidadePage,
});

function PoliticaPrivacidadePage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Legal
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Saiba como a Obra Métrica coleta, utiliza e protege as informações dos usuários. Este
          documento foi elaborado para atender às exigências do Google AdSense e da Lei Geral de
          Proteção de Dados (LGPD).
        </p>

        <div className="mt-10 space-y-10">
          {sections.map(({ id, icon: Icon, title, content }) => (
            <article
              key={id}
              id={id}
              className="rounded-xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-accent/50"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
                  <div className="mt-4 space-y-3 text-muted-foreground">
                    {content.map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-line leading-relaxed">
                        {paragraph.includes("@") && !paragraph.includes("http") ? (
                          <a
                            href={`mailto:${EMAIL}`}
                            className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
                          >
                            {EMAIL}
                          </a>
                        ) : paragraph.includes("https://") ? (
                          <>
                            {paragraph.split(/(https:\/\/[^\s]+)/g).map((part, i) =>
                              part.startsWith("https://") ? (
                                <a
                                  key={i}
                                  href={part}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
                                >
                                  {part}
                                </a>
                              ) : (
                                part
                              ),
                            )}
                          </>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Dúvidas sobre privacidade?</h2>
          <p className="mt-3 text-primary-foreground/90">
            Se precisar de esclarecimentos ou quiser exercer seus direitos, envie um e-mail para{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="font-semibold underline underline-offset-2 hover:text-white"
            >
              {EMAIL}
            </a>
            .
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Última atualização:{" "}
          {new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
      </section>
    </SiteLayout>
  );
}
