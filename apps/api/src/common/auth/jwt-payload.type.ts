import { RoleKey } from "./role-key.enum.js";

export type JwtPayload = {
  sub: string;
  sessionId: string;
  roles: RoleKey[];
  iat?: number;
  exp?: number;
};
