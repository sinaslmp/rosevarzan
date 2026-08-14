import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { OrderStatus, UserRole } from "@prisma/client";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles, RolesGuard } from "../auth/roles.guard";
import type { AuthenticatedUser } from "../auth/auth.types";
import { AdminService } from "./admin.service";
import { UpdateContactMessageDto, UpdateOrderStatusDto, UpdateUserDto, UpsertCategoryDto, UpsertProductDto } from "./dto/admin.dto";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRole.ADMIN])
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("overview") overview() { return this.admin.overview(); }

  @Get("categories") categories() { return this.admin.categories(); }
  @Post("categories") createCategory(@Body() input: UpsertCategoryDto) { return this.admin.createCategory(input); }
  @Patch("categories/:id") updateCategory(@Param("id") id: string, @Body() input: Partial<UpsertCategoryDto>) { return this.admin.updateCategory(id, input); }
  @Delete("categories/:id") deleteCategory(@Param("id") id: string) { return this.admin.deleteCategory(id); }

  @Get("products") products() { return this.admin.products(); }
  @Post("products") createProduct(@Body() input: UpsertProductDto) { return this.admin.createProduct(input); }
  @Patch("products/:id") updateProduct(@Param("id") id: string, @Body() input: Partial<UpsertProductDto>) { return this.admin.updateProduct(id, input); }
  @Delete("products/:id") deleteProduct(@Param("id") id: string) { return this.admin.deleteProduct(id); }

  @Get("orders") orders(@Query("status") status?: OrderStatus) { return this.admin.orders(status); }
  @Get("orders/:id") order(@Param("id") id: string) { return this.admin.order(id); }
  @Patch("orders/:id/status") updateOrderStatus(@Param("id") id: string, @Body() input: UpdateOrderStatusDto, @CurrentUser() actor: AuthenticatedUser) { return this.admin.updateOrderStatus(id, input, actor.id); }

  @Get("users") users() { return this.admin.users(); }
  @Patch("users/:id") updateUser(@Param("id") id: string, @Body() input: UpdateUserDto, @CurrentUser() actor: AuthenticatedUser) { return this.admin.updateUser(id, input, actor.id); }

  @Get("contact-messages") contactMessages() { return this.admin.contactMessages(); }
  @Patch("contact-messages/:id") updateContactMessage(@Param("id") id: string, @Body() input: UpdateContactMessageDto) { return this.admin.updateContactMessage(id, input); }
}
