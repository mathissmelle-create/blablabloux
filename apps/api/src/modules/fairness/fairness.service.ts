import { Injectable } from "@nestjs/common";
import { createHmac } from "node:crypto";
import {
  BattleFairnessInput,
  CaseFairnessInput,
  IFairnessEngine,
  RouletteFairnessInput,
  TicketResult,
} from "./interfaces/fairness-engine.interface.js";

@Injectable()
export class FairnessService implements IFairnessEngine {
  deriveCaseTicket(input: CaseFairnessInput, upperBoundExclusive: number): TicketResult {
    const message = `${input.clientSeed}:${input.nonce}:${input.caseVersionId}:${input.userId}`;
    return this.deriveTicket(input.serverSeed, message, upperBoundExclusive);
  }

  deriveBattleTicket(input: BattleFairnessInput, upperBoundExclusive: number): TicketResult {
    const message = `${input.battleId}:${input.roundNumber}:${input.seatIndex}:${input.eosBlockHash}`;
    return this.deriveTicket(input.battleServerSeed, message, upperBoundExclusive);
  }

  deriveRouletteSegment(input: RouletteFairnessInput, segments: number): TicketResult {
    const message = `${input.clientSeed}:${input.roundNumber}:${input.nonce}`;
    return this.deriveTicket(input.serverSeed, message, segments);
  }

  private deriveTicket(secret: string, message: string, upperBoundExclusive: number): TicketResult {
    const digest = createHmac("sha256", secret).update(message).digest("hex");
    const first8 = digest.slice(0, 8);
    const value = Number.parseInt(first8, 16);
    const max = 0xffffffff;
    const normalized = value / max;
    const ticket = Math.floor(normalized * upperBoundExclusive);
    return { ticket, hash: digest, normalized };
  }
}
