"use client";

export function SideNote({ children, title = "Did you know?" }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="vintage-card bg-parchment-dark/40 dark:bg-[var(--color-dark-paper-light)] p-4 my-6">
      <div className="text-xs uppercase tracking-widest font-sans font-bold text-gold mb-2">{title}</div>
      <div className="font-body text-sm text-ink-soft leading-relaxed">{children}</div>
    </aside>
  );
}
