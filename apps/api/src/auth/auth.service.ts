import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
import type { Response } from "express";
import { PrismaService } from "../common/prisma.service";
import type { AuthenticatedUser, TokenPayload } from "./auth.types";
import { ChangePasswordDto, LoginDto, RegisterDto, UpdateProfileDto } from "./dto/auth.dto";

type ClientMeta = { userAgent?: string; ipAddress?: string };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async register(input: RegisterDto, response: Response, meta: ClientMeta) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          passwordHash: await bcrypt.hash(input.password, 12),
          fullName: input.fullName,
          phone: input.phone || null,
        },
      });
      await this.prisma.auditLog.create({ data: { actorId: user.id, action: "auth.registered", entity: "User", entityId: user.id } });
      await this.issueSession(user, response, meta);
      return { data: { user: this.publicUser(user) } };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new ConflictException("An account with this email already exists");
      throw error;
    }
  }

  async login(input: LoginDto, response: Response, meta: ClientMeta) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.active || !(await bcrypt.compare(input.password, user.passwordHash))) throw new UnauthorizedException("Invalid email or password");
    await this.issueSession(user, response, meta);
    await this.prisma.auditLog.create({ data: { actorId: user.id, action: "auth.logged_in", entity: "User", entityId: user.id } });
    return { data: { user: this.publicUser(user) } };
  }

  async refresh(token: string | undefined, response: Response, meta: ClientMeta) {
    if (!token) throw new UnauthorizedException("Refresh session missing");
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token, { secret: this.refreshSecret });
      if (payload.type !== "refresh" || !payload.sid) throw new Error("Invalid token");
      const session = await this.prisma.refreshSession.findUnique({ where: { id: payload.sid }, include: { user: true } });
      if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.active || !this.safeEqual(session.tokenHash, this.hashToken(token))) throw new Error("Invalid session");
      await this.prisma.refreshSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
      await this.issueSession(session.user, response, meta);
      return { data: { user: this.publicUser(session.user) } };
    } catch {
      this.clearCookies(response);
      throw new UnauthorizedException("Refresh session expired");
    }
  }

  async logout(token: string | undefined, response: Response) {
    if (token) {
      try {
        const payload = await this.jwt.verifyAsync<TokenPayload>(token, { secret: this.refreshSecret });
        if (payload.sid) await this.prisma.refreshSession.updateMany({ where: { id: payload.sid, revokedAt: null }, data: { revokedAt: new Date() } });
      } catch {
        // Clearing cookies is sufficient for an invalid token.
      }
    }
    this.clearCookies(response);
    return { data: { success: true } };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, active: true } });
    if (!user) throw new UnauthorizedException("Account unavailable");
    return { data: { user: this.publicUser(user) } };
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { fullName: input.fullName, phone: input.phone } });
    return { data: { user: this.publicUser(user) } };
  }

  async changePassword(userId: string, input: ChangePasswordDto, response: Response) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!(await bcrypt.compare(input.currentPassword, user.passwordHash))) throw new UnauthorizedException("Current password is incorrect");
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(input.newPassword, 12) } }),
      this.prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
      this.prisma.auditLog.create({ data: { actorId: userId, action: "auth.password_changed", entity: "User", entityId: userId } }),
    ]);
    this.clearCookies(response);
    return { data: { success: true } };
  }

  private async issueSession(user: User, response: Response, meta: ClientMeta) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const session = await this.prisma.refreshSession.create({ data: { userId: user.id, tokenHash: "pending", expiresAt, userAgent: meta.userAgent?.slice(0, 500), ipAddress: meta.ipAddress?.slice(0, 80) } });
    const base = { sub: user.id, id: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync({ ...base, type: "access" }, { secret: this.accessSecret, expiresIn: "15m" }),
      this.jwt.signAsync({ ...base, type: "refresh", sid: session.id }, { secret: this.refreshSecret, expiresIn: "30d" }),
    ]);
    await this.prisma.refreshSession.update({ where: { id: session.id }, data: { tokenHash: this.hashToken(refreshToken) } });
    response.cookie("rv_access", accessToken, { ...this.cookieOptions, maxAge: 15 * 60 * 1000 });
    response.cookie("rv_refresh", refreshToken, { ...this.cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
  }

  private clearCookies(response: Response) {
    response.clearCookie("rv_access", this.cookieOptions);
    response.clearCookie("rv_refresh", this.cookieOptions);
  }

  private get cookieOptions() {
    const isProd = this.config.get<string>("NODE_ENV") === "production";
    return { httpOnly: true, sameSite: "lax" as const, secure: isProd, path: "/" };
  }

  private get accessSecret() {
    return this.config.get<string>("JWT_SECRET") ?? "rosevarzan-local-access-secret-change-me";
  }

  private get refreshSecret() {
    return this.config.get<string>("JWT_REFRESH_SECRET") ?? "rosevarzan-local-refresh-secret-change-me";
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private safeEqual(a: string, b: string) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  }

  private publicUser(user: User): AuthenticatedUser & { fullName: string; phone: string | null } {
    return { id: user.id, email: user.email, role: user.role, fullName: user.fullName, phone: user.phone };
  }
}
