import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Este arquivo simula a carga de metadados JSON-LD para os artigos do blog
// Em um sistema real, isso poderia vir de um CMS ou banco de dados.

export const getArticleJsonLd = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { slug } = data;
    
    // Mapeamento básico para os novos artigos
    const articles: Record<string, any> = {
      "conversor-kw-kwh-guia-completo": {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Conversor kW ↔ kWh: Guia Completo para Energia Solar",
        "description": "Aprenda a converter kWp em kWh de forma precisa com presets por cidade.",
        "author": { "@type": "Person", "name": "Thiago O. M." },
        "publisher": { "@type": "Organization", "name": "Obra Métrica" }
      },
      "perda-atrito-tubulacoes-guia-tecnico": {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Perda por Atrito em Tubulações: Guia Técnico",
        "description": "Guia completo sobre fórmulas de Darcy-Weisbach e Hazen-Williams.",
        "author": { "@type": "Organization", "name": "Equipe Técnica Obra Métrica" },
        "publisher": { "@type": "Organization", "name": "Obra Métrica" }
      }
    };

    return articles[slug] || null;
  });
