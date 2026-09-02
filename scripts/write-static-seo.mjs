import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('dist/client');
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.com'
).replace(/\/+$/, '');

const excludedRoutes = [
  '/404',
  '/account',
  '/admin',
  '/cars',
  '/dashboard',
  '/favorites',
  '/login',
  '/messages',
  '/settings',
  '/signup',
  '/sell/preview',
  '/private-seller-auctions/create',
];

const demonstrationAuctionRoutes = [
  '/private-seller-auctions/2018-city-hatchback-auction',
  '/private-seller-auctions/2019-everyday-pickup-auction',
  '/private-seller-auctions/2021-touring-crossover-auction',
];

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectHtmlFiles(entryPath) : entryPath;
    }),
  );
  return files.flat().filter((file) => file.endsWith('.html'));
}

function toRoute(file) {
  const relative = path.relative(outputDirectory, file).replaceAll('\\', '/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/\.html$/, '').replace(/\/index$/, '')}`;
}

function isPublicRoute(route) {
  const isExcluded = excludedRoutes.some(
    (excluded) => route === excluded || route.startsWith(`${excluded}/`),
  );

  return !isExcluded && !demonstrationAuctionRoutes.includes(route);
}

async function writeStaticSeoFiles() {
  if (process.env.GITHUB_PAGES !== 'true') return;

  const routes = (await collectHtmlFiles(outputDirectory))
    .map(toRoute)
    .filter(isPublicRoute)
    .sort((a, b) => a.localeCompare(b));

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /account/',
    'Disallow: /admin/',
    'Disallow: /dashboard',
    'Disallow: /favorites',
    'Disallow: /messages',
    'Disallow: /settings',
    'Disallow: /sell/preview',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');

  await Promise.all([
    writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap, 'utf8'),
    writeFile(path.join(outputDirectory, 'robots.txt'), robots, 'utf8'),
  ]);

  console.log(`Generated sitemap.xml with ${routes.length} public routes.`);
}

await writeStaticSeoFiles();
