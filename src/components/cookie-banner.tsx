import { useEffect, useState } from "react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já fez uma escolha anterior
    const cookieConsent = localStorage.getItem("omCookieConsent");

    // Se não tiver escolhido, mostra o banner
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  // Função para aceitar todos os cookies
  const handleAcceptAll = () => {
    localStorage.setItem("omCookieConsent", "all");
    setShowBanner(false);
    // Aqui você pode disparar eventos de analytics
    console.log("Cookies completos aceitos");
  };

  // Função para aceitar apenas cookies necessários
  const handleNecessaryOnly = () => {
    localStorage.setItem("omCookieConsent", "necessary");
    setShowBanner(false);
    console.log("Apenas cookies necessários");
  };

  // Se o banner não deve ser mostrado, retorna null
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Conteúdo do banner */}
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              Cookies e Privacidade
            </h2>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
              Usamos cookies para melhorar sua experiência, medir o uso do site e oferecer conteúdos relevantes. 
              Você pode aceitar apenas os cookies necessários ou todos os cookies.
            </p>
            {/* Links para políticas */}
            <div className="text-xs space-x-4">
              <a 
                href="/politica-de-cookies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Política de Cookies
              </a>
              <a 
                href="/politica-de-privacidade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Política de Privacidade
              </a>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 flex-col sm:flex-row sm:flex-shrink-0">
            <button
              onClick={handleNecessaryOnly}
              className="px-5 py-2 text-sm font-medium text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
              Apenas Necessários
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
