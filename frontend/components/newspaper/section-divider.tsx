"use client";

export function SectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="my-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="h-px flex-1 max-w-[120px] bg-[var(--border-color)]" />
        <div className="w-2 h-2 rotate-45 border-2 border-gold" />
        <h2 className="font-display text-2xl sm:text-3xl font-black text-ink uppercase tracking-[0.12em]">
          {title}
        </h2>
        <div className="w-2 h-2 rotate-45 border-2 border-gold" />
        <div className="h-px flex-1 max-w-[120px] bg-[var(--border-color)]" />
      </div>
      {subtitle && <p className="font-body italic text-sm text-ink-soft">{subtitle}</p>}
    </div>
  );
}
