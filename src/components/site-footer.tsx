import { Link } from "@tanstack/react-router";
const LOGO_URL = "/obrametrica-logo-sm.webp";

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
                decoding="async"
                className="h-12 w-auto"
              />
            </div>
            <p className="mt-4 max-w-md text-sm text-primary-foreground/80">
              Cálculos inteligentes para construir melhor. Portal especializado em calculadoras técnicas para construção civil, energia solar e engenharia.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Ferramentas</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/construcao-civil" className="hover:text-accent transition-colors">Construção Civil</Link></li>
              <li><Link to="/energia-solar" className="hover:text-accent transition-colors">Energia Solar</Link></li>
              <li><Link to="/conversores" className="hover:text-accent transition-colors">Conversores Técnicos</Link></li>
              <li><Link to="/metodologia" className="hover:text-accent transition-colors">Nossa Metodologia</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Institucional</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/sobre" className="hover:text-accent transition-colors">Sobre Nós</Link></li>
              <li><Link to="/equipe" className="hover:text-accent transition-colors">Nossa Equipe</Link></li>
              <li><Link to="/contato" className="hover:text-accent transition-colors">Contato</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog & Artigos</Link></li>
              <li><Link to="/politica-de-privacidade" className="hover:text-accent transition-colors">Privacidade</Link></li>
              <li><Link to="/politica-de-cookies" className="hover:text-accent transition-colors">Cookies</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-accent transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-dmca" className="hover:text-accent transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/70">
          <p>© {year} ObraMétrica · Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Siga-nos:</span>
            <a href="#" className="hover:text-accent">LinkedIn</a>
            <a href="#" className="hover:text-accent">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
