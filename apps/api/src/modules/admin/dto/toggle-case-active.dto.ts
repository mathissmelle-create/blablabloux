import { IsBoolean } from "class-validator";

export class ToggleCaseActiveDto {
  @IsBoolean()
  active!: boolean;
}
