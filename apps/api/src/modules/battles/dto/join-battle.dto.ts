import { IsOptional, IsString } from "class-validator";

export class JoinBattleDto {
  @IsOptional()
  @IsString()
  requestId?: string;
}
