import { Transform } from "class-transformer";
import { IsBooleanString, IsOptional, IsString, MaxLength } from "class-validator";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class ListProductsDto {
  @IsOptional() @IsString() @MaxLength(120) @Transform(trim) category?: string;
  @IsOptional() @IsString() @MaxLength(120) @Transform(trim) search?: string;
  @IsOptional() @IsBooleanString() featured?: string;
}
