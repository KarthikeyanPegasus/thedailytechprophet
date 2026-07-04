"use client";

import Link from "next/link";
import type { Article } from "@/types";
import { timeAgo, articleFirstParagraph } from "@/lib/utils";

interface SideNotesProps {
  articles: Article[];
}

export function SideNotes({ articles }: SideNotesProps) {
  const notes = articles.slice(0, 6);

  return (
    <div className="newspaper-box">
      <div className="newspaper-box-title" style={{ fontSize: "0.75rem" }}>Notes & Notices</div>
      <div className="space-y-1">
        {notes.map((article) => (
          <div key={article.id} className="border-b border-dotted border-[var(--border-color)]/40 pb-1.5 last:border-b-0 last:pb-0">
            <h4 className="font-display text-[11px] font-bold text-ink leading-tight hover:text-brown transition-colors">
              <Link href={`/article/${article.id}`}>{article.title}</Link>
            </h4>
            <span className="dateline block" style={{ fontSize: "0.55rem" }}>
              {article.categories[0].replace(/-/g, " ")} · {timeAgo(article.published_at)}
            </span>
            <p className="font-body text-[10px] text-ink-soft mt-0.5 leading-snug">
              {articleFirstParagraph(article, 140)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
