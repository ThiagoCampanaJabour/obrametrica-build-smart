/**
 * Componentes auxiliares para páginas de calculadora:
 * - ResultActions: botões imprimir / compartilhar / copiar resultado
 * - CalcExtras: renderiza introdução, como funciona, fórmula, exemplo,
 *   dicas, erros comuns, tabela de referência, FAQ e calculadoras
 *   relacionadas com base no registro central em `@/data/calculators`.
 *
 * Uso: passe `extrasId={PATH}` para CalculatorShell / UnitConverter.
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Printer,
  Share2,
  Copy,
  Check,
  BookOpen,
  Calculator,
  Lightbulb,
  AlertTriangle,
  Table as TableIcon,
  HelpCircle,
  Layers,
  Sigma,
  BookText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCalculator } from "@/data/calculators";
import { getSiloForCalc, getLatestPostsByCategoryName } from "@/data/silo";
import { formatDate } from "@/data/blog-posts";

/**
 * Botões de ação exibidos junto ao resultado da calculadora.
 * Todos usam APIs padrão do navegador e degradam graciosamente.
 */
export function ResultActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently ignore clipboard errors */
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const shareData = { title: document.title, text, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled — fallback below */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }
  };

  const btn =
    "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="mt-4 flex flex-wrap gap-2 print:hidden" aria-label="Ações do resultado">
      <button type="button" onClick={handleCopy} className={btn} aria-label="Copiar resultado">
        {copied ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
        {copied ? "Copiado" : "Copiar resultado"}
      </button>
      <button type="button" onClick={handleShare} className={btn} aria-label="Compartilhar">
        <Share2 className="h-4 w-4" aria-hidden />
        Compartilhar
      </button>
      <button type="button" onClick={handlePrint} className={btn} aria-label="Imprimir">
        <Printer className="h-4 w-4" aria-hidden />
        Imprimir
      </button>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-foreground" aria-hidden />
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="mt-4 text-muted-foreground">{children}</div>
    </section>
  );
}

/**
 * Renderiza todo o conteúdo enriquecido de uma calculadora com base no
 * registro central. Retorna null se o path não estiver cadastrado, o
 * que garante segurança em rotas ainda não migradas.
 */
export function CalcExtras({ id }: { id: string }) {
  const c = getCalculator(id);
  if (!c) return null;

  return (
    <div className="mx-auto mt-8 max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8 print:hidden">
      <Section icon={BookOpen} title="Introdução">
        <p className="leading-relaxed">{c.intro}</p>
        {c.context?.map((p, i) => (
          <p key={i} className="mt-3 leading-relaxed">
            {p}
          </p>
        ))}
      </Section>

      {c.whenToUse && c.whenToUse.length > 0 && (
        <Section icon={Lightbulb} title="Quando usar">
          <ul className="list-disc space-y-2 pl-5">
            {c.whenToUse.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section icon={Calculator} title="Como funciona">
        <ol className="list-decimal space-y-2 pl-5">
          {c.howItWorks.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Section>

      <Section icon={Sigma} title="Fórmula utilizada">
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-base font-semibold text-foreground">{c.formula.expression}</p>
        </div>
        {c.formula.legend && c.formula.legend.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {c.formula.legend.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={Layers} title="Exemplos práticos">
        <p className="font-medium text-foreground">{c.example.scenario}</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          {c.example.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p className="mt-4 rounded-md border border-accent/40 bg-accent/10 p-3 text-foreground">
          <strong>Resultado:</strong> {c.example.result}
        </p>
        {c.moreExamples?.map((ex, i) => (
          <div key={i} className="mt-6 border-t border-border pt-4">
            <p className="font-medium text-foreground">{ex.scenario}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {ex.steps.map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ol>
            <p className="mt-4 rounded-md border border-accent/40 bg-accent/10 p-3 text-foreground">
              <strong>Resultado:</strong> {ex.result}
            </p>
          </div>
        ))}
      </Section>

      <Section icon={Lightbulb} title="Dicas">
        <ul className="list-disc space-y-2 pl-5">
          {c.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section icon={AlertTriangle} title="Erros comuns">
        <ul className="list-disc space-y-2 pl-5">
          {c.errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </Section>

      {c.table && (
        <Section icon={TableIcon} title="Tabela de referência">
          {c.table.caption && (
            <p className="mb-3 text-sm text-muted-foreground">{c.table.caption}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  {c.table.headers.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-3 py-2 text-left font-semibold text-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section icon={HelpCircle} title="Perguntas frequentes">
        <Accordion type="single" collapsible className="w-full">
          {c.faq.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {c.related.length > 0 && (
        <Section icon={Calculator} title="Calculadoras relacionadas">
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.related.map((r) => (
              <li key={r.path}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={r.path as any}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent/10"
                >
                  <span>{r.label}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <SiloArticlesForCalc path={c.path} />
    </div>
  );
}

/**
 * Bloco SILO: lista os últimos artigos do blog na mesma categoria da
 * calculadora, com link para a categoria completa do blog. Fortalece
 * o interlink calculadora → conteúdo → categoria.
 */
function SiloArticlesForCalc({ path }: { path: string }) {
  const silo = getSiloForCalc(path);
  if (!silo) return null;
  const posts = getLatestPostsByCategoryName(silo.name, 3);
  if (posts.length === 0) return null;

  return (
    <Section icon={BookText} title="Artigos relacionados no blog">
      <ul className="grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="flex h-full flex-col rounded-lg border border-border bg-background p-3 text-sm transition-colors hover:border-accent hover:bg-accent/10"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {post.category}
              </span>
              <span className="mt-1 font-medium leading-snug text-foreground">{post.title}</span>
              <span className="mt-2 text-xs text-muted-foreground">
                {formatDate(post.date)} · {post.readingTime} min
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm">
        <Link
          to="/blog/categoria/$categoria"
          params={{ categoria: silo.slug }}
          className="font-semibold text-primary hover:underline"
        >
          Ver todos os artigos de {silo.name} →
        </Link>
      </div>
    </Section>
  );
}
