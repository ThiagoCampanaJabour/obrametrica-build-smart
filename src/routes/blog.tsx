import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PagePlaceholder } from "@/components/site-layout";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog · ObraMétrica" },
      { name: "description", content: "Artigos e conteúdos sobre construção civil, energia solar e engenharia." },
      { property: "og:title", content: "Blog · ObraMétrica" },
      { property: "og:description", content: "Conteúdo técnico para construir melhor." },
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
