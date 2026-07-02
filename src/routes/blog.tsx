import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdTop, AdMiddle, AdBottom } from "@/components/ads";
import { pageHead } from "@/lib/seo";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  categoryToSlug,
  formatDate,
} from "@/data/blog-posts";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";
import { useMemo } from "react";

const PATH = "/blog";
const PAGE_SIZE = 6;

type BlogSearch = {
  q: string;
  cat: string;
  page: number;
};

export const Route = createFileRoute("/blog")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const q = typeof search.q === "string" ? search.q.slice(0, 80) : "";
    const cat = typeof search.cat === "string" ? search.cat.slice(0, 40) : "";
    const rawPage = Number(search.page);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    return { q, cat, page };
  },
  head: () =>
    pageHead({
      title: "Blog ObraMétrica — Artigos sobre Construção e Energia Solar",
      description:
        "Artigos, dicas e tutoriais sobre construção civil, energia solar e conversores técnicos. Conteúdo prático para profissionais e entusiastas.",
      path: PATH,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Blog", path: PATH },
      ],
      schema: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blog ObraMétrica",
        url: `https://obrametrica.com.br${PATH}`,
        blogPost: BLOG_POSTS.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          url: `https://obrametrica.com.br/blog/${p.slug}`,
        })),
      },
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const { q, cat, page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const allSorted = useMemo(
    () => [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allSorted.filter((p) => {
      if (cat && categoryToSlug(p.category) !== cat) return false;
      if (term) {
        const hay = `${p.title} ${p.description} ${p.category}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [allSorted, q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const activeCategory = BLOG_CATEGORIES.find((c) => c.slug === cat);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Início", path: "/" },
            { name: "Blog", path: PATH },
          ]}
        />
        <header className="mt-6 max-w-3xl">
          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
            Conteúdo técnico
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Blog ObraMétrica
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Guias, tutoriais e referências práticas sobre construção civil, energia solar e
            conversores técnicos. Conteúdo focado em quem executa e decide.
          </p>
        </header>

        <AdTop />

        {/* Busca + filtros por categoria */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem("q") as HTMLInputElement;
              navigate({
                search: (prev: BlogSearch) => ({ ...prev, q: input.value, page: 1 }),
              });
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="blog-q" className="sr-only">
              Buscar no blog
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="blog-q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Buscar por título, tema ou palavra-chave"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Buscar
            </button>
            {(q || cat) && (
              <button
                type="button"
                onClick={() =>
                  navigate({ search: () => ({ q: "", cat: "", page: 1 }) })
                }
                className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-2 text-sm hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" aria-hidden /> Limpar
              </button>
            )}
          </form>

          <div className="flex flex-wrap gap-2">
            <CategoryChip active={!cat} label="Todas" to={{ cat: "", page: 1 }} />
            {BLOG_CATEGORIES.map((c) => (
              <CategoryChip
                key={c.slug}
                active={cat === c.slug}
                label={c.name}
                to={{ cat: c.slug, page: 1 }}
              />
            ))}
          </div>
        </div>

        {/* Cabeçalho de resultados */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {filtered.length === 0
              ? "Nenhum artigo encontrado."
              : `${filtered.length} artigo${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""}`}
            {activeCategory && ` em ${activeCategory.name}`}
            {q && ` para "${q}"`}
            .
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
            >
              <Link
                to="/blog/categoria/$categoria"
                params={{ categoria: categoryToSlug(post.category) }}
                className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15"
              >
                {post.category}
              </Link>
              <h2 className="mt-4 text-xl font-bold leading-snug text-foreground">
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">{post.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {post.readingTime} min de leitura
                </span>
              </div>
              <div className="mt-6 flex-1" />
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all"
              >
                Ler artigo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <nav
            aria-label="Paginação do blog"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <PageLink disabled={currentPage <= 1} to={{ page: currentPage - 1 }}>
              Anterior
            </PageLink>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PageLink key={n} active={n === currentPage} to={{ page: n }}>
                {n}
              </PageLink>
            ))}
            <PageLink
              disabled={currentPage >= totalPages}
              to={{ page: currentPage + 1 }}
            >
              Próxima
            </PageLink>
          </nav>
        )}

        <AdMiddle />
        <AdBottom />
      </section>
    </SiteLayout>
  );
}

function CategoryChip({
  active,
  label,
  to,
}: {
  active: boolean;
  label: string;
  to: Partial<BlogSearch>;
}) {
  return (
    <Link
      to="/blog"
      search={(prev: BlogSearch) => ({ ...prev, ...to })}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}

function PageLink({
  to,
  active,
  disabled,
  children,
}: {
  to: Partial<BlogSearch>;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground opacity-60">
        {children}
      </span>
    );
  }
  return (
    <Link
      to="/blog"
      search={(prev: BlogSearch) => ({ ...prev, ...to })}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}
