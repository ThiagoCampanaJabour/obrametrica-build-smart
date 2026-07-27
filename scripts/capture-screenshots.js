// Playwright script to capture QA screenshots.
// Usage: node scripts/capture-screenshots.js [baseUrl]
// Default baseUrl: http://localhost:8080
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const baseUrl = process.argv[2] || 'http://localhost:8080';
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'qa', 'screenshots');
mkdirSync(outDir, { recursive: true });

const shots = [
  { name: 'homepage-desktop.png', path: '/', vp: { width: 1366, height: 768 } },
  { name: 'homepage-mobile.png', path: '/', vp: { width: 412, height: 915 } },
  { name: 'about-desktop.png', path: '/sobre', vp: { width: 1366, height: 768 } },
  { name: 'contact-desktop.png', path: '/contato', vp: { width: 1366, height: 768 } },
  { name: 'privacy-desktop.png', path: '/politica-de-privacidade', vp: { width: 1366, height: 768 } },
  { name: 'metodologia-desktop.png', path: '/metodologia', vp: { width: 1366, height: 768 } },
  { name: 'telhas-desktop.png', path: '/calculadora-de-telhas', vp: { width: 1366, height: 768 } },
  { name: 'telhas-mobile.png', path: '/calculadora-de-telhas', vp: { width: 412, height: 915 } },
];

const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.vp });
  const page = await ctx.newPage();
  await page.goto(baseUrl + s.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(outDir, s.name), fullPage: false });
  console.log('saved', s.name);
  await ctx.close();
}
await browser.close();
