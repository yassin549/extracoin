import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tunicoin — Virtual CFD Futures Trading Platform',
  description:
    'Learn CFD trading with AI-powered strategies in a risk-free simulated environment. No real money at risk.',
  keywords: [
    'CFD trading',
    'futures',
    'trading simulator',
    'AI trading',
    'backtesting',
    'virtual trading',
  ],
  authors: [{ name: 'Tunicoin' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2B6EEA',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
