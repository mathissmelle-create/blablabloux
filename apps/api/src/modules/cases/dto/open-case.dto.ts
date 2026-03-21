import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class OpenCaseDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  amount?: number = 1;

  @IsOptional()
  @IsString()
  requestId?: string;
}
