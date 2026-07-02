import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const PATH = "/faq";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Perguntas Frequentes", path: PATH },
];

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "O que é o Obra Métrica?",
    a: "O Obra Métrica é uma plataforma brasileira de calculadoras técnicas gratuitas voltadas para construção civil, energia solar e conversores de unidades. Nosso objetivo é oferecer estimativas rápidas, precisas e confiáveis para profissionais, estudantes e público em geral.",
  },
  {
    q: "As calculadoras são gratuitas?",
    a: "Sim. Todas as calculadoras do Obra Métrica são gratuitas e podem ser utilizadas sem cadastro. O site é sustentado por publicidade responsável, como o Google AdSense.",
  },
  {
    q: "Os resultados das calculadoras são precisos?",
    a: "As calculadoras utilizam fórmulas técnicas amplamente aceitas e coeficientes padrão de mercado. Os resultados são estimativas confiáveis, mas podem variar conforme condições reais de obra, materiais e boas práticas locais. Para projetos oficiais, recomendamos validação por um profissional habilitado.",
  },
  {
    q: "Preciso criar uma conta para usar o site?",
    a: "Não. O Obra Métrica pode ser utilizado de forma anônima, sem necessidade de cadastro, login ou fornecimento de dados pessoais.",
  },
  {
    q: "Como funciona a Calculadora de Tijolos?",
    a: "Você informa as dimensões da parede (comprimento e altura), o tipo de tijolo e a espessura da junta. A calculadora estima a quantidade total de tijolos necessária, considerando uma margem de perdas.",
  },
  {
    q: "Como funciona a Calculadora de Concreto?",
    a: "Basta informar as dimensões da peça a ser concretada (comprimento, largura e espessura). A calculadora retorna o volume total de concreto em metros cúbicos, com opção de acréscimo para perdas.",
  },
  {
    q: "Como funciona a calculadora de placas solares?",
    a: "Você informa o consumo médio mensal (em kWh) e a região do país. A calculadora estima o número de placas solares necessário para atender o consumo, considerando a potência típica dos módulos e a irradiação solar da região.",
  },
  {
    q: "Posso utilizar os resultados em projetos oficiais?",
    a: "Os resultados são indicativos e não substituem laudos, memoriais de cálculo ou responsabilidade técnica formal (ART/RRT). Para projetos oficiais, recomendamos validação por engenheiro ou arquiteto habilitado.",
  },
  {
    q: "O Obra Métrica coleta meus dados pessoais?",
    a: "Utilizamos cookies e ferramentas como Google Analytics e Google AdSense para melhorar a experiência e exibir anúncios relevantes. Não coletamos dados pessoais identificáveis sem seu consentimento. Consulte a Política de Privacidade para detalhes.",
  },
  {
    q: "Como posso sugerir uma nova calculadora?",
    a: "Adoramos receber sugestões. Envie sua ideia pelo formulário de contato ou pelo e-mail obrametricasite@gmail.com. Avaliamos todas as sugestões para incluir novas ferramentas na plataforma.",
  },
  {
    q: "Encontrei um erro em uma calculadora. O que faço?",
    a: "Entre em contato imediatamente pelo e-mail obrametricasite@gmail.com informando a calculadora, os valores utilizados e o resultado esperado. Nossa equipe verifica e corrige eventuais inconsistências.",
  },
  {
    q: "O site funciona em celulares e tablets?",
    a: "Sim. O Obra Métrica é totalmente responsivo e foi otimizado para funcionar perfeitamente em smartphones, tablets e computadores.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () =>
    pageHead({
      title: "Perguntas Frequentes (FAQ) | Obra Métrica",
      description:
        "Tire suas dúvidas sobre as calculadoras do Obra Métrica: como funcionam, precisão dos resultados, uso profissional, privacidade e sugestões.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        url: `${SITE_URL}${PATH}`,
        inLanguage: "pt-BR",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Central de ajuda
        </span>
        <div className="mt-4 flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-foreground" aria-hidden />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Perguntas Frequentes
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Reunimos as dúvidas mais comuns sobre o Obra Métrica, as calculadoras, privacidade e o uso
          profissional dos resultados.
        </p>

        <div className="mt-10 rounded-xl border border-border bg-card p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
          <h2 className="text-xl font-bold">Não encontrou sua resposta?</h2>
          <p className="mt-2 text-primary-foreground/90">
            Fale com a equipe do Obra Métrica pelo formulário de contato ou pelo e-mail{" "}
            <a
              href="mailto:obrametricasite@gmail.com"
              className="underline hover:text-accent"
            >
              obrametricasite@gmail.com
            </a>
            .
          </p>
          <Link
            to="/contato"
            className="mt-4 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Ir para o contato
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
