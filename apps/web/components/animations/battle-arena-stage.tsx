"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type BattleFormat = "1v1" | "1v1v1" | "1v1v1v1" | "2v2v2" | "3v3";
type BattleMode = "standard" | "crazy" | "jackpot" | "terminal" | "crazy_jackpot";

type Participant = {
  id: string;
  username: string;
  teamIndex: number;
  seatIndex: number;
};

type RoundDrop = {
  participantId: string;
  itemName: string;
  value: number;
  rarity: "blue" | "purple" | "pink" | "red" | "gold";
  baitLeft: string;
  baitRight: string;
  goldSpin: boolean;
};

type AuthoritativeRoundPacket = {
  sequence: number;
  roundNumber: number;
  serverTimestampMs: number;
  animationStartTimestampMs: number;
  drops: RoundDrop[];
};

const FORMAT_OPTIONS: BattleFormat[] = ["1v1", "1v1v1", "1v1v1v1", "2v2v2", "3v3"];
const MODE_OPTIONS: BattleMode[] = ["standard", "crazy", "jackpot", "terminal", "crazy_jackpot"];

const ITEM_SET = [
  { name: "M4A1-S | Night Terror", value: 3.1, rarity: "blue" as const },
  { name: "USP-S | Cortex", value: 4.7, rarity: "purple" as const },
  { name: "AK-47 | Neon Rider", value: 22.2, rarity: "pink" as const },
  { name: "AWP | Hyper Beast", value: 14.5, rarity: "pink" as const },
  { name: "Desert Eagle | Ocean Drive", value: 47.2, rarity: "red" as const },
  { name: "M4A1-S | Printstream", value: 63.4, rarity: "red" as const },
  { name: "AWP | Fade", value: 402.5, rarity: "gold" as const },
  { name: "AK-47 | Gold Arabesque", value: 1804.3, rarity: "gold" as const },
];

function rarityClass(rarity: RoundDrop["rarity"]) {
  if (rarity === "gold") return "border-amber-300/60 bg-amber-300/10";
  if (rarity === "red") return "border-red-400/55 bg-red-400/10";
  if (rarity === "pink") return "border-pink-400/55 bg-pink-400/10";
  if (rarity === "purple") return "border-purple-400/55 bg-purple-400/10";
  return "border-blue-400/55 bg-blue-400/10";
}

function getParticipants(format: BattleFormat): Participant[] {
  if (format === "1v1") {
    return [
      { id: "p1", username: "Vortex", teamIndex: 0, seatIndex: 0 },
      { id: "p2", username: "Nemesis", teamIndex: 1, seatIndex: 1 },
    ];
  }
  if (format === "1v1v1") {
    return [
      { id: "p1", username: "Vortex", teamIndex: 0, seatIndex: 0 },
      { id: "p2", username: "Nemesis", teamIndex: 1, seatIndex: 1 },
      { id: "p3", username: "Photon", teamIndex: 2, seatIndex: 2 },
    ];
  }
  if (format === "1v1v1v1") {
    return [
      { id: "p1", username: "Vortex", teamIndex: 0, seatIndex: 0 },
      { id: "p2", username: "Nemesis", teamIndex: 1, seatIndex: 1 },
      { id: "p3", username: "Photon", teamIndex: 2, seatIndex: 2 },
      { id: "p4", username: "Arcane", teamIndex: 3, seatIndex: 3 },
    ];
  }
  if (format === "2v2v2") {
    return [
      { id: "p1", username: "Vortex", teamIndex: 0, seatIndex: 0 },
      { id: "p2", username: "Nemesis", teamIndex: 0, seatIndex: 1 },
      { id: "p3", username: "Photon", teamIndex: 1, seatIndex: 2 },
      { id: "p4", username: "Arcane", teamIndex: 1, seatIndex: 3 },
      { id: "p5", username: "Reaper", teamIndex: 2, seatIndex: 4 },
      { id: "p6", username: "Cipher", teamIndex: 2, seatIndex: 5 },
    ];
  }
  return [
    { id: "p1", username: "Vortex", teamIndex: 0, seatIndex: 0 },
    { id: "p2", username: "Nemesis", teamIndex: 0, seatIndex: 1 },
    { id: "p3", username: "Photon", teamIndex: 0, seatIndex: 2 },
    { id: "p4", username: "Arcane", teamIndex: 1, seatIndex: 3 },
    { id: "p5", username: "Reaper", teamIndex: 1, seatIndex: 4 },
    { id: "p6", username: "Cipher", teamIndex: 1, seatIndex: 5 },
  ];
}

function buildAuthoritativePackets(participants: Participant[]) {
  const rounds = 5;
  const packets: AuthoritativeRoundPacket[] = [];
  let sequence = 120;
  for (let round = 1; round <= rounds; round += 1) {
    const drops = participants.map((participant) => {
      const baseIndex = (participant.seatIndex * 2 + round * 3) % ITEM_SET.length;
      const item = ITEM_SET[baseIndex] ?? ITEM_SET[0];
      const leftItem = ITEM_SET[(baseIndex + ITEM_SET.length - 1) % ITEM_SET.length] ?? ITEM_SET[0];
      const rightItem = ITEM_SET[(baseIndex + 1) % ITEM_SET.length] ?? ITEM_SET[0];
      return {
        participantId: participant.id,
        itemName: item?.name ?? "Unknown",
        value: item?.value ?? 0,
        rarity: item?.rarity ?? "blue",
        baitLeft: leftItem?.name ?? "Unknown",
        baitRight: rightItem?.name ?? "Unknown",
        goldSpin: (item?.value ?? 0) >= 8 * 9.9,
      } satisfies RoundDrop;
    });

    packets.push({
      sequence: sequence++,
      roundNumber: round,
      serverTimestampMs: Date.now() + round * 1000,
      animationStartTimestampMs: Date.now() + round * 1000 + 700,
      drops,
    });
  }
  return packets;
}

export function BattleArenaStage() {
  const [format, setFormat] = useState<BattleFormat>("2v2v2");
  const [mode, setMode] = useState<BattleMode>("standard");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activePacket, setActivePacket] = useState<AuthoritativeRoundPacket | null>(null);
  const [flashGoldSpin, setFlashGoldSpin] = useState(false);

  const participants = useMemo(() => getParticipants(format), [format]);
  const packets = useMemo(() => buildAuthoritativePackets(participants), [participants]);
  const revealedPackets = useMemo(() => packets.slice(0, cursor), [packets, cursor]);
  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const participant of participants) {
      map.set(participant.id, 0);
    }
    for (const packet of revealedPackets) {
      for (const drop of packet.drops) {
        map.set(drop.participantId, (map.get(drop.participantId) ?? 0) + drop.value);
      }
    }
    return map;
  }, [participants, revealedPackets]);

  const nextPacket = packets[cursor] ?? null;
  const leader = useMemo(() => {
    const entries = participants.map((participant) => ({
      participantId: participant.id,
      score: totals.get(participant.id) ?? 0,
    }));
    if (entries.length === 0) return null;
    if (mode === "crazy") {
      return [...entries].sort((a, b) => a.score - b.score)[0]?.participantId ?? null;
    }
    return [...entries].sort((a, b) => b.score - a.score)[0]?.participantId ?? null;
  }, [participants, totals, mode]);

  const runNextRound = async () => {
    if (!nextPacket || playing) return;
    setPlaying(true);
    setActivePacket(nextPacket);

    const wait = Math.max(0, nextPacket.animationStartTimestampMs - Date.now());
    await new Promise((resolve) => setTimeout(resolve, wait));
    const hasGold = nextPacket.drops.some((drop) => drop.goldSpin);
    if (hasGold) {
      setFlashGoldSpin(true);
      await new Promise((resolve) => setTimeout(resolve, 550));
      setFlashGoldSpin(false);
    }
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setCursor((value) => Math.min(value + 1, packets.length));
    setPlaying(false);
  };

  const resetSimulation = () => {
    setCursor(0);
    setPlaying(false);
    setFlashGoldSpin(false);
    setActivePacket(null);
  };

  const groupedTeams = useMemo(() => {
    const map = new Map<number, Participant[]>();
    for (const participant of participants) {
      const bucket = map.get(participant.teamIndex) ?? [];
      bucket.push(participant);
      map.set(participant.teamIndex, bucket);
    }
    return Array.from(map.entries()).map(([teamIndex, members]) => ({ teamIndex, members }));
  }, [participants]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-silver">authoritative websocket packet simulation</p>
          <h3 className="text-lg font-semibold text-white">Synchronized Battle Stage</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={resetSimulation}>
            Reset
          </button>
          <button className="btn-primary disabled:opacity-60" disabled={!nextPacket || playing} onClick={runNextRound}>
            {nextPacket ? `Play Round ${nextPacket.roundNumber}` : "Battle Complete"}
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-xl border border-graphite/70 bg-panel2/70 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-silver">Format</p>
          <div className="flex flex-wrap gap-2">
            {FORMAT_OPTIONS.map((entry) => (
              <button
                key={entry}
                className={entry === format ? "btn-secondary" : "btn-ghost"}
                onClick={() => {
                  setFormat(entry);
                  resetSimulation();
                }}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-graphite/70 bg-panel2/70 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-silver">Mode</p>
          <div className="flex flex-wrap gap-2">
            {MODE_OPTIONS.map((entry) => (
              <button key={entry} className={entry === mode ? "btn-secondary" : "btn-ghost"} onClick={() => setMode(entry)}>
                {entry}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {flashGoldSpin ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-amber-300/40 bg-amber-200/10 p-3 text-center text-sm text-amber-200"
          >
            gold_spin_triggered • global pause + dedicated gold respin lane for triggering player
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <section className="space-y-4 rounded-2xl border border-graphite/70 bg-panel2/65 p-4">
          <div className="rounded-xl border border-graphite/70 bg-black/20 p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-silver">Top Section • Player Slots / Teams / Totals</p>
            <div className={format === "1v1v1v1" ? "grid grid-cols-2 gap-2 lg:grid-cols-4" : "grid gap-2 md:grid-cols-2"}>
              {groupedTeams.map((team) => {
                const teamTotal = team.members.reduce((acc, member) => acc + (totals.get(member.id) ?? 0), 0);
                const singleMemberTeam = team.members.length === 1;
                return (
                  <div key={team.teamIndex} className="rounded-lg border border-graphite/70 bg-panel2/75 p-2">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.14em] text-silver">
                        {singleMemberTeam ? `Seat ${team.members[0]?.seatIndex ?? 0}` : `Team ${team.teamIndex + 1}`}
                      </p>
                      <p className="text-xs text-accent">${teamTotal.toFixed(2)}</p>
                    </div>
                    <div className={format === "3v3" ? "space-y-1" : "grid gap-1"}>
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between rounded border px-2 py-1 text-xs ${
                            leader === member.id ? "border-accent/60 bg-accent/10 text-white" : "border-graphite/60 bg-black/25 text-silver"
                          }`}
                        >
                          <span>{member.username}</span>
                          <span>${(totals.get(member.id) ?? 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-graphite/70 bg-black/20 p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-silver">Center Section • Synchronized Reels</p>
            <div className="grid gap-2 md:grid-cols-2">
              {participants.map((participant) => {
                const activeDrop = activePacket?.drops.find((entry) => entry.participantId === participant.id);
                const settledDrop = revealedPackets.at(-1)?.drops.find((entry) => entry.participantId === participant.id);
                const drop = activeDrop ?? settledDrop;
                return (
                  <div key={participant.id} className="rounded-lg border border-graphite/70 bg-panel2/75 p-2">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-silver">{participant.username}</span>
                      <span className="text-silver">seat {participant.seatIndex}</span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border border-graphite/70 bg-black/20 p-2">
                      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 border-x border-accent/40 bg-accent/5" />
                      <motion.div
                        animate={playing ? { x: [0, -80, -160, -220] } : { x: -120 }}
                        transition={playing ? { duration: 1.6, ease: "easeOut" } : { duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <div className="min-w-[110px] rounded border border-graphite/60 bg-black/35 px-2 py-2 text-[10px] text-silver">
                          {drop?.baitLeft ?? "Bait"}
                        </div>
                        <div className={`min-w-[110px] rounded border px-2 py-2 text-[10px] text-white ${drop ? rarityClass(drop.rarity) : "border-graphite/60 bg-black/35"}`}>
                          {drop?.itemName ?? "Result"}
                        </div>
                        <div className="min-w-[110px] rounded border border-graphite/60 bg-black/35 px-2 py-2 text-[10px] text-silver">
                          {drop?.baitRight ?? "Near miss"}
                        </div>
                      </motion.div>
                    </div>
                    <p className="mt-1 text-xs text-silver">{drop ? `$${drop.value.toFixed(2)}` : "Waiting for round_start packet"}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-graphite/70 bg-black/20 p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-silver">Bottom Section • Round Timeline / Item History</p>
            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-2">
                {revealedPackets.map((packet) => (
                  <div key={packet.sequence} className="w-56 rounded-lg border border-graphite/70 bg-panel2/75 p-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-silver">
                      round {packet.roundNumber} • seq {packet.sequence}
                    </p>
                    <div className="mt-2 space-y-1">
                      {packet.drops.map((drop) => (
                        <div key={`${packet.roundNumber}-${drop.participantId}`} className="rounded border border-graphite/60 bg-black/30 px-2 py-1 text-[10px] text-silver">
                          {drop.itemName} (${drop.value.toFixed(2)})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-xl border border-graphite/70 bg-panel2/75 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-silver">Realtime sync stats</p>
            <ul className="mt-2 space-y-1 text-sm text-silver">
              <li>websocket source: authoritative</li>
              <li>current sequence: {revealedPackets.at(-1)?.sequence ?? 0}</li>
              <li>participants: {participants.length}</li>
              <li>spectators: 143</li>
            </ul>
          </div>

          {(mode === "jackpot" || mode === "crazy_jackpot") && revealedPackets.length > 0 ? (
            <div className="rounded-xl border border-graphite/70 bg-panel2/75 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-silver">Jackpot weighted bar</p>
              <div className="mt-2 h-4 overflow-hidden rounded-full border border-graphite/70 bg-black/25">
                <div className="flex h-full w-full">
                  {participants.map((participant) => {
                    const contribution = totals.get(participant.id) ?? 0;
                    const total = Array.from(totals.values()).reduce((acc, value) => acc + value, 0) || 1;
                    const width = Math.max(5, (contribution / total) * 100);
                    return (
                      <div
                        key={participant.id}
                        style={{ width: `${width}%` }}
                        className="h-full border-r border-black/30 bg-gradient-to-r from-accent/70 to-amber-300/40"
                      />
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 text-xs text-silver">Indicator stop is bound to backend-selected winning range.</p>
            </div>
          ) : null}

          <div className="rounded-xl border border-graphite/70 bg-panel2/75 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-silver">Mode rule</p>
            <p className="mt-2 text-sm text-silver">
              {mode === "crazy" ? "Lowest total wins (crazy mode)." : null}
              {mode === "terminal" ? "Final round decides the winner (terminal mode)." : null}
              {mode === "jackpot" ? "Winner drawn by weighted contribution." : null}
              {mode === "crazy_jackpot" ? "Inverse weighted contribution draw." : null}
              {mode === "standard" ? "Highest total wins (standard)." : null}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
