"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { useGyroscopeParallax } from '@/hooks/use-device-motion';
import { useUISounds } from '@/hooks/use-sound';

export function HeroSection() {
  const { scrollY } = useScrollProgress();
  const gyroTransform = useGyroscopeParallax(0.5);
  const sounds = useUISounds();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax effect on scroll
  const parallaxY = scrollY * 0.5;
  
  // Combined gyroscope and scroll parallax
  const getOrbStyle = (scrollMultiplier: number) => ({
    transform: `translate3d(${gyroTransform.x}px, ${gyroTransform.y + (-parallaxY * scrollMultiplier)}px, 0)`,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating orbs with parallax */}
      <div 
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"
        style={getOrbStyle(0.3)}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-float"
        style={{
          ...getOrbStyle(0.5),
          animationDelay: '1s',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full glass border border-success/30 animate-slide-down"
            onMouseEnter={() => sounds.onHover()}
          >
            <Shield className="h-4 w-4 text-success animate-glow" />
            <span className="text-sm font-semibold text-foreground">
              Licensed & Regulated Trading Platform
            </span>
            <Sparkles className="h-4 w-4 text-accent-cyan animate-glow" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Main heading */}
          <h1 className="mb-6 md:mb-8 text-4xl sm:text-5xl md:text-7xl font-bold leading-tight animate-slide-up">
            <span className="block text-foreground">The Future of</span>
            <span className="block gradient-text-animated text-shadow-glow">
              AI-Powered Trading
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className="mb-8 md:mb-12 text-lg sm:text-xl md:text-2xl text-foreground-dimmed max-w-3xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            Trade with real money in simulated markets. Intelligent copy trading to professional brokers. 
            <span className="text-accent-cyan font-semibold"> Zero additional fees.</span>
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <Link href="/auth/signup" onClick={() => sounds.onClick()}>
              <Button 
                size="lg" 
                className="btn-futuristic gradient-cyber text-white hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-base md:text-lg px-8 py-6 glow-cyan touch-interactive"
              >
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="#features" onClick={() => sounds.onClick()}>
              <Button 
                variant="outline" 
                size="lg"
                className="glass border-white/20 hover:bg-white/10 w-full sm:w-auto text-base md:text-lg px-8 py-6 touch-interactive"
              >
                Explore Platform
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div 
            className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-foreground-dimmed animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-glow" />
              <span>12,000+ Active Traders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-glow" />
              <span>$127M+ Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
              <span>98% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {mounted && scrollY < 100 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-foreground-dimmed">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-current p-1">
              <div className="w-1.5 h-3 bg-current rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
