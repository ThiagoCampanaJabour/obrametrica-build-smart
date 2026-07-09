import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  Cookie,
  Settings,
  Shield,
  BarChart3,
  Megaphone,
  Mail,
  FileText,
  AlertCircle,
} from "lucide-react";

const PATH = "/politica-de-cookies";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Política de Cookies", path: PATH },
];
const EMAIL = "obrametricasite@gmail.com";

export const Route = createFileRoute("/politica-de-cookies")({
  head: () =>
    pageHead({
      title: "Política de Cookies | Obra Métrica",
      description:
        "Saiba como o Obra Métrica utiliza cookies e tecnologias semelhantes para melhorar sua navegação, medir audiência e exibir anúncios personalizados.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Política de Cookies | Obra Métrica",
        url: `${SITE_URL}${PATH}`,
        description:
          "Política de uso de cookies do Obra Métrica em conformidade com a LGPD e diretrizes do Google.",
        inLanguage: "pt-BR",
      },
    }),
  component: PoliticaDeCookiesPage,
});

const sections = [
  {
    icon: FileText,
    title: "1. O que são cookies",
    content: [
      "Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles ajudam a lembrar preferências, autenticar sessões, medir audiência e personalizar conteúdo e anúncios.",
      "Também utilizamos tecnologias semelhantes, como pixels, tags e armazenamento local (localStorage), que cumprem funções equivalentes aos cookies.",
    ],
  },
  {
    icon: Cookie,
    title: "2. Por que utilizamos cookies",
    content: [
      "O Obra Métrica utiliza cookies para garantir o funcionamento correto do site, analisar o desempenho das páginas, entender o comportamento dos usuários e exibir anúncios relevantes por meio de parceiros como o Google AdSense.",
      "O uso dessas tecnologias nos permite oferecer calculadoras rápidas, seguras e cada vez mais úteis para profissionais da construção civil, energia solar e demais áreas técnicas.",
    ],
  },
  {
    icon: Shield,
    title: "3. Cookies estritamente necessários",
    content: [
      "São cookies indispensáveis para o funcionamento do site. Sem eles, recursos básicos como navegação entre páginas, carregamento das calculadoras e segurança da sessão podem não funcionar corretamente.",
      "Esses cookies não podem ser desativados em nossos sistemas e geralmente são definidos apenas em resposta a ações realizadas por você, como preferências de visualização e envio de formulários.",
    ],
  },
  {
    icon: BarChart3,
    title: "4. Cookies analíticos e de desempenho",
    content: [
      "Utilizamos o Google Analytics 4 e o Google Tag Manager para coletar informações agregadas sobre o número de visitantes, origem do tráfego, páginas mais acessadas e tempo de permanência.",
      "Esses dados são tratados de forma anônima e agregada, e nos ajudam a entender como melhorar continuamente o conteúdo e a usabilidade do Obra Métrica.",
    ],
  },
  {
    icon: Megaphone,
    title: "5. Cookies de publicidade",
    content: [
      "Podemos exibir anúncios do Google AdSense e de parceiros de publicidade autorizados. Esses cookies são utilizados para tornar a publicidade mais relevante, limitar o número de vezes que um anúncio é exibido e medir a eficácia das campanhas.",
      "O Google e seus parceiros podem utilizar cookies para personalizar anúncios com base em visitas anteriores a este e a outros sites. Você pode desativar a publicidade personalizada em: https://adssettings.google.com",
    ],
  },
  {
    icon: Settings,
    title: "6. Como gerenciar cookies",
    content: [
      "Você pode aceitar, recusar ou excluir cookies a qualquer momento por meio das configurações do seu navegador. Cada navegador oferece opções específicas para gerenciar essas preferências.",
      "Links úteis:\n• Google Chrome: https://support.google.com/chrome/answer/95647\n• Mozilla Firefox: https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-armazenamento-cookies\n• Microsoft Edge: https://support.microsoft.com/pt-br/microsoft-edge\n• Safari: https://support.apple.com/pt-br/guide/safari/sfri11471/mac",
      "A desativação de cookies pode impactar sua experiência de navegação, afetando funcionalidades como estatísticas de uso e exibição de anúncios adequados ao seu perfil.",
    ],
  },
  {
    icon: AlertCircle,
    title: "7. Cookies de terceiros",
    content: [
      "Além dos cookies próprios, o site pode utilizar cookies definidos por serviços de terceiros, incluindo Google Analytics, Google Tag Manager, Google AdSense e Google Search Console. Cada um desses serviços possui sua própria política de privacidade e uso de cookies.",
      "Não temos controle sobre os cookies definidos por terceiros. Recomendamos consultar as políticas específicas dessas empresas para mais informações.",
    ],
  },
  {
    icon: FileText,
    title: "8. Base legal e consentimento (LGPD)",
    content: [
      "O uso de cookies no Obra Métrica é fundamentado no legítimo interesse para cookies estritamente necessários e no consentimento do usuário para cookies analíticos e publicitários, conforme a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).",
      "Ao continuar navegando no site, você concorda com o uso de cookies conforme descrito nesta Política. É possível revogar o consentimento a qualquer momento ajustando as configurações do navegador.",
    ],
  },
  {
    icon: AlertCircle,
    title: "9. Alterações nesta Política",
    content: [
      "Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças legais, tecnológicas ou operacionais. A versão vigente estará sempre disponível nesta página, com a data da última atualização.",
    ],
  },
  {
    icon: Mail,
    title: "10. Contato",
    content: [
      "Em caso de dúvidas sobre esta Política de Cookies ou sobre o tratamento de dados pessoais no Obra Métrica, entre em contato pelo e-mail:",
    ],
  },
];

function PoliticaDeCookiesPage() {
  const updated = new Date().toLocaleDateString("pt-BR");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Documento legal
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Política de Cookies
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Última atualização: {updated}. Esta política descreve como o Obra Métrica utiliza cookies
          e tecnologias semelhantes em conformidade com a LGPD e as diretrizes do Google.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <article key={s.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-foreground" aria-hidden />
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{s.title}</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground">
                  {s.content.map((p, i) => (
                    <p key={i} className="whitespace-pre-line leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {s.title.startsWith("10.") && (
                    <a
                      href={`mailto:${EMAIL}`}
                      className="inline-block font-medium text-foreground hover:text-accent"
                    >
                      {EMAIL}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
