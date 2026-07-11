import { useEffect, useState } from "react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("omCookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("omCookieConsent", "all");
    setShowBanner(false);
    console.log("Cookies completos aceitos");
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem("omCookieConsent", "necessary");
    setShowBanner(false);
    console.log("Apenas cookies necessários");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              Cookies e Privacidade
            </h2>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
              Usamos cookies para melhorar sua experiência, medir o uso do site e oferecer conteúdos relevantes. 
              Você pode aceitar apenas os cookies necessários ou todos os cookies.
            </p>
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
