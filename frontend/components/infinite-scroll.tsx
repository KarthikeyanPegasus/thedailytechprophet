"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Article } from "@/types";
import { fetchNews } from "@/lib/api";
import { ArticleCard } from "@/components/articles/article-card";

interface InfiniteScrollProps {
  category?: string;
  initialArticles: Article[];
}

export function InfiniteScroll({ category = "", initialArticles }: InfiniteScrollProps) {
  const [articles, setArticles] = useState<Article[]>(() => {
    // De-duplicate initial articles by id
    const seen = new Set<string>();
    return initialArticles.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  });
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, category, articles]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const data = await fetchNews({ category, page, pageSize: 12 });
      if (data.articles.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => {
          const seen = new Set(prev.map((a) => a.id));
          const unique = data.articles.filter((a) => !seen.has(a.id));
          return [...prev, ...unique];
        });
        setPage((p) => p + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <ArticleCard key={`${article.id}-${i}`} article={article} index={i % 6} />
        ))}
      </div>

      <div ref={loaderRef} className="py-8 flex flex-col items-center justify-center">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 font-body italic text-ink-soft"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.1s]" />
            <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
            Fetching more dispatches…
          </motion.div>
        )}
        {!hasMore && (
          <div className="ornament-divider text-gold text-xl w-full max-w-md">
            <span>End of Edition</span>
          </div>
        )}
      </div>
    </>
  );
}
