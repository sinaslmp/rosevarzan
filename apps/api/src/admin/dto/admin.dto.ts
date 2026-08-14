import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { OrderStatus, UserRole } from "@prisma/client";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class UpsertCategoryDto {
  @IsString() @MinLength(2) @MaxLength(160) @Transform(trim) slug!: string;
  @IsString() @MinLength(2) @MaxLength(160) @Transform(trim) nameFa!: string;
  @IsString() @MinLength(2) @MaxLength(160) @Transform(trim) nameEn!: string;
  @IsString() @MaxLength(4000) @Transform(trim) descriptionFa!: string;
  @IsString() @MaxLength(4000) @Transform(trim) descriptionEn!: string;
  @IsOptional() @IsInt() @Min(0) @Max(9999) displayOrder?: number;
}

export class UpsertProductDto {
  @IsString() @MinLength(2) @MaxLength(160) @Transform(trim) slug!: string;
  @IsString() @MinLength(1) @MaxLength(60) categoryId!: string;
  @IsString() @MinLength(2) @MaxLength(200) @Transform(trim) nameFa!: string;
  @IsString() @MinLength(2) @MaxLength(200) @Transform(trim) nameEn!: string;
  @IsString() @MaxLength(500) @Transform(trim) summaryFa!: string;
  @IsString() @MaxLength(500) @Transform(trim) summaryEn!: string;
  @IsString() @MaxLength(8000) @Transform(trim) descriptionFa!: string;
  @IsString() @MaxLength(8000) @Transform(trim) descriptionEn!: string;
  @IsString() @MaxLength(60) @Transform(trim) unitFa!: string;
  @IsString() @MaxLength(60) @Transform(trim) unitEn!: string;
  @IsInt() @Min(0) @Max(1_000_000_000) price!: number;
  @IsInt() @Min(0) @Max(1_000_000) stock!: number;
  @IsOptional() @IsArray() @ArrayMaxSize(12) @IsUrl({}, { each: true }) images?: string[];
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() @Min(0) @Max(9999) displayOrder?: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status!: OrderStatus;
}

export class UpdateUserDto {
  @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateContactMessageDto {
  @IsBoolean() handled!: boolean;
}
