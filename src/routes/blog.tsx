import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";
import { pageHead } from "@/lib/seo";

const PATH = "/blog";

export const Route = createFileRoute("/blog")({
  head: () => pageHead({
    title: "Blog ObraMétrica — Artigos sobre Construção e Energia Solar",
    description: "Artigos, dicas e tutoriais sobre construção civil, energia solar e engenharia para profissionais e entusiastas.",
    path: PATH,
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Blog", path: PATH },
    ],
  }),
  component: () => (
    <SiteLayout>
      <PagePlaceholder
        title="Blog"
        description="Artigos, dicas e tutoriais sobre construção civil, energia solar e engenharia."
      />
    </SiteLayout>
  ),
});
