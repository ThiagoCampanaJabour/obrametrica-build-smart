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
        heading: "Conceitos chave",
        paragraphs: [
          "kWp: potência instalada (quilowatt-pico). kWh: energia (quilowatt-hora). Specific yield / factor_kwh_per_kwp_year: kWh gerados por kWp por ano.",
          "Overlap factor: fração da geração usada no local (onsite) vs exportada. Payback simples: CAPEX / economia anual. LCOE simplificado: (annualized CAPEX + OPEX) / produção anual."
        ]
      },
      {
        heading: "O que é LCOE e Payback Simplificado?",
        paragraphs: [
          "O Payback Simples é o tempo necessário para que a economia gerada pelo sistema solar pague o investimento inicial (CAPEX). Fórmula: Investimento Total / Economia Líquida Anual.",
          "O LCOE (Levelized Cost of Energy) representa o custo médio por kWh de energia gerada pelo sistema ao longo de sua vida útil (geralmente 25 anos)."
        ]
      },
      {
        heading: "Fórmulas básicas",
        paragraphs: [
          "Produção anual (kWh) = kWp × factor_kwh_per_kwp_year × (1 − perdas_frac). Energia usada on-site = produção × overlap_factor.",
          "Economia anual = (usada_on_site × tarifa) + (exportada × credit_rate) − OPEX_annual."
        ]
      }
    ],
    faq: [
      {
        question: "Quanto de economia posso esperar?",
        answer: "Depende da sua tarifa local e do seu perfil de consumo (overlap), mas sistemas bem projetados podem reduzir a conta em até 90%."
      },
      {
        question: "O que é o Overlap Factor?",
        answer: "É a fração da energia gerada consumida instantaneamente no local. Padrões típicos são 45% para residências e 70% para comércios."
      }
    ],
    conclusion: [
      "Este simulador oferece uma visão orientativa baseada em premissas simplificadas. Para uma análise profunda, consulte um especialista.",
      "O uso de ferramentas técnicas como esta no ObraMétrica ajuda a mitigar riscos e maximizar o retorno do seu investimento sustentável."
    ],
    relatedTool: { label: "Orçamento & Simulador Solar", path: "/ferramentas/orcamento-domestico" }
  }
];
