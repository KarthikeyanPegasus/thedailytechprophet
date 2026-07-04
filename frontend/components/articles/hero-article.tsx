"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import { LivingIllustration } from "@/components/images/illustration-picker";
import { timeAgo } from "@/lib/utils";

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="group relative victorian-border bg-parchment-light/40 dark:bg-[var(--color-dark-paper-light)]/30 overflow-hidden"
    >
      <div className="p-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image side */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden border-r-0 lg:border-r border-[var(--border-color)]">
            <LivingIllustration article={article} imageUrl={article.image_url} className="w-full h-full" />
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-ink text-parchment text-[10px] uppercase tracking-[0.2em] font-sans font-black">
              Front Page
            </div>
          </div>

          {/* Text side */}
          <div className="p-6 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 border-[var(--border-color)]">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.15em] font-sans font-bold text-ink-faded">
              {article.categories.slice(0, 2).map((cat) => (
                <span key={cat} className="text-gold border border-gold/50 px-1.5 py-0.5">{cat.replace(/-/g, " ")}</span>
              ))}
              <span>• {timeAgo(article.published_at)}</span>
            </div>

            <h2 className="headline-article text-4xl sm:text-5xl lg:text-6xl text-ink mb-5 group-hover:text-brown transition-colors leading-[0.95]">
              <Link href={`/article/${article.id}`} className="focus:outline-none focus:underline">
                {article.title}
              </Link>
            </h2>

            <p className="font-body text-lg leading-relaxed text-ink-soft mb-6">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-sans text-ink-faded mb-6 border-t border-[var(--border-color)]/50 pt-4">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gold" /> {article.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold" /> {article.read_time} min read</span>
            </div>

            <Link
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-2 self-start px-5 py-2.5 border-2 border-[var(--border-color)] font-sans text-xs uppercase tracking-[0.15em] font-bold text-ink hover:bg-gold hover:text-ink hover:border-gold transition-all group/link"
            >
              Read Full Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
