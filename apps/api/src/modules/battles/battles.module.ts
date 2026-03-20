import { Module } from "@nestjs/common";
import { EosModule } from "../eos/eos.module.js";
import { FairnessModule } from "../fairness/fairness.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { RealtimeModule } from "../realtime/realtime.module.js";
import { BattleEventsService } from "./battle-events.service.js";
import { BattleFairnessService } from "./battle-fairness.service.js";
import { BattleStateMachineService } from "./battle-state-machine.service.js";
import { BattlesController } from "./battles.controller.js";
import { BattlesService } from "./battles.service.js";

@Module({
  imports: [EosModule, FairnessModule, RealtimeModule, PrismaModule],
  controllers: [BattlesController],
  providers: [BattlesService, BattleStateMachineService, BattleFairnessService, BattleEventsService],
  exports: [BattlesService],
})
export class BattlesModule {}
