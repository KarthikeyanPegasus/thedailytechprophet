import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(d);
}

export function getEditionNumber(): number {
  const start = new Date("2025-01-01");
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

// Build a readable newspaper excerpt from an article. Prefers the first
// sentence of the content field, falls back to summary, and strips HTML.
export function articleExcerpt(article: { summary?: string; content?: string }, maxChars = 180): string {
  const raw = (article.content || article.summary || "").trim();
  if (!raw) return "";

  // Strip HTML tags if any leaked through.
  const stripped = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // Try to take the first sentence, then extend to maxChars if needed.
  const firstSentenceMatch = stripped.match(/^[^.!?]+[.!?]+/);
  let excerpt = firstSentenceMatch ? firstSentenceMatch[0].trim() : stripped;

  // If first sentence is very short, append more sentences up to maxChars.
  if (excerpt.length < 60) {
    const sentences = stripped.match(/[^.!?]+[.!?]+/g) || [];
    let combined = excerpt;
    for (let i = 1; i < sentences.length; i++) {
      const next = sentences[i].trim();
      if (combined.length + next.length + 1 > maxChars) break;
      combined += " " + next;
    }
    excerpt = combined;
  }

  // Hard cap with word boundary.
  if (excerpt.length > maxChars) {
    const cut = excerpt.lastIndexOf(" ", maxChars);
    excerpt = excerpt.slice(0, cut > 0 ? cut : maxChars) + "…";
  }

  return excerpt;
}

// Build a longer excerpt that includes the full first paragraph (or up to
// maxChars), used by section/category cards so readers can see more of the
// article body in the column flow.
export function articleFirstParagraph(
  article: { summary?: string; content?: string },
  maxChars = 280,
): string {
  const raw = (article.content || article.summary || "").trim();
  if (!raw) return "";

  // Strip HTML if any leaked through.
  const stripped = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // Prefer a real paragraph break if content has one.
  const paraBreak = stripped.split(/\n{2,}|(?=\r\n\r\n)/)[0]?.trim() || stripped;

  // Otherwise, take the first 2-3 sentences.
  const sentences = stripped.match(/[^.!?]+[.!?]+/g) || [stripped];
  let excerpt = sentences[0]?.trim() || "";
  for (let i = 1; i < sentences.length; i++) {
    const next = sentences[i].trim();
    if (excerpt.length + next.length + 1 > maxChars) break;
    excerpt += " " + next;
    if (excerpt.length >= 120) break;
  }
  // If the first sentence alone is already long enough, fall back to it.
  if (excerpt.length < 60 && paraBreak.length > excerpt.length) {
    excerpt = paraBreak;
  }

  // Hard cap with word boundary.
  if (excerpt.length > maxChars) {
    const cut = excerpt.lastIndexOf(" ", maxChars);
    excerpt = excerpt.slice(0, cut > 0 ? cut : maxChars) + "…";
  }
  return excerpt;
}

// Clamp a headline to a readable length for card/list views.
export function headlineClamp(title: string, maxChars = 120): string {
  if (title.length <= maxChars) return title;
  const cut = title.lastIndexOf(" ", maxChars);
  return title.slice(0, cut > 0 ? cut : maxChars) + "…";
}
