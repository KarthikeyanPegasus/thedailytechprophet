"use client";

import { Search } from "lucide-react";
import Link from "next/link";

export function SearchButton() {
  return (
    <Link
      href="/search"
      className="p-2 border-2 border-[var(--border-color)] bg-parchment-dark/50 hover:bg-gold/20 transition-colors"
      aria-label="Search the archives"
      title="Search the archives (/)"
    >
      <Search className="w-4 h-4 text-gold" />
    </Link>
  );
}
