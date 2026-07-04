"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Category } from "@/types";
import { fetchCategories } from "@/lib/api";

const FALLBACK_CATEGORIES: Category[] = [
  { slug: "artificial-intelligence", name: "AI", description: "", icon: "brain" },
  { slug: "programming", name: "Programming", description: "", icon: "code" },
  { slug: "open-source", name: "Open Source", description: "", icon: "github" },
  { slug: "startups", name: "Startups", description: "", icon: "rocket" },
  { slug: "engineering", name: "Engineering", description: "", icon: "cog" },
  { slug: "cybersecurity", name: "Cybersecurity", description: "", icon: "shield" },
  { slug: "cloud", name: "Cloud", description: "", icon: "cloud" },
  { slug: "devops", name: "DevOps", description: "", icon: "git-branch" },
  { slug: "apple", name: "Apple", description: "", icon: "apple" },
  { slug: "google", name: "Google", description: "", icon: "search" },
  { slug: "microsoft", name: "Microsoft", description: "", icon: "microwave" },
  { slug: "openai", name: "OpenAI", description: "", icon: "sparkles" },
  { slug: "robotics", name: "Robotics", description: "", icon: "bot" },
  { slug: "space", name: "Space", description: "", icon: "rocket" },
  { slug: "quantum-computing", name: "Quantum", description: "", icon: "atom" },
  { slug: "linux", name: "Linux", description: "", icon: "terminal" },
  { slug: "science", name: "Science", description: "", icon: "flask-conical" },
  { slug: "gaming", name: "Gaming", description: "", icon: "gamepad-2" },
  { slug: "design", name: "Design", description: "", icon: "palette" },
  { slug: "career", name: "Career", description: "", icon: "briefcase" },
];

export function Navigation() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    fetchCategories().then((data) => {
      if (data.categories.length > 0) {
        setCategories(data.categories);
      }
    }).catch(() => {
      // keep fallback categories already set
    });
  }, []);

  return (
    <nav
      className="sticky top-0 z-40 paper-texture border-y border-[var(--border-color)]"
      aria-label="Sections"
    >
      <div className="max-w-[90rem] mx-auto px-4">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          <span className="hidden sm:inline font-headline text-xs text-gold uppercase tracking-widest mr-3 py-2 whitespace-nowrap">
            Sections
          </span>
          <span className="hidden sm:inline-block h-4 w-px bg-[var(--border-color)] mr-1" />
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.01, 0.2), duration: 0.2 }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="newspaper-nav-link whitespace-nowrap"
              >
                {cat.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
}