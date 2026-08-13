import React, { forwardRef } from 'react';

export const CasaAuroraSVG = forwardRef<SVGSVGElement, { className?: string; showDetails?: boolean }>(({ 
  className = "", 
  showDetails = true 
}, ref) => {
  return (
    <svg 
      viewBox="0 0 800 1200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      ref={ref}
    >
      {/* Background */}
      <rect width="800" height="1200" fill="#FCFCFA" />
      
      {/* Terreno Boundary */}
      <rect x="50" y="50" width="700" height="1100" stroke="#CCCCCC" strokeWidth="1" strokeDasharray="5,5" />
      
      {/* Recuos Indicative */}
      <text x="60" y="45" fontSize="10" fill="#999999" fontFamily="monospace">FRENTE: 8.00m</text>
      <text x="40" y="1160" fontSize="10" fill="#999999" fontFamily="monospace" transform="rotate(-90 40 1160)">PROF: 20.00m</text>

      {/* Zonas de Cor (Backgrounds for areas) */}
      {/* Área Social: Azul acinzentado */}
      <path d="M150 250 H650 V550 H150 Z" fill="#E8EDF2" opacity="0.5" />
      {/* Área Íntima: Verde acinzentado */}
      <path d="M150 550 H450 V850 H150 Z" fill="#E9F0EB" opacity="0.5" />
      {/* Área de Serviço: Cinza claro */}
      <path d="M450 550 H650 V850 H450 Z" fill="#F2F2F2" opacity="0.5" />
      {/* Área Externa Posterior: Verde suave */}
      <path d="M150 850 H650 V1050 H150 Z" fill="#F0F5F0" opacity="0.5" />

      {/* Paredes (Cinza Escuro) */}
      <g fill="#333333">
        {/* Exterior Walls */}
        <path d="M145 245 H655 V1055 H145 V245 Z M155 255 V1045 H645 V255 H155 Z" />
        {/* Internal Walls */}
        <rect x="150" y="545" width="500" height="10" /> {/* Divisão Social/Privado */}
        <rect x="445" y="550" width="10" height="300" /> {/* Divisão Quarto/Banheiro-Lavanderia */}
        <rect x="150" y="700" width="300" height="10" /> {/* Divisão Quarto/Closet */}
        <rect x="450" y="680" width="200" height="10" /> {/* Divisão Banheiro/Lavanderia */}
      </g>

      {/* Portas e Janelas */}
      <g stroke="#333333" strokeWidth="2">
        {/* Porta Principal */}
        <path d="M200 245 H280" stroke="#FFF" strokeWidth="12" />
        <path d="M200 245 L150 195" strokeWidth="1" />
        <path d="M200 245 A80 80 0 0 0 280 165" fill="none" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Janela Sala */}
        <rect x="350" y="245" width="200" height="10" fill="white" />
        
        {/* Porta Varanda */}
        <path d="M500 1045 H600" stroke="#FFF" strokeWidth="12" />
      </g>

      {/* Mobiliário Esquemático */}
      <g stroke="#999999" strokeWidth="1" fill="none">
        {/* Sofá */}
        <rect x="180" y="300" width="180" height="80" rx="5" />
        {/* Mesa de Jantar */}
        <rect x="450" y="300" width="120" height="80" rx="2" />
        <circle cx="435" cy="320" r="10" />
        <circle cx="435" cy="360" r="10" />
        <circle cx="585" cy="320" r="10" />
        <circle cx="585" cy="360" r="10" />
        {/* Bancada Cozinha */}
        <path d="M180 480 H400 V530" />
        {/* Cama */}
        <rect x="180" y="580" width="140" height="100" rx="2" />
        {/* Closet Armários */}
        <rect x="160" y="720" width="280" height="40" strokeDasharray="2,2" />
        <rect x="160" y="800" width="280" height="40" strokeDasharray="2,2" />
        {/* Banheiro Louças */}
        <circle cx="490" cy="590" r="15" /> {/* Vaso */}
        <rect x="550" y="570" width="60" height="40" /> {/* Lavatório */}
        <line x1="450" y1="630" x2="650" y2="630" /> {/* Box line */}
      </g>

      {/* Textos Ambientes */}
      <g fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#333333">
        <text x="320" y="420" textAnchor="middle">SALA ESTAR / JANTAR</text>
        <text x="320" y="440" textAnchor="middle" fontSize="10" fontWeight="normal">22.50 m²</text>
        
        <text x="530" y="480" textAnchor="middle">COZINHA</text>
        <text x="530" y="500" textAnchor="middle" fontSize="10" fontWeight="normal">9.80 m²</text>
        
        <text x="300" y="640" textAnchor="middle">QUARTO</text>
        <text x="300" y="660" textAnchor="middle" fontSize="10" fontWeight="normal">12.60 m²</text>
        
        <text x="300" y="770" textAnchor="middle">CLOSET</text>
        <text x="300" y="790" textAnchor="middle" fontSize="10" fontWeight="normal">5.40 m²</text>
        
        <text x="550" y="630" textAnchor="middle">BANHEIRO</text>
        <text x="550" y="650" textAnchor="middle" fontSize="10" fontWeight="normal">4.20 m²</text>
        
        <text x="550" y="770" textAnchor="middle">LAVANDERIA</text>
        <text x="550" y="790" textAnchor="middle" fontSize="10" fontWeight="normal">3.15 m²</text>
        
        <text x="400" y="950" textAnchor="middle">VARANDA GOURMET</text>
        <text x="400" y="970" textAnchor="middle" fontSize="10" fontWeight="normal">10.50 m²</text>
      </g>

      {/* Norte, Escala e Info */}
      {showDetails && (
        <g>
          {/* Norte */}
          <g transform="translate(720, 100)">
            <circle cx="0" cy="0" r="20" stroke="#333" fill="none" />
            <path d="M0 -15 L5 0 L-5 0 Z" fill="#333" />
            <text x="0" y="35" textAnchor="middle" fontSize="12" fontWeight="bold">N</text>
          </g>
          
          {/* Escala Gráfica */}
          <g transform="translate(50, 1100)">
            <rect x="0" y="0" width="50" height="5" fill="#333" />
            <rect x="50" y="0" width="50" height="5" fill="white" stroke="#333" />
            <text x="0" y="-5" fontSize="10">0</text>
            <text x="50" y="-5" fontSize="10">2.5m</text>
            <text x="100" y="-5" fontSize="10">5m</text>
          </g>

          {/* Logo ObraMétrica Placeholder */}
          <text x="750" y="1150" textAnchor="end" fontSize="16" fontWeight="bold" fill="#f97316">ObraMétrica</text>
          <text x="750" y="1170" textAnchor="end" fontSize="10" fill="#666">CASA AURORA - REV 00</text>
        </g>
      )}

      {/* Cotas Externas Esquemáticas */}
      <g stroke="#999" strokeWidth="1" fontSize="10" fill="#999">
        <line x1="130" y1="250" x2="130" y2="1050" />
        <text x="125" y="650" transform="rotate(-90 125 650)" textAnchor="middle">Edificação: 12.00m</text>
        
        <line x1="150" y1="230" x2="650" y2="230" />
        <text x="400" y="225" textAnchor="middle">Edificação: 6.00m</text>
      </g>
    </svg>
  );
});

CasaAuroraSVG.displayName = 'CasaAuroraSVG';
