"use client";

import type { Article } from "@/types";
import { LivingIllustration } from "@/components/images/illustration-picker";
import { useLazyIllustration } from "@/hooks/use-lazy-illustration";
import { timeAgo, articleFirstParagraph, headlineClamp } from "@/lib/utils";
import Link from "next/link";

interface NewspaperSectionProps {
  title?: string;
  subtitle?: string;
  articles: Article[];
  columns?: number;
  showImages?: boolean;
  className?: string;
  variant?: "front" | "opinion" | "default";
  pageNumber?: string;
  compact?: boolean;
}

export function NewspaperSection({
  title,
  subtitle,
  articles,
  columns = 3,
  showImages = true,
  className = "",
  variant = "default",
  pageNumber,
  compact = false,
}: NewspaperSectionProps) {
  return (
    <section className={`mb-3 ${className}`}>
      {(title || subtitle) && (
        <div className="newspaper-section-banner">
          <div className="text-center flex-1">
            {title && <h2 className="banner-title">{title}</h2>}
            {subtitle && <p className="font-body italic text-[10px] text-ink-soft mt-0.5">{subtitle}</p>}
          </div>
          {pageNumber && <span className="banner-page">Page {pageNumber}</span>}
        </div>
      )}

      <div className="newspaper-flow-readable" style={{ columnCount: columns }}>
        {articles.map((article, i) => {
          const isFiller = compact && i > 2 && i % 5 === 0;
          const isFirst = i === 0;

          return (
            <NewspaperStory
              key={article.id}
              article={article}
              index={i}
              showImage={showImages && (isFirst || i % 7 === 0)}
              variant={variant}
              compact={compact}
              isFiller={isFiller}
            />
          );
        })}
      </div>
    </section>
  );
}

function NewspaperStory({
  article,
  showImage,
  variant,
  compact,
  isFiller,
}: {
  article: Article;
  index: number;
  showImage: boolean;
  variant: "front" | "opinion" | "default";
  compact: boolean;
  isFiller: boolean;
}) {
  const excerpt = articleFirstParagraph(article, compact ? 220 : 280);
  const { ref: illRef, shouldRender, isVisible } = useLazyIllustration<HTMLDivElement>();

  if (isFiller && compact) {
    return (
      <div className="newspaper-filler">
        <div className="filler-title">
          <Link href={`/article/${article.id}`} className="hover:text-brown transition-colors">
            {headlineClamp(article.title, 90)}
          </Link>
        </div>
        <div className="filler-byline">
          {article.author} · {timeAgo(article.published_at)}
        </div>
      </div>
    );
  }

  return (
    <article className="newspaper-story-readable break-inside-avoid"
    >
      <div className="kicker text-[var(--ink)] mb-1" style={{ fontSize: "0.65rem" }}>
        {article.categories.slice(0, 2).map((cat) => cat.replace(/-/g, " ")).join(" · ")}
      </div>

      <div className="flex items-start gap-2">
        {showImage && (
          <div ref={illRef} className={`inline-illustration flex-shrink-0 ${isVisible ? "" : "paused-anim"}`} style={{ width: "44px", height: "44px" }}>
            {shouldRender ? (
              <LivingIllustration article={article} imageUrl={article.image_url} className="w-full h-full" />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        )}
        <h3
          className={`headline text-ink hover:text-brown transition-colors leading-[1.1] ${
            variant === "opinion"
              ? "text-[0.95rem] sm:text-base"
              : compact
              ? "text-[0.95rem] sm:text-lg"
              : "text-lg sm:text-xl"
          }`}
        >
          <Link href={`/article/${article.id}`} className="focus:outline-none">
            {headlineClamp(article.title, compact ? 110 : 140)}
          </Link>
        </h3>
      </div>

      <p className="body-text text-ink-soft mt-1.5" style={{ fontSize: compact ? "0.85rem" : "0.9rem", lineHeight: 1.55 }}
      >
        {excerpt}
      </p>

      <p className="byline-text" style={{ marginTop: "0.3rem", paddingTop: "0.25rem" }}>
        <span>By {article.author}</span>
        <span>{timeAgo(article.published_at)} · {article.read_time}m</span>
      </p>
    </article>
  );
}
