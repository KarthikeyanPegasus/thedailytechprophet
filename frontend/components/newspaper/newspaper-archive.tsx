"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDateLabel, isoDaysAgo } from "@/hooks/use-article-date";

/**
 * NewspaperArchive — browse previous editions with bound-newspaper
 * aesthetic. Shows recent edition tabs (last 7 days) styled like
 * bound newspaper spines.
 */
export function NewspaperArchive({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [editions] = useState(() =>
    Array.from({ length: 14 }, (_, i) => isoDaysAgo(i))
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="archive-spine"
        aria-label="Browse newspaper archive"
        aria-expanded={open}
      >
        <span className="text-gold">❖</span> Browse Archive
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <div className="archive-tabs pb-0">
              {editions.map((iso, i) => (
                <Link
                  key={iso}
                  href={`/?date=${iso}`}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("dtp:article-date", iso);
                      window.dispatchEvent(new Event("dtp:date-change"));
                    }
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="archive-tab"
                  style={{ opacity: 1 - i * 0.04 }}
                >
                  {formatDateLabel(iso).replace(/,/g, "").split(" ").slice(0, 3).join(" ")}
                </Link>
              ))}
            </div>
            <p className="engraved-label mt-2" style={{ textAlign: "center" }}>
              {editions.length} editions available · Bound volumes since Vol. I
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}