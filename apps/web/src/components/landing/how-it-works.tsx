"use client";

import { useEffect, useState } from 'react';
import { UserPlus, Shield, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { useElementScrollProgress } from '@/hooks/use-scroll-progress';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function Step({ number, icon, title, description, delay }: StepProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isInView } = useElementScrollProgress('how-it-works-section');

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return (
    <div
      className={`
        relative group transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
    >
      {/* Connection line (hidden on mobile, shown on desktop) */}
      {number < 4 && (
        <div className="hidden lg:block absolute top-1/3 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10">
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <ArrowRight className="h-5 w-5 text-primary/50" />
          </div>
        </div>
      )}

      <div className="relative text-center lg:text-left">
        {/* Step number */}
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-6 relative mx-auto lg:mx-0">
          <div className="absolute inset-0 bg-gradient-cyber rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-full h-full bg-gradient-cyber rounded-2xl flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-white">{number}</span>
          </div>
        </div>

        {/* Icon */}
        <div className="mb-4 inline-flex p-3 rounded-xl glass-strong border border-white/10 mx-auto lg:mx-0">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:gradient-text transition-all">
          {title}
        </h3>
        <p className="text-sm md:text-base text-foreground-dimmed leading-relaxed max-w-xs mx-auto lg:mx-0">
          {description}
        </p>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works-section" className="relative py-16 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-elevated/50" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block mb-4 px-4 py-2 rounded-full glass border border-primary/30">
            <span className="text-sm font-semibold gradient-text">Simple Process</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text-animated">Start Trading</span>
            <br />
            <span className="text-foreground">in 4 Easy Steps</span>
          </h2>
          
          <p className="text-lg md:text-xl text-foreground-dimmed max-w-3xl mx-auto leading-relaxed">
            From signup to your first trade in minutes. No complex setup, no hidden fees.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 max-w-7xl mx-auto">
          <Step
            number={1}
            icon={<UserPlus className="h-6 w-6 text-accent-cyan" />}
            title="Create Account"
            description="Sign up in 30 seconds with just email and password. No credit card required to start."
            delay={0}
          />
          
          <Step
            number={2}
            icon={<Shield className="h-6 w-6 text-success" />}
            title="Verify Identity"
            description="Complete KYC verification instantly. Upload documents and get approved in real-time."
            delay={150}
          />
          
          <Step
            number={3}
            icon={<Wallet className="h-6 w-6 text-primary" />}
            title="Deposit Funds"
            description="Fund your account with crypto. Support for BTC, ETH, USDT and more. Instant credit."
            delay={300}
          />
          
          <Step
            number={4}
            icon={<TrendingUp className="h-6 w-6 text-accent-magenta" />}
            title="Start Trading"
            description="Place your first trade with AI assistance. Copy trading active automatically."
            delay={450}
          />
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-sm md:text-base text-foreground-dimmed max-w-2xl mx-auto">
            <span className="text-success font-semibold">✓ Licensed Platform</span> • 
            <span className="text-accent-cyan font-semibold"> Instant KYC</span> • 
            <span className="text-primary font-semibold"> Zero Setup Fees</span>
          </p>
        </div>
      </div>
    </section>
  );
}
