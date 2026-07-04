"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/types";
import { LivingIllustration } from "@/components/images/illustration-picker";
import { timeAgo } from "@/lib/utils";
import { OrnateFrame } from "./ornate-frame";

interface FrontPageHeroProps {
  article: Article;
}

export function FrontPageHero({ article }: FrontPageHeroProps) {
  const category = article.categories[0]?.replace(/-/g, " ") ?? "Dispatch";

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-4 relative"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="h-px flex-1 bg-[var(--border-color)]" />
        <span className="newspaper-stamp text-xs">{category}</span>
        <div className="h-px flex-1 bg-[var(--border-color)]" />
      </div>

      <h1 className="headline-masthead text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center text-ink mb-2 leading-[0.88]">
        <Link href={`/article/${article.id}`} className="hover:text-brown transition-colors">
          {article.title.toUpperCase()}
        </Link>
      </h1>

      <p className="font-body text-sm sm:text-base md:text-lg text-center italic text-ink-soft max-w-3xl mx-auto mb-2 leading-snug">
        {article.summary}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 text-[10px] font-sans uppercase tracking-[0.12em] text-ink-faded border-y border-[var(--border-color)] py-1 max-w-2xl mx-auto mb-3">
        <span>San Francisco</span>
        <span className="text-gold">·</span>
        <span>By {article.author}</span>
        <span className="text-gold">·</span>
        <span>{timeAgo(article.published_at)}</span>
        <span className="text-gold">·</span>
        <span>{article.read_time} min read</span>
        <span className="text-gold">·</span>
        <span className="font-black">Page 1</span>
      </div>

      <div className="article-hero-wrap">
        <blockquote className="pull-quote !text-base sm:!text-lg !py-2 !px-3 !my-0 !mb-3">
          “{article.summary.slice(0, 160)}{article.summary.length > 160 ? "…" : ""}”
        </blockquote>

        <figure className="article-hero-figure">
          <OrnateFrame
            caption={`${category.toUpperCase()} DISPATCH — THE DAILY TECH PROPHET`}
            className="p-1"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 border-4 border-double border-[var(--border-color)] pointer-events-none" />
              <div className="absolute inset-2 border border-[var(--border-color)] opacity-50 pointer-events-none" />
              <div className="relative w-full h-full">
                <LivingIllustration article={article} imageUrl={article.image_url} className="w-full h-full" />
              </div>
            </div>
          </OrnateFrame>
        </figure>

        <div className="newspaper-flow-tight body-text text-justify">
          <p className="drop-cap mb-3">
            {article.content || article.summary}
          </p>
        </div>

        <div className="clear-both continued-marker text-[10px] mt-2">
          Continued on page 2
        </div>
      </div>
    </motion.article>
  );
}
