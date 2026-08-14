import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { AuthenticatedUser, TokenPayload } from "./auth.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = request.cookies?.rv_access as string | undefined;
    if (!token) throw new UnauthorizedException("Authentication required");
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token, { secret: this.accessSecret });
      if (payload.type !== "access") throw new Error("Invalid token type");
      request.user = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException("Session expired");
    }
  }

  private get accessSecret() {
    return this.config.get<string>("JWT_SECRET") ?? "rosevarzan-local-access-secret-change-me";
  }
}

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext) {
    try {
      return await super.canActivate(context);
    } catch {
      return true;
    }
  }
}
