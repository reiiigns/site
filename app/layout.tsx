import './globals.css';
import type { Metadata } from 'next';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/* ============================================
   💡 SITE METADATA — SEO & SOCIAL CARDS
   ============================================ */
export const metadata: Metadata = {
  title: 'REIIIGNS Works',           // Browser tab title
  description: 'Human software and strange games for nervous systems, attention, and sensory life.', // Meta description
  icons: {
    icon: `${BASE_PATH}/icon.svg`,
    apple: `${BASE_PATH}/icon.svg`,
  },

  /* --- OPEN GRAPH (Facebook/LinkedIn) --- */
  openGraph: {
    title: 'REIIIGNS Works',
    description: 'Human software and strange games for nervous systems, attention, and sensory life.',
    type: 'website',
  },

  /* --- TWITTER/X CARD --- */
  twitter: {
    card: 'summary',
    title: 'REIIIGNS Works',
    description: 'Human software and strange games for nervous systems, attention, and sensory life.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
