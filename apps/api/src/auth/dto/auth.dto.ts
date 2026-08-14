import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const normalizeEmail = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim().toLowerCase() : value);

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(120) @Transform(trim) fullName!: string;
  @IsEmail() @MaxLength(254) @Transform(normalizeEmail) email!: string;
  @IsString() @MinLength(10) @MaxLength(128)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Password must contain a letter and a number" })
  password!: string;
  @IsOptional() @IsString() @MaxLength(40) @Transform(trim) phone?: string;
}

export class LoginDto {
  @IsEmail() @MaxLength(254) @Transform(normalizeEmail) email!: string;
  @IsString() @MinLength(1) @MaxLength(128) password!: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) @Transform(trim) fullName?: string;
  @IsOptional() @IsString() @MaxLength(40) @Transform(trim) phone?: string;
}

export class ChangePasswordDto {
  @IsString() @MinLength(1) @MaxLength(128) currentPassword!: string;
  @IsString() @MinLength(10) @MaxLength(128)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Password must contain a letter and a number" })
  newPassword!: string;
}
