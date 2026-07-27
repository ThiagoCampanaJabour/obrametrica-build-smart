# QA Screenshots — 2026-07-27 17:56 UTC

Capturas geradas via Playwright headless contra `http://localhost:8080` (preview local).

| Arquivo | Viewport | Rota | Propósito |
|---------|----------|------|-----------|
| `homepage-desktop.png` | 1366×768 | `/` | Layout desktop da home e navegação principal |
| `homepage-mobile.png` | 412×915 | `/` | Layout mobile: header colapsado, hero legível |
| `about-desktop.png` | 1366×768 | `/sobre` | Conteúdo institucional da página Sobre |
| `contact-desktop.png` | 1366×768 | `/contato` | Formulário Formspree + campos validados |
| `privacy-desktop.png` | 1366×768 | `/politica-de-privacidade` | Política com e-mail e seções LGPD |
| `metodologia-desktop.png` | 1366×768 | `/metodologia` | **404 — rota ainda não existe** (conteúdo em `content/metodologia.md`) |
| `telhas-desktop.png` | 1366×768 | `/calculadora-de-telhas` | Calculadora com dica, campos e breadcrumbs |
| `telhas-mobile.png` | 412×915 | `/calculadora-de-telhas` | Layout mobile da calculadora prioritária |

## Como reproduzir

```bash
python3 -c "import asyncio; exec(open('/tmp/shot.py').read())"
# ou
node scripts/capture-screenshots.js http://localhost:8080
```

O script Playwright oficial está em `scripts/capture-screenshots.js`. Requer `playwright` instalado (`bunx playwright install chromium`).
