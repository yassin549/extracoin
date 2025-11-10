"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useElementScrollProgress } from '@/hooks/use-scroll-progress';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}

function StatCard({ icon, value, suffix = '', prefix = '', label, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { isInView } = useElementScrollProgress('stats-section');

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isInView, hasAnimated, value]);

  return (
    <div 
      className="glass rounded-2xl p-6 md:p-8 touch-interactive animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-cyber glow-cyan">
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-3xl md:text-4xl font-bold gradient-text-animated">
          {prefix}{displayValue.toLocaleString()}{suffix}
        </div>
        <div className="text-sm text-foreground-dimmed uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <section id="stats-section" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-animated">Platform Performance</span>
          </h2>
          <p className="text-foreground-dimmed text-lg md:text-xl max-w-2xl mx-auto">
            Real-time statistics showcasing our platform's power and reach
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<Users className="h-6 w-6 text-white" />}
            value={12847}
            suffix="+"
            label="Active Traders"
            delay={0}
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6 text-white" />}
            value={127}
            prefix="$"
            suffix="M+"
            label="Assets Under Management"
            delay={100}
          />
          <StatCard
            icon={<Activity className="h-6 w-6 text-white" />}
            value={98}
            suffix="%"
            label="Platform Uptime"
            delay={200}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            value={847}
            suffix="+"
            label="Trades Today"
            delay={300}
          />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
