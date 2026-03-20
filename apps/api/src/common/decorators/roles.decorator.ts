import { RoleKey } from "../auth/role-key.enum.js";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: RoleKey[]) => SetMetadata(ROLES_KEY, roles);
