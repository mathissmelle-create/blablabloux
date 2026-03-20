import { Module } from "@nestjs/common";
import { FairnessModule } from "../fairness/fairness.module.js";
import { LedgerModule } from "../ledger/ledger.module.js";
import { RouletteController } from "./roulette.controller.js";
import { RouletteService } from "./roulette.service.js";

@Module({
  imports: [FairnessModule, LedgerModule],
  controllers: [RouletteController],
  providers: [RouletteService],
})
export class RouletteModule {}
