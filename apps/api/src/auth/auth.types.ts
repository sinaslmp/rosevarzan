import { UserRole } from "@prisma/client";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type TokenPayload = AuthenticatedUser & {
  sub: string;
  type: "access" | "refresh";
  sid?: string;
};
