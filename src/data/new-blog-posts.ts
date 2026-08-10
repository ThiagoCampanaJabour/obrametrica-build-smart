import { BlogPost } from "./blog-posts";

export const NEW_BLOG_POSTS: BlogPost[] = [
  {
    slug: "pv-vs-rede-orcamento-domestico",
    title: "PV vs Rede: Como calcular economia, payback e LCOE para sua casa",
    description: "Guia completo para entender o retorno financeiro da energia solar fotovoltaica comparada à energia da rede elétrica tradicional.",
    category: "Energia Solar",
    date: "2026-08-10",
    readingTime: 8,
    intro: [
      "Decidir pela instalação de um sistema de energia solar fotovoltaica (PV) envolve mais do que apenas entender a tecnologia; é uma decisão financeira estratégica.",
      "Neste artigo, detalhamos como calcular a economia real, o tempo de retorno (payback) e o custo nivelado da energia (LCOE)."
    ],
    sections: [
      {
        heading: "O que é LCOE e Payback Simplificado?",
        paragraphs: [
          "O Payback Simples é o tempo necessário para que a economia gerada pelo sistema solar pague o investimento inicial (CAPEX). Fórmula: Investimento Total / Economia Líquida Anual.",
          "O LCOE (Levelized Cost of Energy) representa o custo médio por kWh de energia gerada pelo sistema ao longo de sua vida útil (geralmente 25 anos)."
        ]
      },
      {
        heading: "Entendendo o Overlap Factor e Specific Yield",
        paragraphs: [
          "O Overlap Factor (Fator de Simultaneidade) refere-se à porcentagem da energia gerada que é consumida instantaneamente pela casa. No setor residencial, varia entre 30% a 50%.",
          "O Specific Yield (Fator de Produção) é quanto cada kWp instalado produz de energia (kWh) em um ano no seu local. No Brasil, varia de 1.200 a 1.900 kWh/kWp/ano."
        ]
      }
    ],
    faq: [
      {
        question: "Quanto de economia posso esperar?",
        answer: "Depende da sua tarifa local e do seu perfil de consumo (overlap), mas sistemas bem projetados podem reduzir a conta em até 90%."
      }
    ],
    conclusion: [
      "Este simulador oferece uma visão orientativa baseada em premissas simplificadas. Para uma análise profunda, consulte um especialista."
    ],
    relatedTool: { label: "Orçamento & Simulador Solar", path: "/ferramentas/orcamento-domestico" }
  }
];
