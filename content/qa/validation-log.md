# Validation Log — Sprint 5

Executado em: 2026-07-27 17:56 UTC · Base: `http://localhost:8080`

## 1. JSONLint / FAQ JSON-LD

```
$ for f in content/calculadoras/*/faq.jsonld; do python3 -c "import json; json.load(open('$f'))" && echo PASS $f; done
PASS content/calculadoras/aco/faq.jsonld
PASS content/calculadoras/blocos/faq.jsonld
PASS content/calculadoras/formas/faq.jsonld
PASS content/calculadoras/reboco/faq.jsonld
PASS content/calculadoras/telhas/faq.jsonld
```

**Resultado:** 5/5 arquivos válidos.

## 2. Sitemap

```
$ curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:8080/sitemap.xml
200
```

**Resultado:** ✅ acessível. Contém `/metodologia` + 19 calculadoras/conversores + institucionais + blog.

## 3. Robots.txt

```
$ curl -sf http://localhost:8080/robots.txt
User-agent: *
Allow: /
Sitemap: https://obrametrica.com.br/sitemap.xml
```

**Resultado:** ✅ permite indexação, aponta para sitemap oficial.

## 4. Formulário de Contato

- Integração: **Formspree** via `VITE_FORMSPREE_ID` (`src/routes/contato.tsx`).
- Honeypot: campo oculto `website` — submissões preenchidas retornam sucesso silencioso sem envio.
- Feedback: alerta `role="alert"` para erro, `role="status"` para sucesso.
- **Teste real:** requer `VITE_FORMSPREE_ID` definido em produção. Sem o secret, envio falha com mensagem amigável — comportamento intencional.

## 5. Screenshots

Ver `content/qa/screenshots/README.md` — 8 imagens geradas via Playwright headless.
Alerta: `metodologia-desktop.png` mostra 404 (ver issue `issues/metodologia-route.md`).

## 6. Mobile Friendly

Executar após deploy:
`https://search.google.com/test/mobile-friendly?url=https://obrametrica.com.br`

Visual local em `screenshots/homepage-mobile.png` — sem overflow horizontal, tipografia legível ≥ 16px, botões ≥ 44×44px.
