import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class CreateContactMessageDto {
  @IsString() @MinLength(2) @MaxLength(120) @Transform(trim) name!: string;
  @IsOptional() @IsEmail() @MaxLength(254) email?: string;
  @IsOptional() @IsString() @MaxLength(40) @Transform(trim) phone?: string;
  @IsOptional() @IsString() @MaxLength(160) @Transform(trim) subject?: string;
  @IsString() @MinLength(5) @MaxLength(4000) @Transform(trim) message!: string;
}
