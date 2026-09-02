import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.com',
  ),
  title: {
    default: 'Owner Only Cars | Cars from people, not lots.',
    template: '%s | Owner Only Cars',
  },
  description:
    'A marketplace for buying and selling cars directly with verified private owners—without dealer markups.',
  icons: {
    icon: [
      {
        url: '/favicon-logo.png?v=20260902-2',
        type: 'image/png',
        sizes: '1254x1254',
      },
    ],
    shortcut: ['/favicon-logo.png?v=20260902-2'],
    apple: [
      {
        url: '/favicon-logo.png?v=20260902-2',
        type: 'image/png',
        sizes: '1254x1254',
      },
    ],
  },
  openGraph: {
    title: 'Owner Only Cars',
    description: 'Cars from people, not lots.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Owner Only Cars — Cars from people, not lots.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owner Only Cars',
    description: 'Cars from people, not lots.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          content="sjBftnbPyOOYDa-wfVSNZ5YOU0TkEsQM788zlIoaRHw"
          name="google-site-verification"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
