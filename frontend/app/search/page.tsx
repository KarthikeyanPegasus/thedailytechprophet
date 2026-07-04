"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/articles/article-card";
import { searchArchives, type SearchResult } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const fullPlaceholder = "Search the Archives…";

  // Typewriter placeholder effect
  useEffect(() => {
    let i = 0;
    let deleting = false;
    let current = "";
    const type = () => {
      if (!deleting) {
        current = fullPlaceholder.slice(0, i++);
        if (i > fullPlaceholder.length) {
          deleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else {
        current = fullPlaceholder.slice(0, i--);
        if (i < 0) {
          deleting = false;
          i = 0;
          setTimeout(type, 500);
          return;
        }
      }
      setPlaceholder(current + (deleting ? "" : "|"));
      setTimeout(type, deleting ? 30 : 80);
    };
    type();
    return () => {};
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const performSearch = async (q: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchArchives(q);
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) performSearch(query);
  };

  return (
    <div className="min-h-screen paper-texture paper-edges">
      <Masthead />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="page-header mb-8">
          <h1 className="text-3xl sm:text-4xl text-ink">Search the Archives</h1>
          <p className="font-body italic text-ink-soft">Every headline, byline, and dispatch since Vol. I.</p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              ref={inputRef}
              id="archive-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder.replace(/\|$/, "")}
              className="archive-input w-full pl-12 pr-12 py-3 bg-parchment dark:bg-[var(--color-dark-paper-light)] border-2 border-[var(--border-color)] font-display text-lg text-ink placeholder:text-ink-faded/40 focus:outline-none focus:border-gold transition-colors"
              style={{ caretColor: "var(--color-brown-deep)" }}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-ink-faded hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Result count line */}
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mt-3 font-sans text-xs uppercase tracking-widest text-ink-faded"
              >
                {loading ? "Searching the stacks…" : `Found ${results?.length || 0} result${(results?.length || 0) === 1 ? "" : "s"} for "${query}"`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {loading && (
          <div className="text-center font-body italic text-ink-soft mb-6">
            Searching dusty shelves…
          </div>
        )}

        {hasSearched && !loading && (results?.length || 0) === 0 && (
          <div className="text-center py-8">
            <p className="font-display text-xl text-ink mb-2">No dispatches found.</p>
            <p className="font-body text-ink-soft mb-6">Try a broader term or check the spelling.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border-color)] font-sans text-xs uppercase tracking-widest text-ink hover:bg-gold transition-colors">
              Return to Front Page
            </Link>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="newspaper-columns-tight newspaper-flow-tight">
            {results.map(({ article }, i) => (
              <div key={article.id} className="search-ink-result" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <ArticleCard article={article} index={i} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}