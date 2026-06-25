// Central SEO config and helpers.
export const SITE_URL = "https://obrametrica.com.br";
export const SITE_NAME = "ObraMétrica";
export const SITE_DESCRIPTION =
  "Cálculos inteligentes para construir melhor. Calculadoras para construção civil, energia solar e conversores técnicos.";
export const SITE_LOGO = "/obrametrica-logo.jpg";

export type Crumb = { name: string; path: string };

type HeadScript = { type: string; children: string };
type HeadMeta = Record<string, string>;
type HeadLink = { rel: string; href: string; type?: string };

export function pageHead(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  breadcrumbs?: Crumb[];
  schema?: Record<string, unknown>;
}): { meta: HeadMeta[]; links: HeadLink[]; scripts: HeadScript[] } {
  const url = `${SITE_URL}${opts.path}`;
  const rawImage = opts.image ?? SITE_LOGO;
  const image = rawImage.startsWith("http") ? rawImage : `${SITE_URL}${rawImage}`;

  const meta: HeadMeta[] = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
  ];

  const links: HeadLink[] = [{ rel: "canonical", href: url }];

  const scripts: HeadScript[] = [];
  if (opts.breadcrumbs && opts.breadcrumbs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: opts.breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      }),
    });
  }
  if (opts.schema) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(opts.schema),
    });
  }
  return { meta, links, scripts };
}
