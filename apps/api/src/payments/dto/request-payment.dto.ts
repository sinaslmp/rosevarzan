import { IsString, MaxLength, MinLength } from "class-validator";

export class RequestPaymentDto {
  @IsString() @MinLength(1) @MaxLength(60) orderId!: string;
}
