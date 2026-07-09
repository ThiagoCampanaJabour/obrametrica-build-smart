/**
 * Mapa de links internos (SILO) entre calculadoras e artigos do blog.
 *
 * Cada calculadora pertence a uma das categorias do site, que também
 * corresponde a uma categoria de blog. Isso permite gerar cross-links
 * consistentes: calculadora → artigos relacionados; artigo → calculadoras
 * relacionadas; página de categoria → últimas publicações; página de
 * categoria do blog → ferramentas relacionadas.
 */

import { BLOG_POSTS, type BlogPost } from "./blog-posts";

export type SiloCategorySlug = "construcao-civil" | "energia-solar" | "conversores";

export interface CalcRef {
  path: string;
  label: string;
}

export interface SiloCategory {
  slug: SiloCategorySlug;
  /** Nome exibido e usado como chave em blog-posts. */
  name: string;
  /** Rota da página de categoria de calculadoras. */
  path: string;
  /** Rota da página de categoria do blog. */
  blogPath: string;
  calculators: CalcRef[];
}

export const SILO_CATEGORIES: SiloCategory[] = [
  {
    slug: "construcao-civil",
    name: "Construção Civil",
    path: "/construcao-civil",
    blogPath: "/blog/categoria/construcao-civil",
    calculators: [
      { path: "/calculadora-de-tijolos", label: "Calculadora de Tijolos" },
      { path: "/calculadora-de-concreto", label: "Calculadora de Concreto" },
      { path: "/calculadora-de-piso", label: "Calculadora de Piso" },
      { path: "/calculadora-de-tinta", label: "Calculadora de Tinta" },
      { path: "/calculadora-de-argamassa", label: "Calculadora de Argamassa" },
      { path: "Calculadora de Cimento", label: "/calculadora-de-cimento" },
    ],
  },
  {
    slug: "energia-solar",
    name: "Energia Solar",
    path: "/energia-solar",
    blogPath: "/blog/categoria/energia-solar",
    calculators: [
      { path: "/quantas-placas-solares-preciso", label: "Quantas Placas Solares Preciso" },
      { path: "/economia-energia-solar", label: "Economia com Energia Solar" },
    ],
  },
  {
    slug: "conversores",
    name: "Conversores",
    path: "/conversores",
    blogPath: "/blog/categoria/conversores",
    calculators: [
      { path: "/conversor-m2-para-hectare", label: "Conversor m² para hectare" },
      { path: "/conversor-cm-para-polegada", label: "Conversor cm para polegada" },
      { path: "/conversor-litros-para-m3", label: "Conversor litros para m³" },
    ],
  },
];

/** Retorna a categoria SILO para uma dada calculadora (por path). */
export function getSiloForCalc(path: string): SiloCategory | undefined {
  return SILO_CATEGORIES.find((c) =>
    c.calculators.some((k) => k.path === path),
  );
}

/** Retorna a categoria SILO pelo nome (compatível com blog-posts.category). */
export function getSiloByName(name: string): SiloCategory | undefined {
  return SILO_CATEGORIES.find((c) => c.name === name);
}

/** Retorna a categoria SILO pelo slug. */
export function getSiloBySlug(slug: string): SiloCategory | undefined {
  return SILO_CATEGORIES.find((c) => c.slug === slug);
}

/** Últimos artigos do blog para uma categoria (default: 3). */
export function getLatestPostsByCategoryName(
  name: string,
  limit = 3,
): BlogPost[] {
  return [...BLOG_POSTS]
    .filter((p) => p.category === name)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}
