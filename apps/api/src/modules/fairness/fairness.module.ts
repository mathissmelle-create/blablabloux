import { Module } from "@nestjs/common";
import { FairnessController } from "./fairness.controller.js";
import { FairnessService } from "./fairness.service.js";

@Module({
  controllers: [FairnessController],
  providers: [FairnessService],
  exports: [FairnessService],
})
export class FairnessModule {}
