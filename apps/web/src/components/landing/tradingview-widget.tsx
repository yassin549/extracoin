"use client";

import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  height?: number;
}

function TradingViewWidgetComponent({ 
  symbol = 'BINANCE:BTCUSDT', 
  theme = 'dark',
  height = 500 
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || !containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: theme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(6, 8, 13, 0)',
      gridColor: 'rgba(255, 255, 255, 0.06)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: 'tradingview_widget',
      height: height,
    });

    containerRef.current.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      scriptLoadedRef.current = false;
    };
  }, [symbol, theme, height]);

  return (
    <div className="tradingview-widget-container w-full rounded-2xl overflow-hidden glass-strong">
      <div id="tradingview_widget" ref={containerRef} style={{ height: `${height}px` }} />
    </div>
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
