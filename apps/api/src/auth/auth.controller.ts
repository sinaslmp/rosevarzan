import { Body, Controller, Get, HttpCode, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { ChangePasswordDto, LoginDto, RegisterDto, UpdateProfileDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import type { AuthenticatedUser } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register") @HttpCode(201)
  register(@Body() input: RegisterDto, @Res({ passthrough: true }) response: Response, @Req() request: Request) { return this.auth.register(input, response, this.meta(request)); }

  @Post("login") @HttpCode(200)
  login(@Body() input: LoginDto, @Res({ passthrough: true }) response: Response, @Req() request: Request) { return this.auth.login(input, response, this.meta(request)); }

  @Post("refresh") @HttpCode(200)
  refresh(@Res({ passthrough: true }) response: Response, @Req() request: Request) { return this.auth.refresh(request.cookies?.rv_refresh, response, this.meta(request)); }

  @Post("logout") @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) { return this.auth.logout(request.cookies?.rv_refresh, response); }

  @Get("me") @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) { return this.auth.me(user.id); }

  @Patch("profile") @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() input: UpdateProfileDto) { return this.auth.updateProfile(user.id, input); }

  @Post("change-password") @UseGuards(JwtAuthGuard) @HttpCode(200)
  changePassword(@CurrentUser() user: AuthenticatedUser, @Body() input: ChangePasswordDto, @Res({ passthrough: true }) response: Response) { return this.auth.changePassword(user.id, input, response); }

  private meta(request: Request) { return { userAgent: request.get("user-agent"), ipAddress: request.ip }; }
}
