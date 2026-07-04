"use client";

import type { Article } from "@/types";

/**
 * EditorsDispatch — dynamic editorial written in newspaper style,
 * generated from the top articles' categories and themes.
 * Feels handwritten by the editor using Old Standard TT italic.
 */
export function EditorsDispatch({ articles }: { articles: Article[] }) {
  const topCategories = Array.from(
    new Set(articles.slice(0, 15).flatMap((a) => a.categories.slice(0, 2)))
  )
    .slice(0, 5)
    .map((c) => c.replace(/-/g, " "))
    .map((c) => c.charAt(0).toUpperCase() + c.slice(1));

  // Build a dynamic dispatch text from available categories
  const categoryList = topCategories.join(", ");
  const hasAI = topCategories.some((c) => c.includes("AI") || c.includes("Artificial"));
  const hasSpace = topCategories.some((c) => c.includes("Space") || c.includes("Rocket"));
  const hasSecurity = topCategories.some((c) => c.includes("Security") || c.includes("Cyber"));
  const hasCloud = topCategories.some((c) => c.includes("Cloud") || c.includes("Infrastructure"));

  const themes: string[] = [];
  if (hasAI) themes.push("the relentless march of artificial intelligence");
  if (hasSpace) themes.push("the renewed conquest of the heavens");
  if (hasSecurity) themes.push("the ever-shifting battlements of cybersecurity");
  if (hasCloud) themes.push("the quiet consolidation of cloud infrastructure");

  const themeText = themes.length > 0
    ? themes.length === 1
      ? themes[0]
      : themes.slice(0, -1).join(", ") + ", and " + themes[themes.length - 1]
    : "the changing landscape of technology";

  const dispatchText = `Today's edition explores ${themeText}, with dispatches from laboratories, launchpads, and datacentres across the realm. Our correspondents report on developments in ${categoryList.toLowerCase()}. The presses have been running since dawn.`;

  return (
    <div className="editors-dispatch">
      <div className="editors-dispatch-title">Editor&apos;s Dispatch</div>
      <p className="editors-dispatch-body">{dispatchText}</p>
      <p className="editors-dispatch-signature">— The Editorial Board</p>
    </div>
  );
}