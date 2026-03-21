import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { JwtPayload } from "../../common/auth/jwt-payload.type.js";
import { AccessTokenGuard } from "../auth/guards/access-token.guard.js";
import { OpenCaseDto } from "./dto/open-case.dto.js";
import { CasesService } from "./cases.service.js";

@Controller({ path: "cases", version: "1" })
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  listCases() {
    return this.casesService.listCases();
  }

  @Get(":slug")
  getCaseBySlug(@Param("slug") slug: string) {
    return this.casesService.getCaseBySlug(slug);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":caseId/open")
  openCase(@CurrentUser() user: JwtPayload, @Param("caseId") caseId: string, @Body() dto: OpenCaseDto) {
    return this.casesService.openCase(user.sub, caseId, dto);
  }
}
