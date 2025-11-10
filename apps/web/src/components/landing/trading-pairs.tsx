"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface TradingPair {
  symbol: string;
  icon: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

const MOCK_PAIRS: TradingPair[] = [
  { symbol: 'BTCUSDT', icon: '₿', price: 105637.12, change24h: 0.87, sparkline: [100, 102, 98, 103, 105, 102, 106] },
  { symbol: 'ETHUSDT', icon: 'Ξ', price: 3539.32, change24h: -1.23, sparkline: [100, 95, 92, 90, 88, 85, 82] },
  { symbol: 'ADAUSDT', icon: 'Ada', price: 0.5865, change24h: 1.31, sparkline: [100, 98, 102, 105, 103, 106, 108] },
  { symbol: 'BCHUSDT', icon: 'BCH', price: 509.09, change24h: 1.10, sparkline: [100, 102, 101, 103, 105, 104, 106] },
];

const GAINER_PAIRS: TradingPair[] = [
  { symbol: 'XRPUSDT', icon: 'XRP', price: 2.5503, change24h: 7.74, sparkline: [100, 105, 108, 112, 115, 118, 120] },
  { symbol: 'TRXUSDT', icon: 'TRX', price: 0.29556, change24h: 1.71, sparkline: [100, 102, 104, 103, 105, 107, 108] },
  { symbol: 'ADAUSDT', icon: 'Ada', price: 0.5865, change24h: 1.31, sparkline: [100, 102, 103, 105, 104, 106, 107] },
  { symbol: 'BCHUSDT', icon: 'BCH', price: 509.09, change24h: 1.10, sparkline: [100, 101, 103, 102, 104, 105, 106] },
];

function SparklineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="20" className="inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

function TradingPairCard({ pair }: { pair: TradingPair }) {
  const isPositive = pair.change24h >= 0;
  
  return (
    <div className="card-dark card-hover p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/30">
          {pair.icon}
        </div>
        <div>
          <p className="font-semibold text-white">{pair.symbol}</p>
          <p className="text-sm text-foreground-dimmed">{pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <SparklineChart 
          data={pair.sparkline} 
          color={isPositive ? '#22C55E' : '#DC2626'} 
        />
        
        <div className={`flex items-center gap-1 px-3 py-1 rounded ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-semibold">{isPositive ? '+' : ''}{pair.change24h}%</span>
        </div>
        
        <Link href={`/trade/${pair.symbol}`}>
          <button className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-black transition-all font-semibold">
            Trade
          </button>
        </Link>
      </div>
    </div>
  );
}

export function TradingPairs() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Trade</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Popular Contracts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Popular Contracts</h3>
              <Link href="/markets" className="text-sm text-foreground-dimmed hover:text-primary transition-colors">
                See more →
              </Link>
            </div>
            
            <div className="space-y-4">
              {MOCK_PAIRS.map((pair) => (
                <TradingPairCard key={pair.symbol} pair={pair} />
              ))}
            </div>
          </div>
          
          {/* Gainer List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Gainer list</h3>
              <Link href="/markets" className="text-sm text-foreground-dimmed hover:text-primary transition-colors">
                See more →
              </Link>
            </div>
            
            <div className="space-y-4">
              {GAINER_PAIRS.map((pair) => (
                <TradingPairCard key={pair.symbol} pair={pair} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
