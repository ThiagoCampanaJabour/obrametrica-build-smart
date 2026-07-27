import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";

import metodologiaMd from "../../content/metodologia.md?raw";
import densidadesMd from "../../content/metodologia/tabelas/densidades.md?raw";
import rendArgamassaMd from "../../content/metodologia/tabelas/rendimentos-argamassa.md?raw";
import rendConcretoMd from "../../content/metodologia/tabelas/rendimentos-concreto.md?raw";
import presetsSolarMd from "../../content/metodologia/tabelas/presets-modulos-e-inversores.md?raw";
import consumosBlocosMd from "../../content/metodologia/tabelas/consumos-blocos.md?raw";
import consumosTelhasMd from "../../content/metodologia/tabelas/consumos-telhas.md?raw";
import coefPerdaMd from "../../content/metodologia/tabelas/coeficientes-perda.md?raw";

const PATH = "/metodologia";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Metodologia", path: PATH },
];

const TITLE = "Metodologia — Como Calculamos | Obra Métrica";
const DESCRIPTION =
  "Fórmulas, presets e tabelas de referência usadas nas calculadoras da Obra Métrica: densidades, rendimentos, consumos e coeficientes de perda.";

export const Route = createFileRoute("/metodologia")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Metodologia da Obra Métrica",
        description: DESCRIPTION,
        url: `${SITE_URL}${PATH}`,
        author: { "@type": "Organization", name: "Obra Métrica" },
        publisher: { "@type": "Organization", name: "Obra Métrica" },
        inLanguage: "pt-BR",
      },
    }),
  component: MetodologiaPage,
});

/** Remove YAML frontmatter block from raw markdown. */
function stripFrontmatter(md: string): string {
  if (md.startsWith("---")) {
    const end = md.indexOf("\n---", 3);
    if (end !== -1) return md.slice(end + 4).replace(/^\s+/, "");
  }
  return md;
}

const TABLES: { id: string; title: string; body: string }[] = [
  { id: "densidades", title: "Densidades", body: stripFrontmatter(densidadesMd) },
  {
    id: "rendimentos-argamassa",
    title: "Rendimentos — Argamassa",
    body: stripFrontmatter(rendArgamassaMd),
  },
  {
    id: "rendimentos-concreto",
    title: "Rendimentos — Concreto",
    body: stripFrontmatter(rendConcretoMd),
  },
  {
    id: "presets-modulos-e-inversores",
    title: "Presets — Módulos e Inversores Solares",
    body: stripFrontmatter(presetsSolarMd),
  },
  {
    id: "consumos-blocos",
    title: "Consumos — Blocos e Tijolos",
    body: stripFrontmatter(consumosBlocosMd),
  },
  { id: "consumos-telhas", title: "Consumos — Telhas", body: stripFrontmatter(consumosTelhasMd) },
  {
    id: "coeficientes-perda",
    title: "Coeficientes de Perda",
    body: stripFrontmatter(coefPerdaMd),
  },
];

const MAIN_BODY = stripFrontmatter(metodologiaMd);

const proseClass =
  "prose prose-slate max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-table:text-sm prose-th:bg-muted prose-th:text-foreground prose-td:border-border prose-th:border-border";

function MetodologiaPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />

        <article className={`mt-6 ${proseClass}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{MAIN_BODY}</ReactMarkdown>
        </article>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Tabelas de referência
          </h2>
          <p className="mt-2 text-muted-foreground">
            Valores típicos usados como presets nas calculadoras. Todos podem ser ajustados
            conforme fabricante e projeto específico.
          </p>

          <nav aria-label="Índice de tabelas" className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {TABLES.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-primary hover:underline">
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-12">
            {TABLES.map((t) => (
              <section
                key={t.id}
                id={t.id}
                className="scroll-mt-24 rounded-lg border border-border bg-card p-6"
              >
                <div className={proseClass}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.body}</ReactMarkdown>
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
