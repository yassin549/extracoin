"use client";

import { useEffect, useRef, memo } from 'react';

interface MiniChartProps {
  symbol?: string;
  width?: number | string;
  height?: number;
}

function MiniChartComponent({ 
  symbol = 'BINANCE:BTCUSDT',
  width = '100%',
  height = 300
}: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      height: height,
      locale: 'en',
      dateRange: '12M',
      colorTheme: 'dark',
      trendLineColor: 'rgba(59, 130, 246, 1)',
      underLineColor: 'rgba(59, 130, 246, 0.3)',
      underLineBottomColor: 'rgba(59, 130, 246, 0)',
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, width, height]);

  return (
    <div className="tradingview-widget-container rounded-xl overflow-hidden">
      <div ref={containerRef} />
    </div>
  );
}

export const MiniChart = memo(MiniChartComponent);
