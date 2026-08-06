import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/data/blog-posts";

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const ENTRIES: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/construcao-civil", changefreq: "weekly", priority: "0.9" },
  { path: "/energia-solar", changefreq: "weekly", priority: "0.9" },
  { path: "/conversores", changefreq: "weekly", priority: "0.9" },
  { path: "/metodologia", changefreq: "monthly", priority: "0.7" },
  { path: "/calculadora-de-telhas", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-blocos", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-tijolos", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-reboco", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-aco", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-forma", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-concreto", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-cimento", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-areia", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-brita", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-piso", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-tinta", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-argamassa", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-tubos", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-esquadrias", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-rejunte", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-ar-condicionado", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/orcamento-por-etapa", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/calculadora-mao-obra", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/fundacao-sapata", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/calculadora-lajes", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/dimensionamento-eletrico", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/drenagem-calhas", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/hvac-perdas", changefreq: "monthly", priority: "0.8" },
  { path: "/construcao-civil/andaimes-escoras", changefreq: "monthly", priority: "0.8" },
  {
    path: "/construcao-civil/estruturas-metalicas-basicas",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/construcao-civil/simulador-iluminacao-fachadas",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/construcao-civil/quantificacao-telhas-pecas",
    changefreq: "monthly",
    priority: "0.8",
  },
  { path: "/quantas-placas-solares-preciso", changefreq: "monthly", priority: "0.8" },
  { path: "/simulador-solar-avancado", changefreq: "monthly", priority: "0.8" },
  { path: "/energia-solar/calculadora-payback", changefreq: "monthly", priority: "0.8" },
  { path: "/energia-solar/comparador-sistemas", changefreq: "monthly", priority: "0.8" },
  { path: "/energia-solar/calculadora-inversor", changefreq: "monthly", priority: "0.8" },
  { path: "/energia-solar/calculadora-bateria", changefreq: "monthly", priority: "0.8" },
  { path: "/energia-solar/simulacao-radiacao", changefreq: "monthly", priority: "0.8" },
  { path: "/economia-energia-solar", changefreq: "monthly", priority: "0.8" },
  { path: "/conversor-m2-para-hectare", changefreq: "monthly", priority: "0.7" },
  { path: "/conversor-cm-para-polegada", changefreq: "monthly", priority: "0.7" },
  { path: "/conversor-litros-para-m3", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  ...BLOG_CATEGORIES.map((c) => ({
    path: `/blog/categoria/${c.slug}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
  ...BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly" as const,
    priority: "0.7",
  })),
  { path: "/sobre", changefreq: "yearly", priority: "0.4" },
  { path: "/contato", changefreq: "yearly", priority: "0.4" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
  { path: "/politica-de-cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/termos-de-uso", changefreq: "yearly", priority: "0.3" },
  { path: "/aviso-legal", changefreq: "yearly", priority: "0.3" },
];


export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const esc = (s: string) =>
          s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        const urls = ENTRIES.map((e) =>
          [
            `  <url>`,
            `    <loc>${esc(SITE_URL)}${esc(e.path)}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
