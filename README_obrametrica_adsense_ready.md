# ObraMétrica — Pacote AdSense Readiness

Este pacote contém arquivos para preparar o site à re‑submissão do Google AdSense.

## Passos rápidos:
1. Substituir [INSERIR] em arquivos (autor, e‑mails).
2. Substituir placeholders de imagem por assets reais (WebP).
3. Implementar CMP para bloquear scripts de Analytics/Ads até consentimento.
4. Commit e push em branch novo:
   ```bash
   git checkout -b feat/adsense-readiness
   git add checklist/ content/ assets/ pr_templates/ scripts/ README_obrametrica_adsense_ready.md
   git commit -m "feat: AdSense readiness — add policies, article and checklist"
   git push origin feat/adsense-readiness
   ```
5. Abrir PR com template `pr_templates/0001-adsense-readiness.patch.txt`, anexar evidence pack (screenshots, Lighthouse, Rich Results).

## Critérios mínimos antes de reaplicação ao AdSense:
- Privacy Policy, Cookie Policy, Terms e Contact visíveis.
- Páginas-chave com conteúdo editorial ≥ 500 palavras (ou landing articles vinculados).
- JSON‑LD validado para artigos.
- Cookie consent ativo e bloqueando scripts.
- No thin content (merge/noindex para páginas sem valor).
- Evidence pack anexado à aplicação.

## Observações finais e recomendações
Os arquivos adicionados são ponto de partida; o time deverá também:
- Enriquecer páginas de ferramentas com landing articles (500–1.200 palavras).
- Criar author bylines e página “Equipe”.
- Gerar ao menos 8 artigos originais de alta qualidade conforme checklist.
- Rodar Lighthouse, Rich Results Test e auditar Core Web Vitals antes da reaplicação.
- Não solicitar ativação de anúncio até confirmação do AdSense.