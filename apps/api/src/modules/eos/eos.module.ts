import { Module } from "@nestjs/common";
import { EosService } from "./eos.service.js";

@Module({
  providers: [EosService],
  exports: [EosService],
})
export class EosModule {}
