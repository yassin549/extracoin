"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroClassic() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary/10 border border-primary/30">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 012 0v4a1 1 0 01-2 0V5zm1 9a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
              <span className="text-sm text-primary font-semibold">
                Optcoin demonstrates commitment to legal and transparent operations through MSB registration
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Trade with</span>
              <br />
              <span className="text-primary">AI-Powered</span>
              <br />
              <span className="text-white">Technology</span>
            </h1>

            <p className="text-lg text-foreground-dimmed max-w-xl">
              Professional digital asset trading platform with intelligent copy trading 
              and real-time market analysis. Join thousands of traders worldwide.
            </p>

            <Link href="/auth/signup">
              <Button 
                size="lg"
                className="btn-primary text-xl px-12 py-8 rounded-lg font-bold uppercase tracking-wider shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60"
              >
                REGISTER NOW
              </Button>
            </Link>
          </div>

          {/* Right side - Illustration */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating crypto coins animation */}
              <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-float" />
              <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
              
              {/* Main illustration container */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Bitcoin symbol */}
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-4 border-primary/30 animate-pulse">
                    <svg className="w-32 h-32 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
                      <path fill="#000" d="M17.515 11.506c.23-1.54-.943-2.368-2.547-2.92l.52-2.087-1.27-.317-.507 2.034c-.334-.083-.677-.162-1.018-.238l.512-2.05-1.27-.316-.52 2.087c-.277-.063-.548-.125-.81-.19l.001-.007-1.75-.437-.338 1.353s.943.217.923.23c.515.13.608.47.592.742l-.593 2.377c.036.01.082.023.135.044l-.137-.034-.832 3.338c-.063.156-.223.39-.584.3.013.02-.923-.23-.923-.23l-.63 1.45 1.653.412c.307.077.608.158.905.234l-.525 2.107 1.27.316.52-2.088c.347.095.683.182 1.012.265l-.518 2.077 1.27.316.525-2.103c2.163.41 3.79.245 4.475-1.72.55-1.58-.028-2.493-1.168-3.088.83-.192 1.458-.74 1.625-1.87zM15.2 15.3c-.392 1.575-3.042.724-3.902.51l.696-2.79c.86.215 3.617.64 3.206 2.28zm.393-3.502c-.357 1.433-2.567.705-3.283.527l.63-2.53c.716.18 3.023.514 2.653 2.003z"/>
                    </svg>
                  </div>
                  {/* Orbiting coins */}
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-primary border-2 border-primary/50 flex items-center justify-center font-bold text-black animate-float" style={{ animationDelay: '0.2s' }}>
                    ₿
                  </div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-yellow-300 border-2 border-yellow-400/50 flex items-center justify-center font-bold text-black animate-float" style={{ animationDelay: '0.7s' }}>
                    $
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom yellow banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-black">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <p className="text-sm font-semibold">
              Optcoin demonstrates commitment to legal and transparent operations through MSB registration
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
