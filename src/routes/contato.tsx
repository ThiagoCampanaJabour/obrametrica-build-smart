import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead, SITE_URL } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Clock, CheckCircle2, Shield, Lightbulb } from "lucide-react";
import { z } from "zod";

const PATH = "/contato";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Contato", path: PATH },
];

const EMAIL = "obrametricasite@gmail.com";

export const Route = createFileRoute("/contato")({
  head: () =>
    pageHead({
      title: "Contato | Obra Métrica",
      description:
        "Entre em contato com a equipe da Obra Métrica para enviar sugestões, dúvidas ou propostas de parceria.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contato | Obra Métrica",
        url: `${SITE_URL}${PATH}`,
        mainEntity: {
          "@type": "Organization",
          name: "Obra Métrica",
          email: EMAIL,
          url: SITE_URL,
        },
      },
    }),
  component: ContatoPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  subject: z.string().trim().min(2, "Informe o assunto").max(150),
  message: z.string().trim().min(10, "Mensagem muito curta").max(2000),
});

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const suggestions = [
  "Sugestões de novas calculadoras",
  "Correção de cálculos",
  "Melhorias no site",
  "Solicitações de ferramentas",
  "Dúvidas técnicas",
  "Propostas comerciais",
];

function ContatoPage() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const body = `Nome: ${parsed.data.name}\nE-mail: ${parsed.data.email}\n\n${parsed.data.message}`;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(parsed.data.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
    form.reset();
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Fale conosco
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Entre em Contato
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          A equipe da Obra Métrica está disponível para receber sugestões, esclarecer dúvidas,
          reportar problemas e avaliar propostas de parceria.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Envie sua mensagem
              </h2>
              {sent && (
                <div
                  role="status"
                  className="mt-4 flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                  <p>Sua mensagem foi enviada com sucesso. Em breve entraremos em contato.</p>
                </div>
              )}
              <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" name="subject" type="text" required maxLength={150} />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" name="message" rows={6} required maxLength={2000} />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>
                <div>
                  <Button type="submit" size="lg">
                    Enviar Mensagem
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-foreground" aria-hidden />
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Sugestões e contribuições
                </h2>
              </div>
              <p className="mt-3 text-muted-foreground">Você pode nos enviar:</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-foreground" aria-hidden />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Empresa
                </h3>
              </div>
              <p className="mt-2 text-base font-medium text-foreground">Obra Métrica</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-foreground" aria-hidden />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  E-mail
                </h3>
              </div>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-2 block break-all text-base font-medium text-foreground hover:text-accent"
              >
                {EMAIL}
              </a>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-foreground" aria-hidden />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Atendimento
                </h3>
              </div>
              <p className="mt-2 text-base font-medium text-foreground">Segunda a Sexta-feira</p>
              <p className="text-sm text-muted-foreground">09:00 às 18:00</p>
              <p className="text-sm text-muted-foreground">Horário de Brasília</p>
            </div>

            <div className="rounded-xl bg-primary p-6 text-primary-foreground">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" aria-hidden />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Segurança</h3>
              </div>
              <p className="mt-2 text-sm text-primary-foreground/90">
                Os dados enviados através deste formulário serão utilizados exclusivamente para
                responder ao contato realizado, conforme nossa Política de Privacidade.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
