import React from 'react';
import type { PlantItem } from '@/lib/types/plant';

export const Casa2Q6x10SVG = React.forwardRef<SVGSVGElement, { className?: string }>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 600 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Terreno */}
      <rect width="600" height="1000" fill="#f8fafc" />
      <rect x="5" y="5" width="590" height="990" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="10 5" />
      
      {/* Paredes Externas (6x10m -> 600x1000px) */}
      <path
        d="M 50 50 L 550 50 L 550 950 L 50 950 Z"
        stroke="#1e293b"
        strokeWidth="14"
        fill="white"
      />

      {/* Divisões Internas (Conceitual) */}
      {/* Parede Sala/Cozinha para Quartos */}
      <line x1="50" y1="500" x2="550" y2="500" stroke="#1e293b" strokeWidth="10" />
      
      {/* Divisão Suíte / Quarto Secundário */}
      <line x1="300" y1="500" x2="300" y2="950" stroke="#1e293b" strokeWidth="10" />

      {/* Banheiro Social e Lavanderia (Lado a Lado) */}
      <line x1="50" y1="350" x2="350" y2="350" stroke="#1e293b" strokeWidth="10" />
      <line x1="200" y1="350" x2="200" y2="50" stroke="#1e293b" strokeWidth="10" />

      {/* Varanda / Entrada */}
      <rect x="50" y="50" width="150" height="150" fill="#f1f5f9" />
      <text x="70" y="100" fontSize="12" fill="#64748b">VARANDA</text>

      {/* Rótulos de Ambientes */}
      <text x="250" y="250" fontSize="24" fontWeight="bold" fill="#1e293b" textAnchor="middle">SALA + COZINHA</text>
      <text x="250" y="280" fontSize="14" fill="#64748b" textAnchor="middle">(INTEGRADOS)</text>

      <text x="125" y="200" fontSize="16" fill="#1e293b" textAnchor="middle">LAVAND.</text>
      <text x="275" y="200" fontSize="16" fill="#1e293b" textAnchor="middle">BANHO SOC.</text>

      <text x="175" y="725" fontSize="20" fontWeight="bold" fill="#1e293b" textAnchor="middle">QUARTO 2</text>
      <text x="425" y="725" fontSize="20" fontWeight="bold" fill="#1e293b" textAnchor="middle">SUÍTE</text>

      {/* Dimensões Externas */}
      <text x="300" y="30" fontSize="16" fill="#94a3b8" textAnchor="middle">6,00 m</text>
      <text x="20" y="500" fontSize="16" fill="#94a3b8" textAnchor="middle" transform="rotate(-90 20 500)">10,00 m</text>

      {/* Escala */}
      <text x="500" y="980" fontSize="12" fill="#94a3b8" textAnchor="end">Escala 1:100 (Indicativa)</text>
    </svg>
  );
});

Casa2Q6x10SVG.displayName = 'Casa2Q6x10SVG';
