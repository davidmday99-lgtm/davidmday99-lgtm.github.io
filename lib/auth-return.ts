const defaultReturnTo = '/dashboard';

export function getSafeAuthReturnTo(search: string) {
  const candidate = new URLSearchParams(search).get('returnTo');

  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return defaultReturnTo;
  }

  try {
    const parsed = new URL(candidate, 'https://owneronlycars.com');
    if (parsed.origin !== 'https://owneronlycars.com') return defaultReturnTo;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return defaultReturnTo;
  }
}

export function loginPath(returnTo: string) {
  return `/login?returnTo=${encodeURIComponent(returnTo)}`;
}
