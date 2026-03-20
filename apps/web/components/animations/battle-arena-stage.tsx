"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Participant = {
  id: string;
  name: string;
  team: string;
};

type RoundPacket = {
  round: number;
  drops: Array<{ participantId: string; item: string; value: number; goldSpin?: boolean }>;
};

const PARTICIPANTS: Participant[] = [
  { id: "p1", name: "Vortex", team: "Alpha" },
  { id: "p2", name: "Nemesis", team: "Alpha" },
  { id: "p3", name: "Photon", team: "Omega" },
  { id: "p4", name: "Arcane", team: "Omega" },
];

const AUTHORITATIVE_ROUNDS: RoundPacket[] = [
  {
    round: 1,
    drops: [
      { participantId: "p1", item: "M4A4 | Desolate Space", value: 6.2 },
      { participantId: "p2", item: "AWP | Asiimov", value: 82.4, goldSpin: true },
      { participantId: "p3", item: "USP-S | Cortex", value: 4.1 },
      { participantId: "p4", item: "AK-47 | Neon Rider", value: 21.9 },
    ],
  },
  {
    round: 2,
    drops: [
      { participantId: "p1", item: "AWP | Hyper Beast", value: 13.7 },
      { participantId: "p2", item: "MP9 | Food Chain", value: 2.4 },
      { participantId: "p3", item: "Desert Eagle | Ocean Drive", value: 42.6 },
      { participantId: "p4", item: "M4A1-S | Printstream", value: 63.4 },
    ],
  },
  {
    round: 3,
    drops: [
      { participantId: "p1", item: "AK-47 | Gold Arabesque", value: 1904.0, goldSpin: true },
      { participantId: "p2", item: "USP-S | Orion", value: 29.1 },
      { participantId: "p3", item: "AWP | Fade", value: 409.6, goldSpin: true },
      { participantId: "p4", item: "M4A4 | Temukau", value: 12.3 },
    ],
  },
];

export function BattleArenaStage() {
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [flashGoldSpin, setFlashGoldSpin] = useState(false);

  const visibleRounds = useMemo(() => AUTHORITATIVE_ROUNDS.slice(0, cursor), [cursor]);
  const currentRound = AUTHORITATIVE_ROUNDS[cursor];
  const totals = useMemo(() => {
    const scores = new Map<string, number>();
    for (const participant of PARTICIPANTS) {
      scores.set(participant.id, 0);
    }
    for (const packet of visibleRounds) {
      for (const drop of packet.drops) {
        scores.set(drop.participantId, (scores.get(drop.participantId) ?? 0) + drop.value);
      }
    }
    return scores;
  }, [visibleRounds]);

  const playNextPacket = async () => {
    if (playing || !currentRound) {
      return;
    }
    setPlaying(true);

    const hasGold = currentRound.drops.some((drop) => drop.goldSpin);
    if (hasGold) {
      setFlashGoldSpin(true);
      await new Promise((resolve) => setTimeout(resolve, 550));
      setFlashGoldSpin(false);
    }

    await new Promise((resolve) => setTimeout(resolve, 450));
    setCursor((value) => Math.min(value + 1, AUTHORITATIVE_ROUNDS.length));
    setPlaying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Synchronized Battle Stage</h3>
        <button disabled={playing || !currentRound} className="btn-primary disabled:opacity-60" onClick={playNextPacket}>
          {currentRound ? `Play Round ${currentRound.round}` : "Battle Complete"}
        </button>
      </div>

      <AnimatePresence>
        {flashGoldSpin ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-amber-300/40 bg-amber-200/10 p-3 text-center text-sm text-amber-200"
          >
            Gold Spin Triggered • Global animation interrupt packet
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-3 md:grid-cols-2">
        {PARTICIPANTS.map((participant) => (
          <motion.article
            key={participant.id}
            whileHover={{ rotateX: 5, rotateY: -6, y: -2 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="rounded-2xl border border-graphite/70 bg-panel2/75 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-silver">{participant.team}</p>
                <p className="text-sm font-semibold text-white">{participant.name}</p>
              </div>
              <p className="text-sm text-accent">${(totals.get(participant.id) ?? 0).toFixed(2)}</p>
            </div>

            <div className="mt-3 space-y-2">
              {visibleRounds.map((packet) => {
                const drop = packet.drops.find((entry) => entry.participantId === participant.id);
                if (!drop) {
                  return null;
                }
                return (
                  <motion.div
                    key={`${participant.id}-${packet.round}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg border border-graphite/70 bg-black/20 px-3 py-2 text-xs text-silver"
                  >
                    R{packet.round}: {drop.item} (${drop.value.toFixed(2)})
                  </motion.div>
                );
              })}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
