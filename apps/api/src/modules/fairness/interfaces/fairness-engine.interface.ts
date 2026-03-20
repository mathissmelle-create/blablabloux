export type FairnessInputBase = {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
};

export type CaseFairnessInput = FairnessInputBase & {
  caseVersionId: string;
  userId: string;
};

export type BattleFairnessInput = {
  battleId: string;
  roundNumber: number;
  seatIndex: number;
  battleServerSeed: string;
  eosBlockHash: string;
};

export type RouletteFairnessInput = FairnessInputBase & {
  roundNumber: number;
};

export type TicketResult = {
  ticket: number;
  hash: string;
  normalized: number;
};

export interface IFairnessEngine {
  deriveCaseTicket(input: CaseFairnessInput, upperBoundExclusive: number): TicketResult;
  deriveBattleTicket(input: BattleFairnessInput, upperBoundExclusive: number): TicketResult;
  deriveRouletteSegment(input: RouletteFairnessInput, segments: number): TicketResult;
}
