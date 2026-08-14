import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class OrderItemInputDto {
  @IsString() @MinLength(1) @MaxLength(60) productId!: string;
  @IsInt() @Min(1) @Max(999) quantity!: number;
}

export class CreateOrderDto {
  @IsString() @MinLength(2) @MaxLength(120) @Transform(trim) contactName!: string;
  @IsString() @MinLength(6) @MaxLength(40) @Transform(trim) contactPhone!: string;
  @IsString() @MinLength(2) @MaxLength(120) @Transform(trim) province!: string;
  @IsString() @MinLength(2) @MaxLength(120) @Transform(trim) city!: string;
  @IsString() @MinLength(5) @MaxLength(500) @Transform(trim) addressLine!: string;
  @IsOptional() @IsString() @MaxLength(20) @Transform(trim) postalCode?: string;
  @IsOptional() @IsString() @MaxLength(500) @Transform(trim) note?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => OrderItemInputDto) items!: OrderItemInputDto[];
}
