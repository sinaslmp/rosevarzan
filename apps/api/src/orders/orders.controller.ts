import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { OptionalJwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/auth.types";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post() @HttpCode(201) @UseGuards(OptionalJwtAuthGuard)
  create(@Body() input: CreateOrderDto, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.orders.create(input, user);
  }

  @Get(":id") @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.orders.findOne(id, user);
  }
}
