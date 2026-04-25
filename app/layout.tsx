import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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

/* ============================================
   💡 TYPEFACE — CONFIGURATION
   ============================================ */
/*
   To change the font:
   1. Import from next/font/google (or next/font/local)
   2. Replace 'Inter' with your chosen font
   3. Add CSS variable: --font-[name]: font-variable

   Available Google fonts: https://fonts.google.com/
   Examples:
     - JetBrains Mono (monospace, technical)
     - Space Grotesk (geometric, modern)
     - Syne (experimental, bold)
*/
const fontFamily = inter; // Change this to use a different font

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontFamily.className}>{children}</body>
    </html>
  );
}
