import { Controller, Get, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../auth/guards/access-token.guard.js";
import { RolesService } from "./roles.service.js";

@Controller({ path: "roles", version: "1" })
@UseGuards(AccessTokenGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
