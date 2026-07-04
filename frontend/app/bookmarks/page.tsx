"use client";

import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ArticleCard } from "@/components/articles/article-card";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useBookmarks } from "@/hooks/use-storage";
import Link from "next/link";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="min-h-screen paper-texture paper-edges">
      <Masthead />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="page-header mb-8">
          <h1 className="text-3xl sm:text-4xl text-ink">Saved for Later</h1>
          <p className="font-body italic text-ink-soft">Clippings kept in your private reading drawer.</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-xl text-ink mb-2">No saved articles yet.</p>
            <p className="font-body text-ink-soft mb-6">Press "b" while reading, or click the bookmark icon.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border-color)] font-sans text-xs uppercase tracking-widest text-ink hover:bg-gold transition-colors">
              Browse the Front Page
            </Link>
          </div>
        ) : (
          <div className="newspaper-columns-tight newspaper-flow-tight">
            {bookmarks.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}