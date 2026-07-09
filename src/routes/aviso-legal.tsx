import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  AlertTriangle,
  FileText,
  ShieldAlert,
  Calculator,
  Scale,
  Copyright,
  Link2,
  Mail,
} from "lucide-react";

const PATH = "/aviso-legal";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Aviso Legal", path: PATH },
];
const EMAIL = "obrametricasite@gmail.com";

export const Route = createFileRoute("/aviso-legal")({
  head: () =>
    pageHead({
      title: "Aviso Legal | Obra Métrica",
      description:
        "Aviso legal do Obra Métrica: informações sobre a natureza técnica das calculadoras, limites de responsabilidade e uso adequado dos conteúdos.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Aviso Legal | Obra Métrica",
        url: `${SITE_URL}${PATH}`,
        inLanguage: "pt-BR",
      },
    }),
  component: AvisoLegalPage,
});

const sections = [
  {
    icon: FileText,
    title: "1. Identificação",
    content: [
      "Este site é operado pelo Obra Métrica, disponível no endereço obrametrica.com.br, com contato oficial pelo e-mail obrametricasite@gmail.com.",
      "Todo o conteúdo publicado tem finalidade informativa e técnica, voltado principalmente para profissionais e estudantes das áreas de construção civil, arquitetura, engenharia e energia solar.",
    ],
  },
  {
    icon: Calculator,
    title: "2. Natureza das calculadoras",
    content: [
      "As calculadoras disponíveis no Obra Métrica utilizam fórmulas e coeficientes técnicos consolidados no mercado. Elas oferecem estimativas rápidas que auxiliam no dimensionamento de materiais, cargas, áreas, conversões e sistemas fotovoltaicos.",
      "Os resultados apresentados são aproximados e podem variar de acordo com condições reais de projeto, materiais utilizados, condições ambientais e boas práticas construtivas locais.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "3. Limitação de responsabilidade",
    content: [
      "O Obra Métrica não substitui a atuação de profissionais habilitados (engenheiros, arquitetos, técnicos ou responsáveis técnicos) e não emite laudos, memoriais de cálculo ou pareceres técnicos formais.",
      "Não nos responsabilizamos por prejuízos, danos materiais, financeiros ou de qualquer natureza decorrentes de decisões tomadas exclusivamente com base nos resultados obtidos por meio das calculadoras deste site.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "4. Uso por profissionais",
    content: [
      "Recomendamos que engenheiros, arquitetos e demais profissionais utilizem as calculadoras apenas como apoio à sua rotina técnica, validando os resultados de acordo com normas técnicas vigentes (ABNT), memoriais de cálculo próprios e responsabilidade técnica formal (ART/RRT).",
    ],
  },
  {
    icon: Copyright,
    title: "5. Propriedade intelectual",
    content: [
      "Os textos, calculadoras, layout, marca, logotipo e código-fonte do Obra Métrica são protegidos por direitos autorais. É proibida a reprodução total ou parcial sem autorização prévia por escrito, exceto para uso pessoal e não comercial, com citação da fonte.",
    ],
  },
  {
    icon: Link2,
    title: "6. Links externos e publicidade",
    content: [
      "O Obra Métrica pode exibir anúncios veiculados pelo Google AdSense e conter links para sites de terceiros. Não temos controle sobre o conteúdo, políticas de privacidade ou práticas dessas páginas externas e não nos responsabilizamos por elas.",
      "A presença de anúncios ou links não representa endosso, recomendação ou associação comercial, salvo quando expressamente indicado.",
    ],
  },
  {
    icon: Scale,
    title: "7. Legislação aplicável",
    content: [
      "Este aviso legal é regido pelas leis da República Federativa do Brasil, em especial pela Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018), pelo Marco Civil da Internet (Lei nº 12.965/2014) e pelo Código de Defesa do Consumidor, quando aplicável.",
    ],
  },
  {
    icon: Mail,
    title: "8. Contato",
    content: [
      "Para dúvidas jurídicas, solicitações de remoção de conteúdo ou notificações formais, entre em contato pelo e-mail:",
    ],
  },
];

function AvisoLegalPage() {
  const updated = new Date().toLocaleDateString("pt-BR");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Documento legal
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Aviso Legal
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Última atualização: {updated}. Este aviso esclarece o caráter técnico-informativo das
          calculadoras e conteúdos publicados no Obra Métrica.
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
                  {s.title.startsWith("8.") && (
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
