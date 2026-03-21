"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

type ReelItem = {
  name: string;
  value: number;
  rarity: "consumer" | "industrial" | "milspec" | "restricted" | "classified" | "covert";
  goldEligible?: boolean;
};

type CaseOpeningStageProps = {
  title: string;
  casePrice: number;
};

const ITEM_WIDTH = 170;
const ITEM_GAP = 12;
const LANDING_INDEX_SCRIPT = [5, 11, 3, 15, 7, 19, 4, 13];
const GOLD_INDEX_SCRIPT = [1, 0, 2, 1, 0, 2];

const BASE_ITEMS: ReelItem[] = [
  { name: "P250 | Sand Dune", value: 0.14, rarity: "consumer" },
  { name: "MP9 | Food Chain", value: 2.3, rarity: "restricted" },
  { name: "M4A1-S | Night Terror", value: 3.11, rarity: "milspec" },
  { name: "AWP | Hyper Beast", value: 12.2, rarity: "classified" },
  { name: "AK-47 | Neon Rider", value: 22.4, rarity: "covert" },
  { name: "M4A4 | Desolate Space", value: 6.4, rarity: "restricted" },
  { name: "USP-S | Cortex", value: 4.8, rarity: "restricted" },
  { name: "Desert Eagle | Ocean Drive", value: 48.1, rarity: "covert" },
  { name: "AWP | Fade", value: 413.0, rarity: "covert", goldEligible: true },
  { name: "AK-47 | Gold Arabesque", value: 1892.0, rarity: "covert", goldEligible: true },
];

const GOLD_POOL: ReelItem[] = BASE_ITEMS.filter((item) => item.goldEligible);

function rarityClass(rarity: ReelItem["rarity"]) {
  if (rarity === "covert") return "border-rarityRed/70";
  if (rarity === "classified") return "border-rarityPink/70";
  if (rarity === "restricted") return "border-rarityPurple/70";
  if (rarity === "milspec") return "border-rarityBlue/70";
  return "border-graphite/70";
}

export function CaseOpeningStage({ title, casePrice }: CaseOpeningStageProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const goldTrackRef = useRef<HTMLDivElement | null>(null);
  const [scriptCursor, setScriptCursor] = useState(0);
  const [goldCursor, setGoldCursor] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGoldSpinning, setIsGoldSpinning] = useState(false);
  const [result, setResult] = useState<ReelItem | null>(null);
  const [goldResult, setGoldResult] = useState<ReelItem | null>(null);

  const reelItems = useMemo(() => Array.from({ length: 6 }).flatMap(() => BASE_ITEMS), []);
  const goldReelItems = useMemo(() => Array.from({ length: 7 }).flatMap(() => GOLD_POOL), []);

  const playAuthoritativeSpin = () => {
    if (!trackRef.current || isSpinning) {
      return;
    }

    const target = LANDING_INDEX_SCRIPT[scriptCursor % LANDING_INDEX_SCRIPT.length] ?? 0;
    const loopOffset = BASE_ITEMS.length * 3;
    const indexOnTrack = loopOffset + target;
    const x = -(indexOnTrack * (ITEM_WIDTH + ITEM_GAP));

    setIsSpinning(true);
    setGoldResult(null);

    gsap.fromTo(
      trackRef.current,
      { x: -((BASE_ITEMS.length + target) * (ITEM_WIDTH + ITEM_GAP)) },
      {
        x,
        duration: 4.2,
        ease: "power4.out",
        onComplete: () => {
          const landedItem = BASE_ITEMS[target];
          if (!landedItem) {
            setIsSpinning(false);
            return;
          }

          setResult(landedItem);
          setScriptCursor((value) => value + 1);
          setIsSpinning(false);

          const qualifiesForGoldSpin = landedItem.value >= casePrice * 8 && GOLD_POOL.length > 0;
          if (qualifiesForGoldSpin) {
            void playGoldSpin();
          }
        },
      },
    );
  };

  const playGoldSpin = async () => {
    if (!goldTrackRef.current || isGoldSpinning) {
      return;
    }

    setIsGoldSpinning(true);
    const target = GOLD_INDEX_SCRIPT[goldCursor % GOLD_INDEX_SCRIPT.length] ?? 0;
    const loopOffset = GOLD_POOL.length * 4;
    const indexOnTrack = loopOffset + target;
    const x = -(indexOnTrack * (ITEM_WIDTH + ITEM_GAP));

    await gsap.fromTo(
      goldTrackRef.current,
      { x: -((GOLD_POOL.length + target) * (ITEM_WIDTH + ITEM_GAP)) },
      {
        x,
        duration: 2.7,
        ease: "power3.out",
      },
    );

    const landed = GOLD_POOL[target];
    if (landed) {
      setGoldResult(landed);
    }
    setGoldCursor((value) => value + 1);
    setIsGoldSpinning(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-silver">authoritative animation stage</p>
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        <button disabled={isSpinning} className="btn-primary disabled:opacity-60" onClick={playAuthoritativeSpin}>
          {isSpinning ? "Spinning..." : "Open (Server Event)"}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[12px] border border-graphite/70 bg-panel2/75 p-3">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-[180px] -translate-x-1/2 border-x border-accent/40 bg-accent/5" />
        <motion.div ref={trackRef} className="flex gap-3 will-change-transform" initial={false}>
          {reelItems.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className={`h-24 w-[170px] shrink-0 rounded-[9px] border ${rarityClass(item.rarity)} bg-black/30 p-3`}
            >
              <p className="truncate text-xs text-silver">{item.name}</p>
              <p className="mt-2 text-sm font-semibold text-white">${item.value.toFixed(2)}</p>
              {item.goldEligible ? <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-accent">gold spin eligible</p> : null}
            </div>
          ))}
        </motion.div>
      </div>

      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[10px] border border-accent/40 bg-accent/10 p-3"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-accent">landed item</p>
          <p className="mt-1 text-sm text-white">
            {result.name} • ${result.value.toFixed(2)}
          </p>
        </motion.div>
      ) : null}

      {isGoldSpinning || goldResult ? (
        <div className="rounded-[12px] border border-amber-300/40 bg-amber-200/10 p-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-amber-300">gold spin lane</p>
          <div className="relative overflow-hidden rounded-[10px] border border-amber-300/30 bg-black/20 p-3">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-[180px] -translate-x-1/2 border-x border-amber-300/50 bg-amber-400/10" />
            <motion.div ref={goldTrackRef} className="flex gap-3 will-change-transform" initial={false}>
              {goldReelItems.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="h-20 w-[170px] shrink-0 rounded-[8px] border border-amber-300/40 bg-black/30 p-3">
                  <p className="truncate text-xs text-amber-100">{item.name}</p>
                  <p className="mt-2 text-sm font-semibold text-white">${item.value.toFixed(2)}</p>
                </div>
              ))}
            </motion.div>
          </div>
          {goldResult ? (
            <p className="mt-3 text-sm text-amber-100">
              Gold spin result: {goldResult.name} (${goldResult.value.toFixed(2)})
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
