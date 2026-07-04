"use client";

interface FigureCaptionProps {
  number?: string;
  children: React.ReactNode;
}

/**
 * FigureCaption — "FIG. I — [description]" style caption for illustrations.
 * Includes figure number in gold, description in faded uppercase.
 */
export function FigureCaption({ number = "I", children }: FigureCaptionProps) {
  return (
    <figcaption className="figure-caption">
      <span className="figure-number">FIG. {number}</span>
      {" — "}
      {children}
    </figcaption>
  );
}