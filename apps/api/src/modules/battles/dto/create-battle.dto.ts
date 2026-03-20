import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { BattleMode } from "@prisma/client";

export class CreateBattleDto {
  @IsEnum(BattleMode)
  mode!: BattleMode;

  @IsInt()
  @Min(1)
  @Max(3)
  teamSize!: number;

  @IsInt()
  @Min(2)
  @Max(12)
  maxPlayers!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  caseVersionIds!: string[];

  @IsOptional()
  @IsBoolean()
  enableBots?: boolean = false;
}
