import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { BLOG_POSTS } from "@/data/blog-posts";

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const LASTMOD = new Date().toISOString().slice(0, 10);

const ENTRIES: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/construcao-civil", changefreq: "weekly", priority: "0.9" },
  { path: "/energia-solar", changefreq: "weekly", priority: "0.9" },
  { path: "/conversores", changefreq: "weekly", priority: "0.9" },
  { path: "/calculadora-de-tijolos", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-concreto", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-piso", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-tinta", changefreq: "monthly", priority: "0.8" },
  { path: "/calculadora-de-argamassa", changefreq: "monthly", priority: "0.8" },
  { path: "/quantas-placas-solares-preciso", changefreq: "monthly", priority: "0.8" },
  { path: "/economia-energia-solar", changefreq: "monthly", priority: "0.8" },
  { path: "/conversor-m2-para-hectare", changefreq: "monthly", priority: "0.7" },
  { path: "/conversor-cm-para-polegada", changefreq: "monthly", priority: "0.7" },
  { path: "/conversor-litros-para-m3", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  ...BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly" as const,
    priority: "0.7",
  })),
  { path: "/sobre", changefreq: "yearly", priority: "0.4" },
  { path: "/contato", changefreq: "yearly", priority: "0.4" },
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
            `    <lastmod>${e.lastmod ?? LASTMOD}</lastmod>`,
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
