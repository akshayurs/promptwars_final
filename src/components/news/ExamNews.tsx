import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useStore } from '@/lib/store';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  exam: string;
  link?: string;
}

export interface RSSItem {
  guid?: string;
  title: string;
  pubDate: string;
  link: string;
}

const CACHE_KEY = 'pebbl_news_cache';
const READ_NEWS_KEY = 'pebbl_read_news';
const CACHE_DURATION = 60 * 1000; // 60 seconds

export function ExamNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const { profile } = useStore();

  useEffect(() => {
    const savedReadIds = localStorage.getItem(READ_NEWS_KEY);
    if (savedReadIds) {
      try {
        setReadIds(new Set(JSON.parse(savedReadIds)));
      } catch (e) {}
    }
  }, []);

  const markAsRead = (id: string) => {
    if (!readIds.has(id)) {
      const newReadIds = new Set(readIds);
      newReadIds.add(id);
      setReadIds(newReadIds);
      localStorage.setItem(READ_NEWS_KEY, JSON.stringify(Array.from(newReadIds)));
    }
  };

  const fetchNews = async (forceRefetch = false) => {
    setIsFetching(true);
    try {
      if (!forceRefetch) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setNews(data);
            setIsFetching(false);
            return;
          }
        }
      }

      // Fetch real education news via RSS to JSON API
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeeds/913168846.cms');
      const json = await res.json();
      
      if (json.items && json.items.length > 0) {
        const targetExams = profile?.targetExams || ['GENERAL'];
        
        const formattedNews = json.items.slice(0, 10).map((item: RSSItem, index: number) => {
          let assignedExam = 'GENERAL';
          const titleUpper = item.title.toUpperCase();
          if (titleUpper.includes('JEE')) assignedExam = 'JEE';
          else if (titleUpper.includes('NEET')) assignedExam = 'NEET';
          else if (titleUpper.includes('UPSC')) assignedExam = 'UPSC';
          else assignedExam = targetExams[index % targetExams.length] || 'EDUCATION';

          return {
            id: item.guid || String(index),
            title: item.title,
            date: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            exam: assignedExam,
            link: item.link
          };
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: formattedNews, timestamp: Date.now() }));
        setNews(formattedNews);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [profile?.targetExams]);

  return (
    <Card variant="accent" className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-4 border-b border-accent/30 pb-3">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <AlertCircle className="text-accent-foreground w-5 h-5" /> Exam Radar
        </h3>
        <button 
          onClick={() => fetchNews(true)} 
          disabled={isFetching}
          className="p-2 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors"
          title="Force Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-accent-foreground ${isFetching ? 'animate-spin opacity-50' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {isFetching ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel p-4 rounded-xl border border-white/10 dark:border-white/5 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-5 w-16 bg-white/20 dark:bg-white/10 rounded-full"></div>
                  <div className="h-3 w-12 bg-white/20 dark:bg-white/10 rounded-full"></div>
                </div>
                <div className="h-4 w-full bg-white/20 dark:bg-white/10 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-white/20 dark:bg-white/10 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {news.map(item => {
              const isUnread = !readIds.has(item.id);
              return (
                <a 
                  key={item.id} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => markAsRead(item.id)}
                  className={`block glass-panel p-4 hover:bg-white/40 dark:hover:bg-black/40 transition-all rounded-xl border ${
                    isUnread ? 'border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'border-white/10 dark:border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" title="New" />
                      )}
                      <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {item.exam}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">{item.date}</span>
                  </div>
                  <p className={`text-sm leading-snug line-clamp-2 ${isUnread ? 'font-bold' : 'font-medium opacity-80'}`}>
                    {item.title}
                  </p>
                </a>
              );
            })}
            {news.length === 0 && (
              <div className="text-center text-sm font-medium text-foreground/50 py-8">
                No updates found.
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
