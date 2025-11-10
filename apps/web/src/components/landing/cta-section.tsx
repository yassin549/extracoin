"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useElementScrollProgress } from '@/hooks/use-scroll-progress';
import { useUISounds } from '@/hooks/use-sound';
import { useUIHaptics } from '@/hooks/use-haptic-feedback';

export function CTASection() {
  const { isInView } = useElementScrollProgress('cta-section');
  const sounds = useUISounds();
  const haptics = useUIHaptics();
  const [isHovered, setIsHovered] = useState(false);

  const handleCTAClick = () => {
    sounds.onClick();
    haptics.onSuccess();
  };

  return (
    <section id="cta-section" className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent-cyan/10 to-accent-magenta/20" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent-cyan/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main content */}
          <div 
            className={`
              text-center space-y-8 transition-all duration-700
              ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong border border-accent-cyan/30">
              <Sparkles className="h-4 w-4 text-accent-cyan animate-glow" />
              <span className="text-sm font-semibold text-foreground">Limited Time: Zero Setup Fees</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-foreground mb-2">Ready to Trade</span>
              <span className="block gradient-text-animated text-shadow-glow">Like a Professional?</span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-foreground-dimmed max-w-2xl mx-auto leading-relaxed">
              Join thousands of traders using the most advanced AI trading platform. 
              Start with as little as $100 and experience the future of finance.
            </p>

            {/* Features list */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-base text-foreground-dimmed">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <span>Licensed & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent-cyan" />
                <span>Instant Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-magenta" />
                <span>AI-Powered Returns</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup" onClick={handleCTAClick}>
                <Button
                  size="lg"
                  className={`
                    btn-futuristic gradient-cyber text-white text-lg px-12 py-7
                    touch-interactive w-full sm:w-auto group
                    ${isHovered ? 'glow-cyan scale-105' : ''}
                  `}
                  onMouseEnter={() => {
                    setIsHovered(true);
                    sounds.onHover();
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Trading Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="glass border-white/20 hover:bg-white/10 text-lg px-12 py-7 touch-interactive w-full sm:w-auto"
                  onClick={() => sounds.onClick()}
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicator */}
            <p className="text-sm text-foreground-dimmed pt-4">
              ⚡ Join <span className="text-accent-cyan font-semibold">12,847+</span> active traders • 
              <span className="text-success font-semibold"> $127M+</span> in managed assets
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
