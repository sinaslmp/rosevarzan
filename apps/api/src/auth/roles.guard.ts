import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import type { Request } from "express";
import type { AuthenticatedUser } from "./auth.types";

export const ROLES_KEY = "roles";
export const Roles = Reflector.createDecorator<UserRole[]>({ key: ROLES_KEY });

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler()) ?? this.reflector.get(Roles, context.getClass());
    if (!roles?.length) return true;
    const user = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>().user;
    if (!user || !roles.includes(user.role)) throw new ForbiddenException("Insufficient permissions");
    return true;
  }
}
