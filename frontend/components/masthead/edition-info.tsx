"use client";

import { useEffect, useState } from "react";

/**
 * EditionInfo — dynamically computes the edition number, volume, and issue
 * based on the current date. The Daily Tech Prophet started Jan 1, 2025
 * (Vol. CLXII = 162nd year of publication).
 *
 * Format: Edition No. X · Vol. CLXII · No. Y
 */
export function EditionInfo() {
  const [edition, setEdition] = useState({ editionNo: 0, vol: "CLXII", issueNo: 0 });

  useEffect(() => {
    const start = new Date("2025-01-01");
    const now = new Date();
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const editionNo = days + 1;
    // Issue resets yearly — count days into current year
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const issueNo = Math.floor((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setEdition({ editionNo, vol: "CLXII", issueNo });
  }, []);

  return (
    <div className="edition-info">
      <div><span className="edition-number">№ {edition.editionNo.toLocaleString()}</span></div>
      <div>Vol. {edition.vol}</div>
      <div>Issue {edition.issueNo.toLocaleString()}</div>
    </div>
  );
}