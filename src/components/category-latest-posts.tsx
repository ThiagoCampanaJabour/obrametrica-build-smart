import { Link } from "@tanstack/react-router";
import { BookText } from "lucide-react";
import { getSiloBySlug, getLatestPostsByCategoryName, type SiloCategorySlug } from "@/data/silo";
import { formatDate } from "@/data/blog-posts";

/**
 * Bloco SILO reutilizável nas páginas de categoria de calculadora
 * (/construcao-civil, /energia-solar, /conversores).
 *
 * Exibe os artigos mais recentes do blog na mesma categoria e um link
 * para a página de categoria do blog, fortalecendo a estrutura de
 * links internos entre ferramentas e conteúdo editorial.
 */
export function CategoryLatestPosts({ slug }: { slug: SiloCategorySlug }) {
  const silo = getSiloBySlug(slug);
  if (!silo) return null;
  const posts = getLatestPostsByCategoryName(silo.name, 3);
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <BookText className="h-5 w-5 text-foreground" aria-hidden />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Artigos do blog sobre {silo.name}
        </h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Guias práticos e tutoriais para tirar o máximo proveito das ferramentas.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="flex h-full flex-col rounded-xl border border-border bg-background p-4 transition hover:border-accent hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {post.category}
              </span>
              <p className="mt-2 text-base font-semibold leading-snug text-foreground">
                {post.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
              <span className="mt-3 text-xs text-muted-foreground">
                {formatDate(post.date)} · {post.readingTime} min
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-sm">
        <Link
          to="/blog/categoria/$categoria"
          params={{ categoria: slug }}
          className="font-semibold text-primary hover:underline"
        >
          Ver todos os artigos de {silo.name} →
        </Link>
      </div>
    </section>
  );
}
