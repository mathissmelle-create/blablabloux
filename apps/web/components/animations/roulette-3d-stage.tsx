"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const SEGMENTS = [
  { label: "G", color: "#16a34a" },
  { label: "R", color: "#ef4444" },
  { label: "B", color: "#111827" },
  { label: "R", color: "#ef4444" },
  { label: "B", color: "#111827" },
  { label: "R", color: "#ef4444" },
  { label: "B", color: "#111827" },
  { label: "R", color: "#ef4444" },
  { label: "B", color: "#111827" },
  { label: "R", color: "#ef4444" },
  { label: "B", color: "#111827" },
  { label: "R", color: "#ef4444" },
  { label: "B", color: "#111827" },
  { label: "R", color: "#ef4444" },
  { label: "Gold", color: "#f59e0b" },
];

const AUTHORITATIVE_SEGMENT_SCRIPT = [9, 2, 14, 4, 8, 1, 13, 5];

export function Roulette3DStage() {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const conic = useMemo(() => {
    const size = 360 / SEGMENTS.length;
    return SEGMENTS.map((segment, index) => `${segment.color} ${index * size}deg ${(index + 1) * size}deg`).join(", ");
  }, []);

  const resolveRound = () => {
    if (!wheelRef.current || spinning) {
      return;
    }
    const target = AUTHORITATIVE_SEGMENT_SCRIPT[cursor % AUTHORITATIVE_SEGMENT_SCRIPT.length] ?? 0;
    const segmentSize = 360 / SEGMENTS.length;
    const targetAngle = 360 * 6 + (360 - target * segmentSize - segmentSize / 2);

    setSpinning(true);
    gsap.fromTo(
      wheelRef.current,
      { rotate: 0 },
      {
        rotate: targetAngle,
        duration: 4.8,
        ease: "power4.out",
        onComplete: () => {
          setResultIndex(target);
          setCursor((value) => value + 1);
          setSpinning(false);
          gsap.set(wheelRef.current, { rotate: targetAngle % 360 });
        },
      },
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-silver">authoritative roulette packet</p>
          <h3 className="text-base font-semibold text-white">3D Wheel Stage</h3>
        </div>
        <button className="btn-primary disabled:opacity-60" disabled={spinning} onClick={resolveRound}>
          {spinning ? "Resolving..." : "Resolve Round"}
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        <div className="rounded-[12px] border border-graphite/70 bg-panel2/75 p-4">
          <div className="relative mx-auto h-[320px] w-[320px] [perspective:1000px]">
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-lg border border-accent/40 bg-accent/15 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-accent">
              pointer
            </div>
            <motion.div
              ref={wheelRef}
              className="absolute inset-0 rounded-full border-[10px] border-graphite/80 shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
              style={{
                background: `conic-gradient(${conic})`,
                transformStyle: "preserve-3d",
              }}
            />
            <div className="absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/35 bg-black/45" />
          </div>
        </div>

        <div className="space-y-2 rounded-[12px] border border-graphite/70 bg-panel2/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-silver">recent authoritative outcomes</p>
          {Array.from({ length: Math.min(cursor, 5) }).map((_, idx) => {
            const entry = AUTHORITATIVE_SEGMENT_SCRIPT[Math.max(0, cursor - idx - 1)] ?? 0;
            const segment = SEGMENTS[entry];
            return (
              <div key={`${entry}-${idx}`} className="rounded-[9px] border border-graphite/70 bg-black/20 px-3 py-2 text-sm text-silver">
                Round #{cursor - idx}: {segment?.label}
              </div>
            );
          })}
          {resultIndex !== null ? (
            <div className="rounded-[9px] border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
              Landed: {SEGMENTS[resultIndex]?.label}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
