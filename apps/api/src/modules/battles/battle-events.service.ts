import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { RealtimeGateway } from "../realtime/realtime.gateway.js";

type BattleEventName =
  | "battle_created"
  | "player_joined"
  | "battle_locked"
  | "countdown_started"
  | "round_start"
  | "round_animation_start_timestamp"
  | "gold_spin_triggered"
  | "round_complete"
  | "battle_complete";

@Injectable()
export class BattleEventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async emitEvent<T extends Record<string, unknown>>(battleId: string, eventName: BattleEventName, data: T) {
    const serverTimestampMs = BigInt(Date.now());
    const updated = await this.prisma.battle.update({
      where: { id: battleId },
      data: {
        lastSequence: {
          increment: 1,
        },
      },
      select: {
        lastSequence: true,
      },
    });

    const payload = {
      battleId,
      eventName,
      sequence: updated.lastSequence,
      serverTimestampMs: Number(serverTimestampMs),
      data,
    };

    await this.prisma.battleEvent.create({
      data: {
        battleId,
        sequence: updated.lastSequence,
        eventType: eventName,
        serverTimestampMs,
        payload: payload as Prisma.InputJsonValue,
      },
    });

    this.realtimeGateway.emitToBattleRoom(battleId, "battle:event", payload);
    return payload;
  }
}
