"use client";

interface FootnoteItem {
  marker: string;
  text: string;
}

/**
 * Footnote — numbered footnotes with old-newspaper reference style.
 * Displayed as a horizontal row of small references after article body.
 */
export function Footnote({ items }: { items: FootnoteItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="footnote" aria-label="Footnotes">
      {items.map((item, i) => (
        <span key={i} className="footnote-item">
          <span className="footnote-marker">{item.marker}</span>
          <span>{item.text}</span>
        </span>
      ))}
    </div>
  );
}