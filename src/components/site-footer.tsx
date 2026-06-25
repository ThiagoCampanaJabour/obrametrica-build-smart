import { Link } from "@tanstack/react-router";
const LOGO_URL = "/obrametrica-logo.jpg";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="bg-background inline-block rounded-md p-2">
              <img
                src={LOGO_URL}
                alt="ObraMétrica"
                width="144"
                height="48"
                loading="lazy"
                className="h-12 w-auto"
              />
            </div>
            <p className="mt-4 max-w-md text-sm text-primary-foreground/80">
              Cálculos inteligentes para construir melhor. Calculadoras para construção civil,
              energia solar e conversores técnicos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-accent">Categorias</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/construcao-civil" className="hover:text-accent">
                  Construção Civil
                </Link>
              </li>
              <li>
                <Link to="/energia-solar" className="hover:text-accent">
                  Energia Solar
                </Link>
              </li>
              <li>
                <Link to="/conversores" className="hover:text-accent">
                  Conversores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-accent">Institucional</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="hover:text-accent">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-accent">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/70">
          © {year} ObraMétrica · obrametrica.com.br · Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
