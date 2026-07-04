"use client";

type OrnamentVariant =
  | "flourish"
  | "separator"
  | "stars"
  | "diamond"
  | "double-rule"
  | "fleuron"
  | "quill-mark"
  | "compass"
  | "crest";

const ORNAMENTS: Record<OrnamentVariant, string> = {
  flourish: "❦",
  separator: "✦",
  stars: "✦ ✦ ✦",
  diamond: "◆",
  "double-rule": "§",
  fleuron: "❧",
  "quill-mark": "✑",
  compass: "✛",
  crest: "❖",
};

interface DecorativeOrnamentProps {
  variant?: OrnamentVariant;
  className?: string;
  withLines?: boolean;
}

/**
 * DecorativeOrnament — Victorian ornamental element inserted between
 * newspaper sections. Never uses emojis. Uses Unicode ornamental
 * characters consistent with the newspaper aesthetic.
 */
export function DecorativeOrnament({
  variant = "flourish",
  className = "",
  withLines = true,
}: DecorativeOrnamentProps) {
  const symbol = ORNAMENTS[variant] ?? ORNAMENTS.flourish;

  if (variant === "stars") {
    return <div className={`star-ornament ${className}`} aria-hidden="true">{symbol}</div>;
  }

  if (withLines) {
    return (
      <div className={`ink-separator ${className}`} aria-hidden="true">
        <span>{symbol}</span>
      </div>
    );
  }

  return (
    <div className={`victorian-ornament ${className}`} aria-hidden="true">
      <span className="victorian-ornament-cluster">{symbol}</span>
    </div>
  );
}