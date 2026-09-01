import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'owneronly-cars';
const isUserOrOrganizationSite = repositoryName.endsWith('.github.io');
const pagesBasePath =
  isGitHubPages && !isUserOrOrganizationSite ? '/' + repositoryName : '';

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: 'export',
      basePath: pagesBasePath,
    }
  : {};

export default nextConfig;
