// Renders every page in sites/ to a single-page PDF in pdf/ (and a PNG preview with --png).
// Usage: NODE_USE_ENV_PROXY=1 node scripts/render.mjs [--png] [name-filter]
import { chromium } from 'playwright';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const png = args.includes('--png');
const filter = args.find(a => !a.startsWith('--')) ?? '';
const WIDTH = 1440;

const files = readdirSync(join(root, 'sites')).filter(f => f.endsWith('.html') && f.includes(filter)).sort();
mkdirSync(join(root, 'pdf'), { recursive: true });
if (png) mkdirSync(join(root, 'previews'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 } });
// Headless Chromium doesn't pick up the sandbox's HTTPS proxy, so fetch Google Fonts
// through Node (run with NODE_USE_ENV_PROXY=1) and hand the responses to the page.
const ua = await page.evaluate(() => navigator.userAgent);
await page.route(/fonts\.(googleapis|gstatic)\.com/, async route => {
  const res = await fetch(route.request().url(), { headers: { 'user-agent': ua } });
  await route.fulfill({
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? '', 'access-control-allow-origin': '*' },
    body: Buffer.from(await res.arrayBuffer()),
  });
});
for (const f of files) {
  await page.goto(pathToFileURL(join(root, 'sites', f)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  const name = basename(f, '.html');
  await page.emulateMedia({ media: 'screen' });
  await page.pdf({
    path: join(root, 'pdf', `${name}.pdf`),
    width: `${WIDTH}px`, height: `${height + 2}px`,
    printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: '1',
  });
  if (png) await page.screenshot({ path: join(root, 'previews', `${name}.png`), fullPage: true });
  console.log(`${name}: ${WIDTH}×${height}`);
}
await browser.close();
