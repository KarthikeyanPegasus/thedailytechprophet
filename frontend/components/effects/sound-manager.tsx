"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SoundManager — optional ambient newspaper sounds.
 * Muted by default. Toggle via a button in the masthead or the "m" key.
 * Sounds: paper rustle, page turning, printing press, quill scratching.
 * All very low volume. Uses Web Audio API to generate sounds procedurally
 * (no audio files needed).
 */

type SoundType = "rustle" | "page-turn" | "press" | "quill";

export function SoundManager() {
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "m" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        // Don't trigger when typing in input/textarea
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        setEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      setEnabled(false);
      return;
    }

    audioCtxRef.current = new AudioContextClass();

    // Procedurally generate a short ambient sound
    const playSound = (type: SoundType) => {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "closed") return;

      const now = ctx.currentTime;

      switch (type) {
        case "rustle": {
          // Paper rustle — filtered noise burst, very quiet
          const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3 * Math.exp(-i / (ctx.sampleRate * 0.15));
          }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 2000;
          filter.Q.value = 0.5;
          const gain = ctx.createGain();
          gain.gain.value = 0.04;
          source.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          source.start(now);
          break;
        }
        case "page-turn": {
          // Page turn — quick filtered noise swoosh
          const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5 * Math.exp(-i / (ctx.sampleRate * 0.08));
          }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "highpass";
          filter.frequency.value = 800;
          const gain = ctx.createGain();
          gain.gain.value = 0.03;
          source.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          source.start(now);
          break;
        }
        case "press": {
          // Printing press — low rhythmic thump
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = 60;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }
        case "quill": {
          // Quill scratching — very quiet filtered noise
          const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2;
          }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 5000;
          filter.Q.value = 2;
          const gain = ctx.createGain();
          gain.gain.value = 0.02;
          source.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          source.start(now);
          break;
        }
      }
    };

    // Play ambient sounds at random intervals
    const sounds: SoundType[] = ["rustle", "page-turn", "press", "quill"];
    intervalRef.current = setInterval(() => {
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      playSound(sound);
    }, 8000 + Math.random() * 12000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, [enabled]);

  return (
    <button
      className="sound-toggle"
      onClick={() => setEnabled((prev) => !prev)}
      aria-label={enabled ? "Mute ambient sounds" : "Enable ambient sounds"}
      title={enabled ? "Mute ambient sounds (m)" : "Enable ambient sounds (m)"}
    >
      {enabled ? "♪ Sound On" : "♪ Sound Off"}
    </button>
  );
}