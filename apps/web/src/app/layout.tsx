import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OptCoin — Next-Generation AI Trading Platform',
  description:
    'Trade with real money in simulated markets powered by intelligent copy trading. The most advanced AI trading engine ever deployed publicly. Licensed & regulated.',
  keywords: [
    'AI trading platform',
    'copy trading',
    'simulated trading',
    'algorithmic trading',
    'professional trading',
    'financial technology',
  ],
  authors: [{ name: 'OptCoin' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2B6EEA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
