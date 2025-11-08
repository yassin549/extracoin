import Link from 'next/link';
import { ArrowRight, TrendingUp, Bot, BarChart3, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold gradient-text">Tunicoin</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-primary-600 transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary-600 transition">
              Pricing
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-lg bg-primary-600 px-6 py-2 text-white transition hover:bg-primary-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            Master CFD Trading with
            <br />
            <span className="gradient-text">AI-Powered Strategies</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Learn to trade CFD futures in a realistic simulated environment. No real money at risk.
            Subscribe to AI trading agents and test your strategies.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-primary-700"
            >
              Start Trading Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-8 py-3 text-lg font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              Watch Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            ⚠️ Simulated trading only. No real funds are traded.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Everything You Need to Trade
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Bot className="h-8 w-8" />}
              title="AI Trading Agents"
              description="Subscribe to algorithmic strategies that trade automatically with explainable decisions."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Advanced Analytics"
              description="Backtest strategies with comprehensive metrics: CAGR, Sharpe, Max Drawdown, and more."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Professional Charts"
              description="TradingView-powered charts with indicators, drawing tools, and real-time updates."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Risk-Free Learning"
              description="Practice with virtual funds. All trades are simulated with realistic market conditions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to Start Trading?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of traders learning CFD trading in a safe environment.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-primary-600 transition hover:bg-blue-50"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            © 2024 Tunicoin. All rights reserved. Simulated trading platform for educational
            purposes only.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Past simulated performance is not indicative of future results.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover rounded-xl border bg-white p-6">
      <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 text-primary-600">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
