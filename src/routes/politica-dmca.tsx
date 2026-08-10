import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { ShieldAlert, Mail, Copyright, FileText } from "lucide-react";

const PATH = "/politica-dmca";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Política de DMCA", path: PATH },
];

export const Route = createFileRoute("/politica-dmca")({
  head: () =>
    pageHead({
      title: "Política de DMCA e Copyright — ObraMétrica",
      description: "Informações sobre direitos autorais, propriedade intelectual e como reportar infrações no portal Obra Métrica.",
      path: PATH,
    }),
  component: DmcaPage,
});

function DmcaPage() {
  return (
    <SiteLayout>
      <div className="bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={CRUMBS} />
          <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Copyright className="h-8 w-8 text-primary" /> Política de Direitos Autorais (DMCA)
            </h1>
            <div className="prose prose-slate max-w-none">
              <p>A Obra Métrica respeita a propriedade intelectual de terceiros. Se você acredita que seu trabalho foi copiado de uma forma que constitui infração de direitos autorais, siga nosso protocolo.</p>
              
              <h2 className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-accent" /> 1. Notificação de Infração</h2>
              <p>Para registrar uma reclamação, envie um e-mail para <strong>obrametricasite@gmail.com</strong> com:</p>
              <ul>
                <li>Assinatura física ou eletrônica do proprietário do direito;</li>
                <li>Identificação do trabalho protegido por direitos autorais que teria sido violado;</li>
                <li>Identificação do material que se alega estar infringindo no nosso site;</li>
                <li>Suas informações de contato (e-mail, telefone, endereço).</li>
              </ul>

              <h2 className="flex items-center gap-2"><FileText className="h-5 w-5 text-accent" /> 2. Propriedade Intelectual Obra Métrica</h2>
              <p>Todo o código, design, logotipos e conteúdos originais (incluindo algoritmos das calculadoras) são de propriedade exclusiva da Obra Métrica ou licenciados para nosso uso. A reprodução não autorizada é proibida.</p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
