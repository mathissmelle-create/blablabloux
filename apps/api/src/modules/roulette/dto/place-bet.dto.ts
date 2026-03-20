import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { RouletteBetType, RouletteColor } from "@prisma/client";

export class PlaceBetDto {
  @IsEnum(RouletteBetType)
  betType!: RouletteBetType;

  @IsOptional()
  @IsEnum(RouletteColor)
  color?: RouletteColor;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(14)
  segment?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  requestId?: string;
}
