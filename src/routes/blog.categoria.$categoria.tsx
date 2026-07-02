import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdTop, AdBottom } from "@/components/ads";
import { pageHead, SITE_URL } from "@/lib/seo";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getPostsByCategorySlug,
  formatDate,
  type BlogCategory,
  type BlogPost,
} from "@/data/blog-posts";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/categoria/$categoria")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.categoria);
    if (!category) throw notFound();
    const posts = getPostsByCategorySlug(params.categoria);
    return { category, posts };
  },
  head: ({ params, loaderData }) => {
    const cat = loaderData?.category;
    const title = cat
      ? `${cat.name} — Artigos do Blog ObraMétrica`
      : "Categoria — Blog ObraMétrica";
    const description = cat
      ? `${cat.description} Artigos e guias da categoria ${cat.name} no blog ObraMétrica.`
      : "Categoria de artigos do blog ObraMétrica.";
    const path = `/blog/categoria/${params.categoria}`;
    return pageHead({
      title,
      description,
      path,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: cat?.name ?? "Categoria", path },
      ],
      schema: cat
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${cat.name} — Blog ObraMétrica`,
            description: cat.description,
            url: `${SITE_URL}${path}`,
          }
        : undefined,
    });
  },
  notFoundComponent: () => (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-bold">Categoria não encontrada</h1>
        <p className="mt-4 text-muted-foreground">
          A categoria que você procura não existe. Veja abaixo as categorias disponíveis.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {BLOG_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/blog/categoria/$categoria"
              params={{ categoria: c.slug }}
              className="rounded-full border border-border bg-background px-3 py-1 text-sm hover:bg-muted"
            >
              {c.name}
            </Link>
          ))}
        </div>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 text-primary font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
        </Link>
      </section>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-bold">Erro ao carregar a categoria</h1>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Tentar novamente
        </button>
      </section>
    </SiteLayout>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, posts } = Route.useLoaderData() as {
    category: BlogCategory;
    posts: BlogPost[];
  };
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: category.name, path: `/blog/categoria/${category.slug}` },
          ]}
        />
        <header className="mt-6 max-w-3xl">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Categoria
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{category.description}</p>
        </header>

        <AdTop />

        {sorted.length === 0 ? (
          <p className="mt-8 text-muted-foreground">
            Ainda não há artigos publicados nesta categoria.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
                <h2 className="mt-4 text-xl font-bold leading-snug text-foreground">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="hover:text-primary"
                  >
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
        )}

        <div className="mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Ver todas as categorias
          </Link>
        </div>

        <AdBottom />
      </section>
    </SiteLayout>
  );
}
