import { copyFile, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');
const source = resolve(root, 'src');
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
const rawSiteUrl = process.env.SITE_URL?.trim()
  || (vercelProductionUrl ? `https://${vercelProductionUrl}` : '');
const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, '') : '';
const lastmod = '2026-10-23';

const pages = [
  { file: 'index.html', path: '/', priority: '1.0' },
  { file: 'blog/index.html', path: '/blog/', priority: '0.8' },
  { file: 'blog/shin-yubin-hashimoto-2026/index.html', path: '/blog/shin-yubin-hashimoto-2026/', priority: '0.9' }
];

const sourceFiles = [
  ['index.html', 'index.html'],
  ['blog-index.html', 'blog/index.html'],
  ['blog-detail.html', 'blog/shin-yubin-hashimoto-2026/index.html'],
  ['legacy.html', 'blog/shin-yubin/index.html'],
  ['posts.json', 'data/posts.json'],
  ['blog.js', 'assets/blog.js'],
  ['script.js', 'assets/script.js'],
  ['seo.css', 'assets/seo.css']
];

for (const [sourceFile, outputFile] of sourceFiles) {
  const outputPath = resolve(dist, outputFile);
  await mkdir(dirname(outputPath), { recursive: true });
  await copyFile(resolve(source, sourceFile), outputPath);
}

for (const page of pages) {
  const filePath = resolve(dist, page.file);
  let html = await readFile(filePath, 'utf8');
  const canonical = siteUrl ? `<link rel="canonical" href="${siteUrl}${page.path}">` : '';
  html = html.replace(/<!-- CANONICAL_START -->[\s\S]*?<!-- CANONICAL_END -->/, `<!-- CANONICAL_START -->${canonical}<!-- CANONICAL_END -->`);

  if (page.path === '/blog/shin-yubin-hashimoto-2026/') {
    const jsonLd = siteUrl ? `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: '신유빈 하시모토 역전승, 1-2에서 3-2로 뒤집은 아시안컵 명승부',
      description: '신유빈의 하시모토 호노카 상대 3-2 역전승과 2026 탁구 아시안컵 16강 경기 흐름, 관전 포인트를 정리한 글입니다.',
      datePublished: lastmod,
      dateModified: lastmod,
      inLanguage: 'ko-KR',
      mainEntityOfPage: `${siteUrl}${page.path}`,
      author: { '@type': 'Organization', name: 'RALLY' },
      publisher: { '@type': 'Organization', name: 'RALLY' }
    })}</script>` : '';
    html = html.replace(/<!-- JSONLD_START -->[\s\S]*?<!-- JSONLD_END -->/, `<!-- JSONLD_START -->${jsonLd}<!-- JSONLD_END -->`);
  }

  await writeFile(filePath, html, 'utf8');
}

const robotsLines = ['User-agent: *', 'Allow: /'];
if (siteUrl) robotsLines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
await writeFile(resolve(dist, 'robots.txt'), `${robotsLines.join('\n')}\n`, 'utf8');

const sitemapPath = resolve(dist, 'sitemap.xml');
if (siteUrl) {
  const urls = pages.map((page) => `  <url><loc>${siteUrl}${page.path}</loc><lastmod>${lastmod}</lastmod><priority>${page.priority}</priority></url>`).join('\n');
  await writeFile(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
} else {
  await rm(sitemapPath, { force: true });
}

console.log(`RALLY build complete (${siteUrl || 'SITE_URL not set: canonical and sitemap omitted'})`);
