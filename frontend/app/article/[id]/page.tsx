"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Bookmark, Play, Square, User, Users, Mic } from "lucide-react";
import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { PullQuote } from "@/components/articles/pull-quote";
import { SideNote } from "@/components/articles/side-note";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { ArticleUnfold } from "@/components/effects/article-unfold";
import { LivingIllustration } from "@/components/images/illustration-picker";
import { Footnote } from "@/components/articles/footnote";
import { FigureCaption } from "@/components/articles/figure-caption";
import { DecorativeOrnament } from "@/components/newspaper/decorative-ornament";
import { useBookmarks, useReadingHistory } from "@/hooks/use-storage";
import { fetchArticle, fetchNews, type Article } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/utils";
import { ArticleCard } from "@/components/articles/article-card";
import { useLocation } from "@/hooks/use-location";

const VOICE_PREF_KEY = "dtp:read-aloud-voice";
const MODE_PREF_KEY = "dtp:read-aloud-mode";
type ReadMode = "single" | "duet";

// Magical highlighter: golden glow word highlight
function HighlightWord({ idx, highlighted, children }: { idx: number; highlighted: number | null; children: React.ReactNode }) {
  const isHighlighted = highlighted !== null && highlighted === idx;
  return (
    <span
      data-word-index={idx}
      className={isHighlighted ? "word-highlight" : ""}
    >
      {children}
    </span>
  );
}

// Split text into alternating words and whitespace parts.
function splitTextParts(text: string): { words: string[]; separators: string[] } {
  const parts = text.split(/(\s+)/);
  const words: string[] = [];
  const separators: string[] = [];
  let expectWord = true;
  for (const p of parts) {
    if (!p) continue;
    if (p.match(/^\s+$/)) {
      if (expectWord) words.push("");
      separators.push(p);
      expectWord = true;
    } else {
      words.push(p);
      if (!expectWord) separators.push("");
      expectWord = false;
    }
  }
  return { words, separators };
}

// Wrap each word in a paragraph with HighlightWord spans, preserving whitespace.
function HighlightedParagraph({
  text,
  startIdx,
  highlighted,
  onWordCount,
}: {
  text: string;
  startIdx: number;
  highlighted: number | null;
  onWordCount?: (finalIdx: number) => void;
}) {
  const { words, separators } = useMemo(() => splitTextParts(text), [text]);
  const finalIdx = startIdx + words.length;
  useEffect(() => {
    onWordCount?.(finalIdx);
  }, [finalIdx, onWordCount]);
  return (
    <>
      {words.map((word, i) => {
        const idx = startIdx + i;
        return (
          <React.Fragment key={`frag-${i}`}>
            <HighlightWord idx={idx} highlighted={highlighted}>{word}</HighlightWord>
            {separators[i] ? <span>{separators[i]}</span> : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

// Count words in text (matches the split used by HighlightedParagraph)
function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// Acronyms that most TTS engines read correctly on their own
const KNOWN_ACRONYMS = new Set([
  "AI", "API", "USA", "UK", "EU", "UN", "NASA", "FBI", "CIA", "NSA",
  "CPU", "GPU", "RAM", "ROM", "SSD", "HDD", "OS", "UI", "UX", "CLI", "IDE",
  "LLM", "ML", "NLP", "GPT", "AGI", "GPU", "TPU", "ASIC", "FPGA",
  "DNA", "RNA", "MRI", "CT", "AI", "AR", "VR", "XR", "IoT", "IIoT",
  "HTTP", "HTTPS", "URL", "URI", "DNS", "TCP", "UDP", "IP", "VPN", "SSH",
  "CSS", "HTML", "XML", "JSON", "YAML", "SQL", "NoSQL", "REST", "SOAP",
  "CEO", "CTO", "CFO", "COO", "IPO", "ETF", "GDP", "ROI", "KPI", "B2B", "B2C",
  "PC", "TV", "AC", "DC", "LED", "LCD", "AM", "PM", "BC", "AD",
  "Q1", "Q2", "Q3", "Q4",
]);

// Sanitize text so TTS engines don't stumble on symbols, URLs, or weird punctuation
function sanitizeForSpeech(input: string): string {
  if (!input) return "";
  let s = input;

  // Strip URLs and emails
  s = s.replace(/https?:\/\/\S+/gi, "the linked article");
  s = s.replace(/\b\S+@\S+\.\S+\b/g, "the contact email");

  // Replace common symbols with words
  s = s.replace(/&/g, " and ");
  s = s.replace(/\$/g, " dollars ");
  s = s.replace(/€/g, " euros ");
  s = s.replace(/£/g, " pounds ");
  s = s.replace(/¥/g, " yen ");
  s = s.replace(/©/g, " copyright ");
  s = s.replace(/®/g, " registered ");
  s = s.replace(/™/g, " ");
  s = s.replace(/°/g, " degrees ");
  s = s.replace(/=/g, " equals ");
  s = s.replace(/\+/g, " plus ");
  s = s.replace(/(?<![\w])-(?![\w])/g, " "); // standalone dashes
  s = s.replace(/—|–/g, ", "); // em/en dash -> comma pause
  s = s.replace(/→|⇒|⟶/g, " to "); // arrows
  s = s.replace(/[<>]/g, " ");

  // Percent: "47%" -> "47 percent"
  s = s.replace(/(\d)\s*%/g, "$1 percent");
  s = s.replace(/(\d)\s*°/g, "$1 degrees");

  // GPT-5, Claude-4, MMLU-Pro -> "GPT 5", "Claude 4", "MMLU Pro"
  s = s.replace(/([A-Za-z]+)-(\d)/g, "$1 $2");

  // Acronyms: ALL-CAPS 2-6 letter words not in the known set get spelled out
  s = s.replace(/\b[A-Z]{2,6}\b/g, (m) => (KNOWN_ACRONYMS.has(m) ? m : m.split("").join(" ")));

  // Hyphenated compounds: "real-time" -> "real time"
  s = s.replace(/([A-Za-z]+)-([A-Za-z]+)/g, "$1 $2");

  // Slash-separated: "text/image/audio" -> "text, image, or audio"
  s = s.replace(/\s*\/\s*/g, ", or ");

  // Normalize ellipses so they don't glue to the next sentence
  s = s.replace(/\.{2,}/g, ". ");

  // Multiple punctuation collapse (e.g. "!!" -> "!")
  s = s.replace(/([.!?])\1+/g, "$1");
  s = s.replace(/,{2,}/g, ", ");

  // Ensure a space follows every sentence terminator so the chunker can split
  s = s.replace(/([.!?])([A-Z"'(\[])/g, "$1 $2");
  // Remove accidental spaces before punctuation
  s = s.replace(/\s+([,.!?;:])/g, "$1");

  // Remove any leftover garbage
  s = s.replace(/[`*_~#^|\\]/g, " ");
  // Collapse runs of spaces/tabs but preserve newlines (paragraph breaks)
  s = s.replace(/[ \t]{2,}/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.trim();

  return s;
}

// Split text into utterances no longer than maxLen characters.
// Splits on paragraph boundaries first, then sentence boundaries within
// each paragraph. This ensures many natural-sized chunks — essential for
// duet mode where each chunk alternates between male and female voices.
function chunkForSpeech(input: string, maxLen = 500): string[] {
  if (!input) return [];

  // Split on newlines (paragraphs), then each paragraph into sentences.
  const paragraphs = input
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const allSentences: string[] = [];
  for (const para of paragraphs) {
    const sentences =
      para.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ??
      [para];
    allSentences.push(...sentences);
  }

  // Accumulate sentences into chunks up to maxLen.
  const chunks: string[] = [];
  let current = "";
  for (const sentence of allSentences) {
    if (sentence.length > maxLen) {
      // Flush current, then hard-slice the long sentence
      if (current) {
        chunks.push(current);
        current = "";
      }
      let remaining = sentence;
      while (remaining.length > maxLen) {
        let cut = remaining.lastIndexOf(" ", maxLen);
        if (cut <= 0) cut = maxLen;
        const piece = remaining.slice(0, cut).trim();
        if (piece) chunks.push(piece);
        remaining = remaining.slice(cut).trim();
      }
      if (remaining) current = remaining;
      continue;
    }
    const combined = current ? `${current} ${sentence}` : sentence;
    if (combined.length > maxLen && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = combined;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

// Hints that signal a high-quality / natural voice across platforms
const NEURAL_HINTS = [
  "Natural", "Neural", "Online", "Premium", "Enhanced",
  "Wavenet", "Studio", "Journey", "Polyglot",
];

// Preferred soft, gentle voices (used as tie-breakers within English voices)
const GENTLE_VOICE_HINTS = [
  "Samantha", "Karen", "Moira", "Tessa", "Fiona", "Victoria",
  "Serena", "Ava", "Allison", "Susan", "Fanny", "Celine",
  "Amelie", "Audrey", "Aurelie", "Aria", "Jenny", "Zira",
];

function isEnglish(voice: SpeechSynthesisVoice): boolean {
  return voice.lang?.toLowerCase().startsWith("en") ?? false;
}

function pickNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const english = voices.filter(isEnglish);
  const pool = english.length > 0 ? english : voices;

  // 1) English neural/online voice with a soft name
  for (const n of NEURAL_HINTS) {
    for (const g of GENTLE_VOICE_HINTS) {
      const match = pool.find(
        (v) =>
          v.name.toLowerCase().includes(n.toLowerCase()) &&
          v.name.toLowerCase().includes(g.toLowerCase()),
      );
      if (match) return match;
    }
  }

  // 2) Any neural/online voice
  for (const n of NEURAL_HINTS) {
    const match = pool.find((v) =>
      v.name.toLowerCase().includes(n.toLowerCase()),
    );
    if (match) return match;
  }

  // 3) Gentle-named English voice
  for (const g of GENTLE_VOICE_HINTS) {
    const match = pool.find((v) => v.name.toLowerCase().includes(g.toLowerCase()));
    if (match) return match;
  }

  // 4) English female-tagged voice
  const female = pool.find(
    (v) => /female|woman|girl/i.test(v.name) || v.name.toLowerCase().includes("aria"),
  );
  if (female) return female;

  // 5) First English voice
  if (english.length > 0) return english[0];

  // 6) First available voice
  return voices[0];
}

// Find the first voice whose name (case-insensitive) includes any of the given hints,
// preferring English voices. Returns null if nothing matches.
function pickVoiceByName(
  voices: SpeechSynthesisVoice[],
  hints: string[],
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0 || hints.length === 0) return null;
  const english = voices.filter(isEnglish);
  const pools = [english, voices];
  for (const pool of pools) {
    for (const hint of hints) {
      const match = pool.find((v) =>
        v.name.toLowerCase().includes(hint.toLowerCase()),
      );
      if (match) return match;
    }
  }
  return null;
}

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const location = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [readMode, setReadMode] = useState<ReadMode>("single");
  const [speakingBody, setSpeakingBody] = useState<string | null>(null);
  // Track whether article data has loaded enough to render highlighted body
  const [bodyReady, setBodyReady] = useState(false);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { addToHistory } = useReadingHistory();
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // Generation counter for the active TTS queue. When the user stops or
  // switches mode/voice, we bump this so any in-flight callbacks from the
  // old queue become no-ops.
  const speechGenRef = useRef(0);
  // Magical highlighter: tracks which word index is currently being spoken
  const [highlightedWord, setHighlightedWord] = useState<number | null>(null);
  const highlightedWordRef = useRef<number | null>(null);
  // Array of all body words extracted from DOM for word-index tracking
  const bodyWordsRef = useRef<string[]>([]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Load available voices and restore the user's preferred voice + mode.
  // Deferred via requestIdleCallback so it doesn't compete with the first paint
  // and article fetch. On browsers without rIC it falls back to a 0ms timeout.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const stored = window.localStorage.getItem(VOICE_PREF_KEY);
    if (stored) setSelectedVoiceURI(stored);
    const storedMode = window.localStorage.getItem(MODE_PREF_KEY);
    if (storedMode === "single" || storedMode === "duet") setReadMode(storedMode);

    const setup = () => {
      const refresh = () => setAvailableVoices(window.speechSynthesis.getVoices());
      refresh();
      window.speechSynthesis.addEventListener("voiceschanged", refresh);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", refresh);
    };
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const w = window as IdleWindow;
    let cleanup: (() => void) | null = null;
    const handle = (cb: () => void) => {
      if (typeof w.requestIdleCallback === "function") {
        return w.requestIdleCallback(cb, { timeout: 500 });
      }
      return window.setTimeout(cb, 0);
    };
    handle(() => {
      cleanup = setup();
    });
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleModeChange = (mode: ReadMode) => {
    setReadMode(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MODE_PREF_KEY, mode);
    }
    if (speaking) {
      speechGenRef.current += 1;
      window.speechSynthesis.cancel();
      setSpeaking(false);
      window.setTimeout(() => handleSpeak(), 80);
    }
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri || null);
    if (typeof window !== "undefined") {
      if (uri) window.localStorage.setItem(VOICE_PREF_KEY, uri);
      else window.localStorage.removeItem(VOICE_PREF_KEY);
    }
    // If currently speaking, restart with the new voice
    if (speaking) {
      speechGenRef.current += 1;
      window.speechSynthesis.cancel();
      setSpeaking(false);
      // Slight delay to allow cancel to settle, then restart
      window.setTimeout(() => handleSpeak(uri), 80);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Kick off both the article fetch and the related-articles fetch in
    // parallel. The article fetch is the critical path; related is best-effort.
    const articlePromise = fetchArticle(id);

    articlePromise
      .then((data) => {
        if (cancelled) return;
        const found = data.article;
        if (!found) {
          setLoading(false);
          return;
        }
        setArticle(found);
        addToHistory(found);
        // Extract words from article content (not DOM ref, which isn't rendered yet)
        bodyWordsRef.current = (found.content || found.summary).split(/\s+/).filter(Boolean);
        setBodyReady(true);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    // Related articles are non-blocking; we update state when they arrive
    articlePromise
      .then((data) => {
        if (cancelled) return;
        const found = data.article;
        if (!found) return;
        return fetchNews({
          category: found.categories[0],
          page: 1,
          pageSize: 20,
          region: location.region,
          timezone: location.timezone,
        });
      })
      .then((newsData) => {
        if (cancelled || !newsData) return;
        setRelated(
          newsData.articles
            .filter((a) => a.id !== id)
            .slice(0, 3)
        );
      })
      .catch(() => {
        // Related articles are non-critical; just leave the list empty
      });

    return () => {
      cancelled = true;
    };
  }, [id, addToHistory, location.region, location.timezone]);

  const handleSpeak = (arg?: string | React.MouseEvent) => {
    const overrideURI = typeof arg === "string" ? arg : undefined;
    if (!article) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speaking) {
      // Bump the generation so any pending callbacks from the old queue
      // become no-ops, then cancel the engine.
      speechGenRef.current += 1;
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setHighlightedWord(null);
      highlightedWordRef.current = null;
      setSpeakingBody(null);
      return;
    }

    if (!bodyReady) return;

    // Build the body text from the same paragraphs rendered in the DOM so indices match.
    const hardcodedBody = [
      "The implications of this development ripple outward through every adjacent field: from the silicon fabs that must now retool their lithography lines, to the frameworks engineers will adopt before the next holiday shopping season. Observers note that the velocity of change has compressed what once took a decade into a single product cycle.",
      "Yet history cautions against mistaking announcements for outcomes. Previous breakthroughs have promised revolutions and delivered only incremental gains. The true test will be whether these systems survive contact with the messy, unlabeled, adversarial world beyond the benchmark suite.",
      "In the coming weeks, this newspaper will publish a deeper technical analysis of the architecture, power envelope, and safety evaluations surrounding this release. For now, the only certainty is that the frontier has moved again.",
    ].join("\n\n");
    const bodyText = sanitizeForSpeech(`${article.content || article.summary || ""}\n\n${hardcodedBody}`);
    const titleText = sanitizeForSpeech(article.title);
    const raw = `${titleText}. ${bodyText}`;
    const text = raw;
    const voices = window.speechSynthesis.getVoices();
    // Pre-split spoken text into words for fallback timer-based mapping
    const spokenWords = text.split(/\s+/).filter(Boolean);
    const titleWordCount = countWords(titleText);
    const bodyWordCount = countWords(bodyText);

    // Resolve voice: explicit override > persisted choice > auto-pick
    const desiredURI = overrideURI ?? selectedVoiceURI;
    let primaryVoice: SpeechSynthesisVoice | null = null;
    if (desiredURI) {
      primaryVoice = voices.find((v) => v.voiceURI === desiredURI) ?? null;
    }
    if (!primaryVoice) primaryVoice = pickNaturalVoice(voices);

    // Build the utterance list. In duet mode, each item carries its target voice.
    let items: { text: string; voice: SpeechSynthesisVoice | null; pitch?: number }[];

    if (readMode === "duet") {
      const reed = pickVoiceByName(voices, [
        "Reed", "Daniel", "Alex", "Fred", "Albert", "Eddy",
        "Grandpa", "Tom", "Oliver", "Aaron", "Gordon",
        "Google UK English Male", "Google US English Male",
        "Microsoft Guy", "Microsoft Ryan", "Microsoft Davis",
        "Microsoft Tony", "Microsoft Ravi",
      ]);
      const samantha = pickVoiceByName(voices, [
        "Samantha", "Karen", "Moira", "Tessa", "Fiona",
        "Victoria", "Serena", "Ava", "Allison", "Susan",
        "Fanny", "Celine", "Amelie", "Audrey", "Aurelie",
      ]);
      const female = samantha ?? primaryVoice;
      // Fallback: if no named male voice found, pick any English voice
      // that is different from the female voice.
      let male = reed;
      if (!male) {
        const englishVoices = voices.filter(isEnglish);
        const femaleURI = female?.voiceURI;
        male = englishVoices.find((v) => v.voiceURI !== femaleURI) ?? primaryVoice;
      }
      const body = chunkForSpeech(text, 150);
      items = [];
      body.forEach((chunk, idx) => {
        const isMale = idx % 2 !== 0;
        items.push({ text: chunk, voice: isMale ? male : female, pitch: isMale ? 0.8 : 1.0 });
      });
    } else {
      items = chunkForSpeech(text, 500).map((chunk) => ({ text: chunk, voice: primaryVoice }));
    }

    // Chrome's speechSynthesis has a small internal pending queue
    // (~3-5 utterances). Pre-queuing all chunks at once causes later
    // chunks to be silently dropped, so we chain them: when the current
    // utterance fires onstart, we call speak() for the next one.
    // onstart is more reliable than onend across Chrome versions.
    window.speechSynthesis.cancel();

    // Capture the current generation so callbacks from a previous queue
    // (e.g. after the user clicks Stop and Play again) become no-ops.
    const gen = speechGenRef.current;
    const isCurrent = () => speechGenRef.current === gen;

    let index = 0;
    let remaining = items.filter((it) => it.text && it.text.trim()).length;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (isCurrent()) {
        setSpeaking(false);
        setHighlightedWord(null);
        highlightedWordRef.current = null;
        setSpeakingBody(null);
      }
    };

    const speakOne = (i: number): void => {
      if (finished || !isCurrent()) return;
      if (i >= items.length) return;

      const item = items[i];
      if (!item.text || !item.text.trim()) {
        index = i + 1;
        window.setTimeout(() => {
          if (finished || !isCurrent()) return;
          speakOne(index);
        }, 0);
        return;
      }

      const u = new SpeechSynthesisUtterance(item.text);
      if (item.voice) u.voice = item.voice;
      u.rate = 0.95;
      u.pitch = item.pitch ?? 1.0;
      u.volume = 1.0;

      // Magical highlighter: track the cumulative word index before this chunk
      let cumWords = 0;
      for (let k = 0; k < i; k++) {
        cumWords += items[k].text.split(/\s+/).filter(Boolean).length;
      }
      const chunkWords = item.text.split(/\s+/).filter(Boolean);

      let chained = false;
      const chainNext = () => {
        if (chained || finished || !isCurrent()) return;
        chained = true;
        const next = i + 1;
        if (next >= items.length) {
          // Last chunk — wait for this one to finish
          return;
        }
        speakOne(next);
      };

      const advanceHighlightTo = (localIdx: number) => {
        const globalWordIdx = cumWords + localIdx;
        const bodyWordIdx = globalWordIdx - titleWordCount;
        const clamped = Math.max(0, Math.min(bodyWordCount - 1, bodyWordIdx));
        highlightedWordRef.current = clamped;
        setHighlightedWord(clamped);
      };

      // 1) Preferred: native word boundary events (Chrome/Edge desktop)
      u.onboundary = (ev) => {
        if (finished || !isCurrent() || ev.name !== "word") return;
        // charIndex is relative to the chunk. Count whitespace runs before ci
        // to determine which word boundary we are at.
        const chunkWords = item.text.split(/\s+/).filter(Boolean);
        let wordIdx = 0;
        let charCount = 0;
        for (const w of chunkWords) {
          if (charCount >= ev.charIndex) break;
          charCount += w.length;
          if (charCount > ev.charIndex) break;
          // skip the following whitespace
          while (charCount < ev.charIndex && item.text[charCount]?.match(/\s/)) charCount++;
          wordIdx++;
        }
        advanceHighlightTo(Math.min(wordIdx, chunkWords.length - 1));
      };

      // 2) Fallback timer: estimate word progress for browsers/engines that don't fire onboundary reliably.
      let timer: number | null = null;
      const wordsPerSecond = 2.4 * u.rate; // u.rate 0.95 ≈ 2.28 words/sec spoken
      const startTimer = () => {
        if (timer !== null) return;
        const chunkDurationMs = (item.text.length / 5.5 / wordsPerSecond) * 1000;
        const stepMs = Math.min(250, Math.max(140, chunkDurationMs / chunkWords.length));
        let t = 0;
        timer = window.setInterval(() => {
          t += stepMs;
          const ratio = Math.min(1, t / chunkDurationMs);
          const localIdx = Math.floor(ratio * chunkWords.length);
          advanceHighlightTo(Math.min(localIdx, chunkWords.length - 1));
          if (ratio >= 1 && timer !== null) {
            window.clearInterval(timer);
            timer = null;
          }
        }, stepMs);
      };
      const clearTimer = () => {
        if (timer !== null) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      u.onstart = () => {
        // Chain the next chunk as soon as the current one starts playing.
        // This keeps exactly 1-2 utterances in the engine's pending queue.
        chainNext();
        startTimer();
      };
      u.onend = () => {
        clearTimer();
        if (finished || !isCurrent()) return;
        remaining = Math.max(0, remaining - 1);
        if (remaining === 0) finish();
      };
      u.onerror = (ev) => {
        clearTimer();
        if (finished || !isCurrent()) return;
        const err = (ev as SpeechSynthesisErrorEvent).error;
        if (err === "canceled" || err === "interrupted") {
          finish();
          return;
        }
        remaining = Math.max(0, remaining - 1);
        if (remaining === 0) finish();
        chainNext();
      };

      try {
        window.speechSynthesis.speak(u);
      } catch {
        if (finished || !isCurrent()) return;
        remaining = Math.max(0, remaining - 1);
        if (remaining === 0) finish();
        chainNext();
      }
    };

    if (remaining > 0) {
      setSpeaking(true);
      speakOne(0);
    } else {
      setSpeaking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen paper-texture paper-edges flex items-center justify-center font-body text-ink-soft italic text-lg">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          Unfolding the newspaper…
        </motion.div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen paper-texture paper-edges flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-4xl font-bold text-ink mb-4">Edition Not Found</h1>
        <p className="font-body text-ink-soft mb-6">This article seems to have vanished into the archives.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border-color)] font-sans text-xs uppercase tracking-widest text-ink hover:bg-gold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Front Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen paper-texture paper-edges">
      {/* Reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50"
        style={{ scaleX }}
      />

      <Masthead />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-8" ref={contentRef}>
      <ArticleUnfold>
        {/* Back + actions bar — newspaper style, no card */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-[var(--border-color)] pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-ink-soft hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Front Page
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(article)}
              className={`p-1.5 border border-[var(--border-color)] transition-colors ${isBookmarked(article.id) ? "bg-gold text-ink" : "hover:bg-gold/10 text-ink-soft"}`}
              aria-label="Bookmark"
              title="Bookmark (b)"
              id="bookmark-btn"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(article.id) ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleSpeak}
              className={`p-1.5 border border-[var(--border-color)] transition-colors ${speaking ? "bg-gold text-ink" : "hover:bg-gold/10 text-ink-soft"}`}
              aria-label={speaking ? "Stop reading" : "Read aloud"}
              title={speaking ? "Stop" : "Read aloud"}
            >
              {speaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="inline-flex border border-[var(--border-color)] text-xs font-sans" role="group" aria-label="Reading mode">
              <button
                onClick={() => handleModeChange("single")}
                className={`px-2 py-1.5 transition-colors ${readMode === "single" ? "bg-gold text-ink" : "text-ink-soft hover:bg-gold/10"}`}
                aria-pressed={readMode === "single"}
                title="Single voice"
              >
                <User className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleModeChange("duet")}
                className={`px-2 py-1.5 border-l border-[var(--border-color)] transition-colors ${readMode === "duet" ? "bg-gold text-ink" : "text-ink-soft hover:bg-gold/10"}`}
                aria-pressed={readMode === "duet"}
                title="Duet (Reed + Samantha)"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative">
              <select
                value={selectedVoiceURI ?? ""}
                onChange={(e) => handleVoiceChange(e.target.value)}
                disabled={availableVoices.length === 0}
                aria-label="Select voice"
                title="Select voice"
                className="max-w-[10rem] truncate bg-transparent border border-[var(--border-color)] text-xs font-sans text-ink-soft py-1.5 pl-2 pr-6 hover:border-gold focus:outline-none focus:border-gold appearance-none bg-no-repeat bg-right disabled:opacity-50"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23866b4a' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
                  backgroundPosition: "right 0.4rem center",
                  backgroundSize: "8px 5px",
                }}
              >
                <option value="">Auto (best natural)</option>
                {availableVoices
                  .filter((v) => isEnglish(v))
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {`${v.name} (${v.lang})`}
                    </option>
                  ))}
              </select>
              <Mic
                className="w-3 h-3 absolute right-7 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
                aria-hidden
              />
            </div>
            {readMode === "duet" && availableVoices.length > 0 && (() => {
              const reed = pickVoiceByName(availableVoices, [
                "Reed", "Daniel", "Alex", "Fred",
                "Microsoft Guy", "Microsoft Davis",
              ]);
              const samantha = pickVoiceByName(availableVoices, [
                "Samantha", "Karen", "Moira", "Tessa", "Fiona", "Victoria",
              ]);
              if (reed && samantha) return null;
              return (
                <span
                  className="ml-1 text-[10px] font-sans uppercase tracking-widest text-ink-soft italic"
                  title={
                    !reed && !samantha
                      ? "Reed and Samantha are not installed on this device. Falling back to the auto voice."
                      : !reed
                        ? "Reed is not installed; the male voice will use a fallback."
                        : "Samantha is not installed; the female voice will use a fallback."
                  }
                >
                  {!reed && !samantha
                    ? "fallback"
                    : !reed
                      ? "no reed"
                      : "no samantha"}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Categories as text labels */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs uppercase tracking-widest font-sans font-bold text-gold">
          {article.categories.map((cat) => (
            <Link key={cat} href={`/category/${cat}`} className="hover:underline">
              {cat.replace(/-/g, " ")}
            </Link>
          ))}
        </div>

        {/* Headline */}
        <h1 className="headline text-3xl sm:text-4xl md:text-5xl text-center text-ink mb-2 leading-[1.05]">
          {article.title}
        </h1>

        {/* Deck (italic subhead) */}
        <p className="deck text-base sm:text-lg text-center text-ink-soft max-w-3xl mx-auto mb-3">
          {article.summary}
        </p>

        {/* Byline — text only */}
        <p className="byline text-center text-[var(--ink)] opacity-60 mb-4">
          BY {article.author} · {formatDate(article.published_at)} · {article.read_time} MIN READ
        </p>

        {/* Thick double rule */}
        <div className="section-rule mb-6" />

        {/* Hero illustration + body — newspaper wrap: text flows beside then below the image */}
        <ScrollReveal>
          <div className="article-hero-wrap">
            <div className="article-hero-figure">
              <figure>
                <div className="border-4 border-double border-[var(--border-color)] p-2 bg-parchment-dark/30 dark:bg-[var(--color-dark-paper-light)]/40">
                  <div className="aspect-square w-full h-full">
                    <LivingIllustration article={article} imageUrl={article.image_url} className="w-full h-full" />
                  </div>
                </div>
                <FigureCaption number="I">
                  {article.categories[0]?.replace(/-/g, " ") ?? "Illustration"} — Engraved for The Daily Tech Prophet
                </FigureCaption>
              </figure>
            </div>

            {/* Article body — newspaper column flow (with magical highlighter) */}
            <div ref={bodyRef} className="newspaper-columns-tight newspaper-flow-tight body-text">
          {(() => {
            const hardcodedParas = [
              "The implications of this development ripple outward through every adjacent field: from the silicon fabs that must now retool their lithography lines, to the frameworks engineers will adopt before the next holiday shopping season. Observers note that the velocity of change has compressed what once took a decade into a single product cycle.",
              "Yet history cautions against mistaking announcements for outcomes. Previous breakthroughs have promised revolutions and delivered only incremental gains. The true test will be whether these systems survive contact with the messy, unlabeled, adversarial world beyond the benchmark suite.",
              "In the coming weeks, this newspaper will publish a deeper technical analysis of the architecture, power envelope, and safety evaluations surrounding this release. For now, the only certainty is that the frontier has moved again.",
            ];
            const leadText = article.content || article.summary || "";
            let wordIdx = 0;
            return (
              <>
                <p className="drop-cap mb-3">
                  <span className="dateline-prefix">San Francisco —</span>
                  <HighlightedParagraph text={leadText} startIdx={wordIdx} highlighted={highlightedWord} onWordCount={(n) => { wordIdx = n; }} />
                </p>
                {hardcodedParas.map((para, pi) => {
                  const start = wordIdx;
                  return (
                    <p key={pi} className="mb-3">
                      <HighlightedParagraph text={para} startIdx={start} highlighted={highlightedWord} onWordCount={(n) => { wordIdx = n; }} />
                    </p>
                  );
                })}
              </>
            );
          })()}
            </div>
          </div>
        </ScrollReveal>

        <DecorativeOrnament variant="separator" />

        {/* Pull quote */}
        <PullQuote
          quote="Technology is best when it pulls the future into the present without asking permission."
          author="The Daily Tech Prophet Editorial Board"
        />

        {/* Side note */}
        <SideNote title="By the Numbers">
          This story was confirmed by three independent sources. Benchmark figures reflect the most recent publicly available test data at press time.
        </SideNote>

        {/* Timeline */}
        {article.timeline && article.timeline.length > 0 && (
          <section className="mt-8 border-t border-[var(--border-color)] pt-5">
            <h2 className="font-display text-xl font-bold text-ink mb-3">Timeline of Events</h2>
            <div className="relative border-l-2 border-gold/50 ml-3 pl-6 space-y-4">
              {article.timeline.map((item, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gold border-2 border-parchment" />
                  <div className="font-sans text-xs uppercase tracking-widest text-gold mb-0.5">{item.date}</div>
                  <p className="font-body text-sm text-ink-soft">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Also in this edition — related stories */}
        {related.length > 0 && (
          <section className="mt-8 border-t-4 border-double border-[var(--border-color)] pt-5">
            <h3 className="also-in-edition">Also in this edition</h3>
            <div className="newspaper-columns-tight newspaper-flow-tight">
              {related.map((a, i) => (
                <ArticleCard key={a.id} article={a} variant="compact" index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Page marker */}
        <div className="mt-8 flex items-center justify-between page-marker">
          <span>The Daily Tech Prophet</span>
          <span>Continued from Front Page</span>
          <span>Page 2</span>
        </div>

        {/* Footnotes */}
        <Footnote items={[
          { marker: "†", text: "Benchmark figures sourced from publicly available data at time of press." },
          { marker: "‡", text: "See: \"A History of Silicon Valley,\" Vol. III, pp. 142–167." },
          { marker: "§", text: "Confirmed by three independent correspondents." },
        ]} />

        {/* Newspaper reference */}
        <DecorativeOrnament variant="quill-mark" />
        <div className="newspaper-reference">
          First reported in <em>The Daily Tech Prophet</em>, {formatDate(article.published_at)}. Reprinted with permission. All rights reserved by the Publisher.
        </div>
      </ArticleUnfold>
      </main>

      <Footer />
    </div>
  );
}
