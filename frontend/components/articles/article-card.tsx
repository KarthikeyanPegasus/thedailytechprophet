"use client";

import { memo } from "react";
import Link from "next/link";
import type { Article } from "@/types";
import { LivingIllustration } from "@/components/images/illustration-picker";
import { useLazyIllustration } from "@/hooks/use-lazy-illustration";
import { timeAgo, articleFirstParagraph, headlineClamp } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "vertical";
  index?: number;
}

function ArticleCardImpl({ article, variant = "default", index = 0 }: ArticleCardProps) {
  const isCompact = variant === "compact";
  const excerpt = articleFirstParagraph(article, isCompact ? 180 : 240);
  const { ref: illRef, shouldRender, isVisible } = useLazyIllustration<HTMLDivElement>();

  return (
    <article
      className="newspaper-story break-inside-avoid"
    >
      <p className="kicker text-[var(--ink)] mb-0.5">
        {article.categories.slice(0, 2).map((cat) => cat.replace(/-/g, " ")).join(" · ")}
      </p>

      <div className="flex items-start gap-2">
        {!isCompact && (
          <div ref={illRef} className={`inline-illustration flex-shrink-0 ${isVisible ? "" : "paused-anim"}`}>
            {shouldRender ? (
              <LivingIllustration article={article} imageUrl={article.image_url} className="w-full h-full" />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        )}
        <h3
          className={`headline text-ink hover:text-brown transition-colors flex-1 min-w-0 leading-[1.1] ${
            isCompact ? "text-[0.9rem]" : "text-lg sm:text-xl"
          }`}
        >
          <Link href={`/article/${article.id}`} className="focus:outline-none">
            {headlineClamp(article.title, isCompact ? 100 : 130)}
          </Link>
        </h3>
      </div>

      <p
        className="body-text text-ink-soft mt-2"
        style={{ fontSize: isCompact ? "0.78rem" : "0.85rem", lineHeight: 1.55 }}
      >
        {excerpt}
      </p>

      <p className="byline-text">
        <span>By {article.author}</span>
        <span>{timeAgo(article.published_at)} · {article.read_time}m</span>
      </p>
    </article>
  );
}

export const ArticleCard = memo(ArticleCardImpl);
