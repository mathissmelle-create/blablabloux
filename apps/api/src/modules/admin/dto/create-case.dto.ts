import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class CaseItemInputDto {
  @IsString()
  @MinLength(2)
  itemName!: string;

  @IsString()
  imageUrl!: string;

  @IsString()
  rarity!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  value!: number;

  @IsNumber()
  @IsPositive()
  weight!: number;

  @IsOptional()
  @IsBoolean()
  isGoldEligible?: boolean;
}

export class CreateCaseDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  imageUrl!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price!: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;

  @IsOptional()
  @IsBoolean()
  goldSpinEnabled?: boolean = true;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  goldSpinMultiplier?: number = 8;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CaseItemInputDto)
  items!: CaseItemInputDto[];
}
