import { Body, Controller, Post } from "@nestjs/common";
import { IsInt, IsString, Max, Min } from "class-validator";
import { FairnessService } from "./fairness.service.js";

class VerifyCaseTicketDto {
  @IsString()
  serverSeed!: string;

  @IsString()
  clientSeed!: string;

  @IsInt()
  @Min(0)
  nonce!: number;

  @IsString()
  caseVersionId!: string;

  @IsString()
  userId!: string;

  @IsInt()
  @Min(1)
  @Max(10_000_000)
  upperBoundExclusive!: number;
}

@Controller({ path: "fairness", version: "1" })
export class FairnessController {
  constructor(private readonly fairnessService: FairnessService) {}

  @Post("verify/case-ticket")
  verifyCaseTicket(@Body() dto: VerifyCaseTicketDto) {
    return this.fairnessService.deriveCaseTicket(dto, dto.upperBoundExclusive);
  }
}
