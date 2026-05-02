import './globals.css';
import type { Metadata } from 'next';

/* ============================================
   💡 SITE METADATA — SEO & SOCIAL CARDS
   ============================================ */
export const metadata: Metadata = {
  title: 'OPAQUEFILM',           // Browser tab title
  description: 'Creative developer portfolio and experiments', // Meta description

  /* --- OPEN GRAPH (Facebook/LinkedIn) --- */
  openGraph: {
    title: 'OPAQUEFILM',
    description: 'Creative developer portfolio and experiments',
    type: 'website',
  },

  /* --- TWITTER/X CARD --- */
  twitter: {
    card: 'summary',
    title: 'OPAQUEFILM',
    description: 'Creative developer portfolio and experiments',
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
