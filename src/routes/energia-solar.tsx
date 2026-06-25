import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/energia-solar")({
  head: () => ({
    meta: [
      { title: "Energia Solar · ObraMétrica" },
      { name: "description", content: "Calculadoras de energia solar: dimensionamento, economia e payback." },
      { property: "og:title", content: "Energia Solar · ObraMétrica" },
      { property: "og:description", content: "Calculadoras de energia solar." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
