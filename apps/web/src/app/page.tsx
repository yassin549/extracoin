import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroClassic } from '@/components/landing/hero-classic';
import { TradingPairs } from '@/components/landing/trading-pairs';
import { NewsSection } from '@/components/landing/news-section';
import { PlatformIntro } from '@/components/landing/platform-intro';
import { MobileApp } from '@/components/landing/mobile-app';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroClassic />

      {/* Trading Pairs with Sparklines */}
      <TradingPairs />

      {/* News and Information */}
      <NewsSection />

      {/* Platform Introduction */}
      <PlatformIntro />

      {/* Mobile App Download */}
      <MobileApp />

      {/* Footer */}
      <Footer />
    </div>
  );
}

