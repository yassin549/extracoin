"use client";

import { useEffect, useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  Shield, 
  Zap, 
  Copy, 
  Wallet,
  Brain,
  BarChart3,
  LineChart
} from 'lucide-react';
import { useElementScrollProgress } from '@/hooks/use-scroll-progress';
import { useUISounds } from '@/hooks/use-sound';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  gradient?: string;
}

function FeatureCard({ icon, title, description, delay, gradient = 'from-primary/20 to-accent-cyan/20' }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isInView } = useElementScrollProgress('features-section');
  const sounds = useUISounds();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return (
    <div
      className={`
        group relative glass rounded-2xl p-6 md:p-8 card-interactive
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      onMouseEnter={() => sounds.onHover()}
      onClick={() => sounds.onClick()}
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
      
      {/* Icon */}
      <div className="relative mb-4 inline-flex">
        <div className="absolute inset-0 bg-gradient-cyber rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        <div className="relative p-3 rounded-xl bg-gradient-cyber">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="mb-3 text-xl md:text-2xl font-bold text-foreground group-hover:gradient-text transition-all duration-300">
        {title}
      </h3>
      <p className="text-sm md:text-base text-foreground-dimmed leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div className="mt-4 flex items-center gap-2 text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-sm font-medium">Learn more</span>
        <Zap className="h-4 w-4" />
      </div>
    </div>
  );
}

export function FeaturesGrid() {
  return (
    <section id="features-section" className="relative py-16 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-block mb-4 px-4 py-2 rounded-full glass border border-accent-cyan/30">
            <span className="text-sm font-semibold gradient-text">Platform Features</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text-animated">Everything You Need</span>
            <br />
            <span className="text-foreground">to Trade Like a Pro</span>
          </h2>
          
          <p className="text-lg md:text-xl text-foreground-dimmed max-w-3xl mx-auto leading-relaxed">
            Advanced tools, intelligent automation, and professional infrastructure 
            all in one powerful platform
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <FeatureCard
            icon={<Brain className="h-7 w-7 text-white" />}
            title="AI Trading Engine"
            description="Most advanced trading agent ever deployed publicly. Trained on billions of data points with explainable decision-making."
            delay={0}
            gradient="from-primary/20 to-accent-cyan/20"
          />
          
          <FeatureCard
            icon={<Copy className="h-7 w-7 text-white" />}
            title="Intelligent Copy Trading"
            description="Every trade automatically copied to professional broker in real-time. Your balance mirrors broker performance instantly."
            delay={100}
            gradient="from-accent-cyan/20 to-accent-magenta/20"
          />
          
          <FeatureCard
            icon={<Wallet className="h-7 w-7 text-white" />}
            title="Zero Additional Fees"
            description="Trade without broker account setup or hidden fees. Simple 1% withdrawal fee, nothing else. Keep more of your profits."
            delay={200}
            gradient="from-accent-magenta/20 to-primary/20"
          />
          
          <FeatureCard
            icon={<LineChart className="h-7 w-7 text-white" />}
            title="TradingView Charts"
            description="Professional-grade charting with 100+ indicators, drawing tools, and real-time market data. Desktop and mobile optimized."
            delay={300}
            gradient="from-primary/20 to-success/20"
          />
          
          <FeatureCard
            icon={<BarChart3 className="h-7 w-7 text-white" />}
            title="Advanced Analytics"
            description="Comprehensive performance metrics, risk analysis, and portfolio insights. Sharpe ratio, drawdown, win rate, and more."
            delay={400}
            gradient="from-success/20 to-accent-cyan/20"
          />
          
          <FeatureCard
            icon={<Shield className="h-7 w-7 text-white" />}
            title="Licensed & Secure"
            description="Fully regulated by CMF with bank-grade security. KYC verification, encrypted data, and secure fund management."
            delay={500}
            gradient="from-accent-cyan/20 to-primary/20"
          />
          
          <FeatureCard
            icon={<Zap className="h-7 w-7 text-white" />}
            title="Instant Execution"
            description="Lightning-fast order execution with smart routing. Real-time balance updates and immediate position management."
            delay={600}
            gradient="from-primary/20 to-warning/20"
          />
          
          <FeatureCard
            icon={<TrendingUp className="h-7 w-7 text-white" />}
            title="Multiple Markets"
            description="Trade crypto, forex, indices, commodities, and stocks. Access global markets from one unified platform."
            delay={700}
            gradient="from-warning/20 to-accent-magenta/20"
          />
          
          <FeatureCard
            icon={<Bot className="h-7 w-7 text-white" />}
            title="AI Investment Plans"
            description="Let AI manage your portfolio with intelligent strategies. Choose risk level and let technology do the work."
            delay={800}
            gradient="from-accent-magenta/20 to-primary/20"
          />
        </div>
      </div>
    </section>
  );
}
