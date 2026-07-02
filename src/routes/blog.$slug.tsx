import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdTop, AdMiddle, AdBottom } from "@/components/ads";
import { pageHead, SITE_URL } from "@/lib/seo";
import { BLOG_POSTS, getPostBySlug, formatDate, categoryToSlug, type BlogPost } from "@/data/blog-posts";
import { Calendar, Clock, ArrowRight, ArrowLeft, User, List } from "lucide-react";

function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return pageHead({
        title: "Artigo não encontrado — ObraMétrica",
        description: "O artigo solicitado não foi encontrado.",
        path: "/blog",
      });
    }
    const path = `/blog/${post.slug}`;
    return pageHead({
      title: `${post.title} — Blog ObraMétrica`,
      description: post.description,
      path,
      type: "article",
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path },
      ],
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: { "@type": "Organization", name: "ObraMétrica" },
        publisher: {
          "@type": "Organization",
          name: "ObraMétrica",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/obrametrica-logo.jpg` },
        },
        mainEntityOfPage: `${SITE_URL}${path}`,
      },
    });
  },
  notFoundComponent: () => (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-bold">Artigo não encontrado</h1>
        <p className="mt-4 text-muted-foreground">
          O artigo que você procura pode ter sido movido ou ainda não existe.
        </p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
        </Link>
      </section>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-bold">Erro ao carregar o artigo</h1>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Tentar novamente
        </button>
      </section>
    </SiteLayout>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, 3);

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />

        <header className="mt-6">
          <Link
            to="/blog/categoria/$categoria"
            params={{ categoria: categoryToSlug(post.category) }}
            className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15"
          >
            {post.category}
          </Link>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden />
              Equipe ObraMétrica
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readingTime} min de leitura
            </span>
          </div>
        </header>

        <AdTop />

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/90">
          {post.intro.map((p, i) => (
            <p key={`intro-${i}`}>{p}</p>
          ))}
        </div>

        {/* Sumário */}
        {post.sections.length > 1 && (
          <nav
            aria-label="Sumário do artigo"
            className="mt-8 rounded-2xl border border-border bg-muted/40 p-5"
          >
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <List className="h-4 w-4" aria-hidden />
              Neste artigo
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/90 marker:text-primary">
              {post.sections.map((sec) => {
                const id = slugifyHeading(sec.heading);
                return (
                  <li key={id}>
                    <a href={`#${id}`} className="hover:text-primary">
                      {sec.heading}
                    </a>
                  </li>
                );
              })}
              <li>
                <a href="#faq" className="hover:text-primary">
                  Perguntas frequentes
                </a>
              </li>
              <li>
                <a href="#conclusao" className="hover:text-primary">
                  Conclusão
                </a>
              </li>
            </ol>
          </nav>
        )}

        <AdMiddle />

        {post.sections.map((sec, idx) => {
          const id = slugifyHeading(sec.heading);
          return (
            <section key={idx} id={id} className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                <a href={`#${id}`} className="hover:text-primary">
                  {sec.heading}
                </a>
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
                {sec.paragraphs.map((p, i) => (
                  <p key={`s${idx}-p${i}`}>{p}</p>
                ))}
              </div>
            </section>
          );
        })}

        <section id="faq" className="mt-12 scroll-mt-24 rounded-2xl border border-border bg-muted/40 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Perguntas frequentes
          </h2>
          <dl className="mt-6 space-y-5">
            {post.faq.map((f, i) => (
              <div key={i}>
                <dt className="font-semibold text-foreground">{f.question}</dt>
                <dd className="mt-1 text-foreground/85">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Conclusão</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
            {post.conclusion.map((p, i) => (
              <p key={`c-${i}`}>{p}</p>
            ))}
          </div>
        </section>

        <AdBottom />

        {post.relatedTool && (
          <aside className="mt-10 flex flex-col gap-3 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider opacity-80">Ferramenta relacionada</p>
              <p className="mt-1 text-lg font-semibold">{post.relatedTool.label}</p>
            </div>
            <a
              href={post.relatedTool.path}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground hover:opacity-90"
            >
              Acessar <ArrowRight className="h-4 w-4" />
            </a>
          </aside>
        )}

        {/* FAQ schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />

        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Continue lendo</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition"
                >
                  <p className="text-xs font-semibold text-primary">{r.category}</p>
                  <p className="mt-2 font-semibold leading-snug text-foreground">{r.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
}
