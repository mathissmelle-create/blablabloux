import { BattleMode } from "@prisma/client";

export const BATTLE_FORMATS = [
  "1v1",
  "1v1v1",
  "1v1v1v1",
  "2v2v2",
  "3v3",
] as const;

export type BattleFormat = (typeof BATTLE_FORMATS)[number];

export const BATTLE_MODES = [
  "standard",
  "crazy",
  "jackpot",
  "terminal",
  "crazy_jackpot",
] as const;

export type BattleModeInput = (typeof BATTLE_MODES)[number];

export type BattlePrivacyInput = "public" | "private";

export function formatToSeats(format: BattleFormat) {
  if (format === "1v1") return { maxPlayers: 2, teamSize: 1, prismaFormat: "ONE_VS_ONE" as const };
  if (format === "1v1v1") return { maxPlayers: 3, teamSize: 1, prismaFormat: "ONE_VS_ONE_VS_ONE" as const };
  if (format === "1v1v1v1") return { maxPlayers: 4, teamSize: 1, prismaFormat: "ONE_VS_ONE_VS_ONE_VS_ONE" as const };
  if (format === "2v2v2") return { maxPlayers: 6, teamSize: 2, prismaFormat: "TWO_VS_TWO_VS_TWO" as const };
  return { maxPlayers: 6, teamSize: 3, prismaFormat: "THREE_VS_THREE" as const };
}

export function parseMode(mode: BattleModeInput): BattleMode {
  if (mode === "standard") return BattleMode.STANDARD;
  if (mode === "crazy") return BattleMode.CRAZY;
  if (mode === "jackpot") return BattleMode.JACKPOT;
  if (mode === "terminal") return BattleMode.TERMINAL;
  return BattleMode.CRAZY_JACKPOT;
}
