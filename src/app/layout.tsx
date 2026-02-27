import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'METRO – Catalogues',
  description:
    'METRO product catalogues. QX, QS, TS, VR, FM desk systems. FOTA conference furniture. MRC reception desks.',
  authors: [{ name: 'METRO' }],
  openGraph: {
    title: 'METRO – Catalogues',
    description: 'Product catalogues – browse by collection',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
