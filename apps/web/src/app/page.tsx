import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { MarketTicker } from '@/components/landing/market-ticker';
import { AnimatedStats } from '@/components/landing/animated-stats';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TradingViewWidget } from '@/components/landing/tradingview-widget';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section with Parallax & Gyroscope */}
      <HeroSection />

      {/* Live Market Ticker */}
      <MarketTicker />

      {/* Real-time Platform Statistics */}
      <AnimatedStats />

      {/* Features Grid with Scroll Animations */}
      <FeaturesGrid />

      {/* TradingView Charts Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-elevated to-background" />
        
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 px-4 py-2 rounded-full glass border border-accent-magenta/30">
              <span className="text-sm font-semibold gradient-text">Live Market Data</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Professional-Grade</span>
              <br />
              <span className="gradient-text-animated">Trading Charts</span>
            </h2>
            
            <p className="text-lg md:text-xl text-foreground-dimmed max-w-3xl mx-auto">
              Real-time market data powered by TradingView. 
              Access the same tools used by professional traders worldwide.
            </p>
          </div>

          {/* TradingView Widget */}
          <div className="max-w-6xl mx-auto">
            <TradingViewWidget height={600} />
          </div>
        </div>
      </section>

      {/* How It Works with Step Animation */}
      <HowItWorks />

      {/* Call to Action with Haptics & Sound */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

