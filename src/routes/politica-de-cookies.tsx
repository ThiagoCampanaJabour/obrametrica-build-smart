import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import { Cookie, Shield, Info, ExternalLink } from "lucide-react";

const PATH = "/politica-de-cookies";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Política de Cookies", path: PATH },
];

export const Route = createFileRoute("/politica-de-cookies")({
  head: () =>
    pageHead({
      title: "Política de Cookies | Obra Métrica",
      description: "Conheça a nossa Política de Cookies e como gerenciamos suas preferências de privacidade.",
      path: PATH,
      type: "article",
      breadcrumbs: CRUMBS,
    }),
  component: PoliticaCookiesPage,
});

function PoliticaCookiesPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Legal
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Política de Cookies
        </h1>
        
        <div className="mt-10 prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            A Obra Métrica utiliza cookies para melhorar sua experiência de navegação e garantir o funcionamento correto de nossas calculadoras técnicas.
          </p>

          <div className="mt-8 space-y-8">
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">O que são cookies?</h2>
              </div>
              <p>
                Cookies são pequenos arquivos de texto enviados para o seu navegador e armazenados no seu dispositivo (computador, smartphone ou tablet). Eles permitem que o site "lembre" suas ações ou preferências ao longo do tempo.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">Tipos de cookies que utilizamos</h2>
              </div>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Cookies Necessários:</strong> Essenciais para o funcionamento básico do site, como navegação entre páginas e acesso a áreas seguras. Sem eles, o site não funciona corretamente.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Cookies Analíticos (Google Analytics):</strong> Ajudam-nos a entender como os visitantes interagem com o site, coletando e relatando informações de forma anônima.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Cookies de Publicidade (Google AdSense):</strong> Utilizados para exibir anúncios relevantes para os usuários com base em suas visitas anteriores a este ou outros sites.
                  </div>
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold m-0">Como gerenciar cookies</h2>
              </div>
              <p>
                Você pode controlar e/ou excluir cookies a qualquer momento através das configurações do seu navegador. 
                Saiba mais em <a href="https://aboutcookies.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-4">aboutcookies.org <ExternalLink className="h-3 w-3" /></a>.
              </p>
              <p className="mt-4 text-sm bg-muted p-4 rounded-lg">
                <strong>Nota:</strong> A desativação de cookies necessários pode afetar a funcionalidade das calculadoras e ferramentas técnicas do site.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-8">
          <p>Última atualização: 10 de agosto de 2026</p>
          <p className="mt-2">Obra Métrica — contato@obrametrica.com.br</p>
        </div>
      </section>
    </SiteLayout>
  );
}
