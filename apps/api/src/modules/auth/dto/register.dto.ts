import { IsEmail, IsString, Length, Matches, MaxLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(3, 24)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "username can only contain alphanumeric characters and underscores",
  })
  username!: string;

  @IsString()
  @Length(8, 128)
  password!: string;

  @IsString()
  @MaxLength(64)
  clientSeed!: string;
}
