import { jsPDF } from 'jspdf';
import { PlantItem } from './types/plant';

/**
 * Função para gerar e baixar o PDF da Planta Baixa (SVG)
 */
export async function downloadPlantaBaixaPDF(plant: PlantItem, svgElement: SVGSVGElement) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 1. Título e Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(249, 115, 22); // Cor primária (f97316)
    doc.text('ObraMétrica - Planta Técnica', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(plant.title, 105, 30, { align: 'center' });

    // 2. Converter SVG para Imagem e adicionar ao PDF
    // Usamos um truque de serializar o SVG para Base64
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Aumentar resolução para o PDF
    const scale = 2;
    canvas.width = 800 * scale;
    canvas.height = 1200 * scale;
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          
          // Adicionar imagem centralizada (escala para caber no A4)
          // A4 é ~210x297mm. Deixamos margens.
          const imgWidth = 170;
          const imgHeight = (imgWidth * 1200) / 800;
          
          doc.addImage(imgData, 'JPEG', 20, 45, imgWidth, imgHeight);
          
          // 3. Rodapé/Aviso Legal
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          const splitDisclaimer = doc.splitTextToSize(plant.disclaimerLong || '', 170);
          doc.text(splitDisclaimer, 20, 270);
          
          doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} | obrametrica.com.br`, 105, 285, { align: 'center' });

          doc.save(`obrametrica-${plant.slug || 'planta'}-planta-baixa.pdf`);
          resolve();
        }
      };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  } catch (error) {
    console.error('Erro ao gerar PDF da planta:', error);
    throw error;
  }
}

/**
 * Função para gerar e baixar a Ficha Técnica do Projeto
 */
export async function downloadFichaTecnicaPDF(plant: PlantItem) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Cabeçalho
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22);
    doc.text('FICHA TÉCNICA DO PROJETO', 20, 25);
    
    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(1);
    doc.line(20, 30, 190, 30);

    // Informações Principais
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(plant.title, 20, 45);

    doc.setFontSize(12);
    doc.text(`Código: OM-${(plant.slug || 'AUR').toUpperCase()}-001`, 20, 55);
    doc.text(`Área Construída: ${plant.area} m²`, 20, 62);
    doc.text(`Terreno Mínimo: ${plant.terreno}`, 20, 69);
    doc.text(`Autor: ${plant.author}`, 20, 76);

    // Tabela de Ambientes
    doc.setFontSize(14);
    doc.text('Programa de Ambientes', 20, 95);
    doc.line(20, 97, 80, 97);

    let y = 105;
    doc.setFontSize(10);
    plant.ambientes?.forEach((amb) => {
      doc.text(amb.nome, 20, y);
      doc.text(`${amb.area.toFixed(2)} m²`, 140, y, { align: 'right' });
      y += 7;
    });

    doc.setFont('helvetica', 'bold');
    doc.text('ÁREA TOTAL ESTIMADA', 20, y + 3);
    doc.text(`${plant.area} m²`, 140, y + 3, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // Diferenciais e Materiais
    y += 20;
    doc.setFontSize(14);
    doc.text('Diferenciais do Projeto', 20, y);
    doc.line(20, y + 2, 80, y + 2);
    
    y += 10;
    doc.setFontSize(10);
    const diferenciais = [
      "Integração total sala/cozinha/varanda",
      "Suíte master com closet privativo",
      "Lavanderia reservada com pátio de serviço",
      "Ventilação cruzada e excelente iluminação natural",
      "Design moderno e sofisticado"
    ];
    diferenciais.forEach(item => {
      doc.text(`• ${item}`, 25, y);
      y += 6;
    });

    // Aviso Legal
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const splitAviso = doc.splitTextToSize(
      "AVISO: Este documento é um estudo preliminar. Antes de iniciar qualquer obra, é obrigatória a contratação de um profissional habilitado (Arquiteto ou Engenheiro) para elaboração dos projetos executivos, estruturais e complementares, além da aprovação nos órgãos competentes da sua cidade.", 
      170
    );
    doc.text(splitAviso, 20, 260);

    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} | obrametrica.com.br`, 105, 285, { align: 'center' });

    doc.save(`obrametrica-${plant.slug || 'planta'}-ficha-tecnica.pdf`);
  } catch (error) {
    console.error('Erro ao gerar ficha técnica:', error);
    throw error;
  }
}
