import { Module } from "@nestjs/common";
import { EosModule } from "../eos/eos.module.js";
import { FairnessModule } from "../fairness/fairness.module.js";
import { RealtimeModule } from "../realtime/realtime.module.js";
import { BattlesController } from "./battles.controller.js";
import { BattlesService } from "./battles.service.js";

@Module({
  imports: [EosModule, FairnessModule, RealtimeModule],
  controllers: [BattlesController],
  providers: [BattlesService],
  exports: [BattlesService],
})
export class BattlesModule {}
