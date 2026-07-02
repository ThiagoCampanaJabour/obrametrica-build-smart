import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  FileText,
  UserCheck,
  Ban,
  Calculator,
  ShieldAlert,
  Copyright,
  Link2,
  RefreshCw,
  Scale,
  Mail,
} from "lucide-react";

const PATH = "/termos-de-uso";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Termos de Uso", path: PATH },
];
const EMAIL = "obrametricasite@gmail.com";

export const Route = createFileRoute("/termos-de-uso")({
  head: () =>
    pageHead({
      title: "Termos de Uso | Obra Métrica",
      description:
        "Conheça os Termos de Uso do Obra Métrica: regras de utilização, responsabilidades, propriedade intelectual e limitações dos serviços oferecidos.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Termos de Uso | Obra Métrica",
        url: `${SITE_URL}${PATH}`,
        inLanguage: "pt-BR",
      },
    }),
  component: TermosDeUsoPage,
});

const sections = [
  {
    icon: FileText,
    title: "1. Aceitação dos termos",
    content: [
      "Ao acessar ou utilizar o site Obra Métrica (obrametrica.com.br), você concorda integralmente com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde com algum dos termos, recomendamos que não utilize o site.",
      "Estes termos constituem um acordo legal entre você (usuário) e o Obra Métrica.",
    ],
  },
  {
    icon: Calculator,
    title: "2. Descrição do serviço",
    content: [
      "O Obra Métrica é uma plataforma online que disponibiliza calculadoras técnicas gratuitas voltadas para construção civil, energia solar, conversores de unidades e ferramentas correlatas.",
      "As calculadoras e conteúdos são fornecidos de forma informativa e educativa, tendo como objetivo auxiliar profissionais, estudantes e público em geral em estimativas técnicas.",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Uso adequado",
    content: [
      "O usuário compromete-se a utilizar o site de forma ética, legal e responsável, respeitando as leis brasileiras aplicáveis e os direitos de terceiros.",
      "É expressamente proibido: utilizar o site para fins ilícitos; tentar acessar áreas restritas; interferir no funcionamento da plataforma; realizar engenharia reversa; ou utilizar robôs, scrapers e ferramentas automatizadas de coleta sem autorização.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "4. Isenção de responsabilidade sobre cálculos",
    content: [
      "As calculadoras do Obra Métrica fornecem estimativas baseadas em fórmulas técnicas amplamente aceitas. Contudo, os resultados são meramente indicativos e não substituem a análise de um engenheiro, arquiteto ou profissional habilitado.",
      "O Obra Métrica não se responsabiliza por decisões técnicas, financeiras ou operacionais tomadas exclusivamente com base nos resultados das calculadoras. É responsabilidade do usuário validar os dados de entrada e confrontar os resultados com projetos oficiais.",
    ],
  },
  {
    icon: Ban,
    title: "5. Limitação de responsabilidade",
    content: [
      "O Obra Métrica não garante que o site estará disponível de forma ininterrupta ou livre de erros. Podem ocorrer interrupções para manutenção, atualizações ou por motivos alheios ao nosso controle.",
      "Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da impossibilidade de uso do site, das calculadoras ou dos conteúdos disponibilizados.",
    ],
  },
  {
    icon: Copyright,
    title: "6. Propriedade intelectual",
    content: [
      "Todo o conteúdo do Obra Métrica – incluindo textos, calculadoras, fórmulas, layout, marca, logotipo, imagens e código-fonte – é protegido por direitos autorais e demais leis de propriedade intelectual.",
      "É permitido o uso pessoal e não comercial dos conteúdos, com a devida citação da fonte. É vedada a reprodução, redistribuição, comercialização ou modificação sem autorização prévia e por escrito.",
    ],
  },
  {
    icon: Link2,
    title: "7. Links para sites de terceiros",
    content: [
      "O site pode conter links para páginas externas de parceiros, referências técnicas ou serviços do Google (Analytics, Tag Manager, AdSense e Search Console). Não nos responsabilizamos pelo conteúdo, políticas ou práticas de sites de terceiros.",
      "Recomendamos que o usuário leia os termos e políticas de privacidade de cada serviço acessado a partir do Obra Métrica.",
    ],
  },
  {
    icon: FileText,
    title: "8. Publicidade e conteúdo patrocinado",
    content: [
      "O Obra Métrica poderá exibir anúncios veiculados pelo Google AdSense e por outras redes de publicidade. Esses anúncios podem ser personalizados de acordo com o histórico de navegação do usuário.",
      "Não endossamos, garantimos ou nos responsabilizamos pelos produtos, serviços ou informações apresentados nos anúncios exibidos.",
    ],
  },
  {
    icon: RefreshCw,
    title: "9. Alterações nos termos",
    content: [
      "Estes Termos de Uso podem ser atualizados a qualquer momento, sem aviso prévio, para refletir mudanças legais, tecnológicas ou operacionais. A versão vigente estará sempre disponível nesta página.",
      "Recomenda-se que o usuário revise periodicamente este documento. O uso contínuo do site após alterações representa concordância com os novos termos.",
    ],
  },
  {
    icon: Scale,
    title: "10. Legislação aplicável e foro",
    content: [
      "Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, em especial pela Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018) e pelo Marco Civil da Internet (Lei nº 12.965/2014).",
      "Fica eleito o foro da comarca do domicílio do usuário para dirimir quaisquer controvérsias oriundas destes termos.",
    ],
  },
  {
    icon: Mail,
    title: "11. Contato",
    content: [
      "Em caso de dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso, entre em contato pelo e-mail:",
    ],
  },
];

function TermosDeUsoPage() {
  const updated = new Date().toLocaleDateString("pt-BR");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Documento legal
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Termos de Uso
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Última atualização: {updated}. Ao utilizar o Obra Métrica, você concorda com as condições
          descritas neste documento.
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
                  {s.title.startsWith("11.") && (
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
