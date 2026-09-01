type ServerEnv = {
  siteUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  stripeSecretKey?: string;
  stripeIdentityWebhookSecret?: string;
  ownershipDocumentRetentionDays: number;
  nmvtisProvider: 'mock' | 'configured';
};

export function readServerEnv(): ServerEnv {
  const retention = Number.parseInt(process.env.OWNERSHIP_DOCUMENT_RETENTION_DAYS ?? '30', 10);
  if (!Number.isFinite(retention) || retention < 1 || retention > 365) throw new Error('OWNERSHIP_DOCUMENT_RETENTION_DAYS must be between 1 and 365');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  try { new URL(siteUrl); } catch { throw new Error('NEXT_PUBLIC_SITE_URL must be a valid absolute URL'); }
  return {
    siteUrl,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeIdentityWebhookSecret: process.env.STRIPE_IDENTITY_WEBHOOK_SECRET,
    ownershipDocumentRetentionDays: retention,
    nmvtisProvider: process.env.NMVTIS_PROVIDER === 'configured' ? 'configured' : 'mock',
  };
}
