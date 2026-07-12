import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CookieBanner } from "./cookie-banner";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CookieBanner />
    </div>
  );
}

export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
        Em breve
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
        As calculadoras desta seção serão disponibilizadas em breve.
      </div>
    </section>
  );
}
