"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// Mock market data - in production, fetch from API
const MOCK_MARKETS: MarketData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change: 1234.20, changePercent: 1.87 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -45.30, changePercent: -1.29 },
  { symbol: 'EUR/USD', name: 'Euro', price: 1.0876, change: 0.0023, changePercent: 0.21 },
  { symbol: 'GBP/USD', name: 'Pound', price: 1.2654, change: -0.0012, changePercent: -0.09 },
  { symbol: 'GOLD', name: 'Gold', price: 2034.20, change: 12.40, changePercent: 0.61 },
  { symbol: 'SP500', name: 'S&P 500', price: 4567.89, change: 23.45, changePercent: 0.52 },
  { symbol: 'BNB', name: 'Binance', price: 312.45, change: 5.67, changePercent: 1.85 },
  { symbol: 'SOL', name: 'Solana', price: 98.76, change: -2.34, changePercent: -2.31 },
];

function MarketItem({ market }: { market: MarketData }) {
  const isPositive = market.change >= 0;
  
  return (
    <div className="inline-flex items-center gap-4 px-6 py-3 glass rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer touch-interactive min-w-[240px]">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-foreground text-sm">{market.symbol}</span>
          <span className="text-xs text-foreground-dimmed">{market.name}</span>
        </div>
        <div className="text-lg font-semibold text-foreground group-hover:gradient-text transition-all">
          ${market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span className="text-xs font-semibold">
          {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export function MarketTicker() {
  const [markets, setMarkets] = useState<MarketData[]>(MOCK_MARKETS);
  const [isPaused, setIsPaused] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setMarkets(prev => prev.map(market => {
        const randomChange = (Math.random() - 0.5) * market.price * 0.001;
        const newPrice = market.price + randomChange;
        const change = newPrice - (market.price - market.change);
        const changePercent = (change / market.price) * 100;
        
        return {
          ...market,
          price: newPrice,
          change,
          changePercent,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="relative w-full overflow-hidden py-4 bg-background-elevated/50 border-y border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex gap-4 animate-scroll-infinite">
        {/* Duplicate markets for seamless loop */}
        {[...markets, ...markets].map((market, index) => (
          <MarketItem key={`${market.symbol}-${index}`} market={market} />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-infinite {
          display: flex;
          animation: scroll-infinite 40s linear infinite;
        }
        
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
