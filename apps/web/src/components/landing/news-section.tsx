"use client";

import Link from 'next/link';

interface NewsArticle {
  date: string;
  title: string;
  excerpt: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    date: '06/11/2025',
    title: 'Hualun AI: Bitcoin volatility continues; five crypto stocks worth watching.',
    excerpt: 'Investing.com – Despite market volatility, the cryptocurrency sector continues to attract investor attention, with several publicly traded companies offering digital asset investment opportunities...',
  },
  {
    date: '06/11/2025',
    title: 'EOS rose 10%',
    excerpt: 'According to Investing.com Index data, EOS was trading around 0.6500 (1,020.00 CNY) on Wednesday for a gain of 10.1%, marking its largest daily increase since November 5, 2025. This surge...',
  },
  {
    date: '23/09/2025',
    title: "Jiuzi Holdings' stock surges after announcing $1 billion cryptocurrency investment",
    excerpt: 'Jiuzi Holdings, Inc. (NASDAQ: JZXN) saw its shares surge 55.5% in pre-market trading on Wednesday after the company announced a new crypto asset investment policy, authorizing the allocation...',
  },
];

export function NewsSection() {
  return (
    <section className="py-16 bg-background-elevated">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">News and information</h2>
          <Link href="/news" className="text-sm text-foreground-dimmed hover:text-primary transition-colors">
            See more →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEWS_ARTICLES.map((article, index) => (
            <div key={index} className="card-dark card-hover p-6 flex flex-col h-full">
              <p className="text-sm text-foreground-dimmed mb-3">{article.date}</p>
              
              <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-sm text-foreground-dimmed mb-6 flex-grow line-clamp-3">
                {article.excerpt}
              </p>
              
              <button className="w-full py-3 rounded border-2 border-primary text-primary hover:bg-primary hover:text-black transition-all font-semibold">
                check the details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
