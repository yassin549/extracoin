'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-black font-bold text-xl">O</span>
          </div>
          <span className="text-xl font-bold text-white uppercase tracking-wide">OPT COIN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/futures"
            className="text-sm font-medium text-foreground-dimmed hover:text-white transition-colors"
          >
            Futures
          </Link>
          <Link
            href="/perpetual"
            className="text-sm font-medium text-foreground-dimmed hover:text-white transition-colors"
          >
            Perpetual
          </Link>
          <Link
            href="/asset"
            className="text-sm font-medium text-foreground-dimmed hover:text-white transition-colors"
          >
            Asset
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-sm text-foreground-dimmed hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            <span>Log in / Register</span>
          </button>
          <select className="bg-background-elevated text-white border border-white/10 rounded px-3 py-1 text-sm">
            <option>ENGLISH</option>
            <option>中文</option>
            <option>Español</option>
          </select>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background-elevated animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block py-2 text-sm font-medium text-white hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/futures"
              className="block py-2 text-sm font-medium text-foreground-dimmed hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Futures
            </Link>
            <Link
              href="/perpetual"
              className="block py-2 text-sm font-medium text-foreground-dimmed hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Perpetual
            </Link>
            <Link
              href="/asset"
              className="block py-2 text-sm font-medium text-foreground-dimmed hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Asset
            </Link>
            <div className="pt-4 space-y-2 border-t border-white/10">
              <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in / Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
