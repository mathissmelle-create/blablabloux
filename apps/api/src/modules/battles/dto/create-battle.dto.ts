import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { BATTLE_FORMATS, BATTLE_MODES } from "../battle.types.js";

export class CreateBattleDto {
  @IsIn(BATTLE_MODES)
  mode!: (typeof BATTLE_MODES)[number];

  @IsIn(BATTLE_FORMATS)
  format!: (typeof BATTLE_FORMATS)[number];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  caseVersionIds!: string[];

  @IsString()
  @IsIn(["public", "private"])
  privacy!: "public" | "private";

  @IsOptional()
  @IsBoolean()
  enableBots?: boolean = false;

  @IsOptional()
  @IsString()
  inviteCode?: string;

  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(5)
  countdownSeconds?: number = 4;
}
