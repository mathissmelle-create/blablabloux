import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtPayload } from "../../common/auth/jwt-payload.type.js";
import { RoleKey } from "../../common/auth/role-key.enum.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { AccessTokenGuard } from "../auth/guards/access-token.guard.js";
import { AdminService } from "./admin.service.js";
import { CreateCaseDto } from "./dto/create-case.dto.js";
import { ToggleCaseActiveDto } from "./dto/toggle-case-active.dto.js";

@Controller({ path: "admin", version: "1" })
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(RoleKey.ADMIN, RoleKey.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("cases")
  listCases() {
    return this.adminService.listCases();
  }

  @Post("cases")
  createCase(@CurrentUser() user: JwtPayload, @Body() dto: CreateCaseDto) {
    return this.adminService.createCase(user.sub, dto);
  }

  @Post("cases/:caseId/versions")
  createCaseVersion(
    @CurrentUser() user: JwtPayload,
    @Param("caseId") caseId: string,
    @Body() dto: CreateCaseDto,
  ) {
    return this.adminService.createCaseVersion(user.sub, caseId, dto);
  }

  @Patch("cases/:caseId/toggle-active")
  toggleCaseActive(
    @CurrentUser() user: JwtPayload,
    @Param("caseId") caseId: string,
    @Body() dto: ToggleCaseActiveDto,
  ) {
    return this.adminService.toggleCaseActive(user.sub, caseId, dto.active);
  }
}
