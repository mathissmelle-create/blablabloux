import { BadRequestException, Injectable } from "@nestjs/common";
import { BattleStatus } from "@prisma/client";

const ALLOWED_TRANSITIONS: Record<BattleStatus, BattleStatus[]> = {
  CREATED: ["WAITING_FOR_PLAYERS", "CANCELLED"],
  WAITING_FOR_PLAYERS: ["LOCKED", "CANCELLED"],
  LOCKED: ["START_COUNTDOWN", "CANCELLED"],
  START_COUNTDOWN: ["ACTIVE_ROUNDS", "CANCELLED"],
  ACTIVE_ROUNDS: ["RESOLVING", "CANCELLED"],
  RESOLVING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class BattleStateMachineService {
  ensureTransition(current: BattleStatus, next: BattleStatus) {
    const allowed = ALLOWED_TRANSITIONS[current] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid battle state transition: ${current} -> ${next}`);
    }
  }
}
