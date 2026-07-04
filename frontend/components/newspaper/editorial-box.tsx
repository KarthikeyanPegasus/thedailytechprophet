"use client";

export function EditorialBox() {
  return (
    <div className="newspaper-box">
      <div className="text-center mb-1.5">
        <span className="newspaper-label" style={{ fontSize: "0.55rem" }}>Editorial</span>
      </div>
      <h4 className="font-display text-sm font-bold text-center text-ink mb-1.5 leading-tight">
        The Convergence of Wand and Workstation
      </h4>
      <p className="drop-cap font-body text-xs leading-snug text-ink-soft text-justify">
        In this edition we witness the next great convergence: artificial intelligence, space exploration, and the quiet renaissance of systems programming. The future is being written in Rust, trained on GPUs, and launched into orbit.
      </p>
      <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-ink-faded mt-1.5 text-right font-bold">
        — The Editorial Board
      </p>
    </div>
  );
}