import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdTop, AdMiddle, AdBottom } from "@/components/ads";
import { pageHead } from "@/lib/seo";
import { BLOG_POSTS, formatDate } from "@/data/blog-posts";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const PATH = "/blog";

export const Route = createFileRoute("/blog")({
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
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
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
            Guias, tutoriais e referências práticas sobre construção civil,
            energia solar e conversores técnicos. Conteúdo focado em quem
            executa e decide.
          </p>
        </header>

        <AdTop />

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
              <p className="mt-3 text-sm text-muted-foreground">
                {post.description}
              </p>
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

        <AdMiddle />
        <AdBottom />
      </section>
    </SiteLayout>
  );
}
