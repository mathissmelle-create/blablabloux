import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { JwtPayload } from "../../common/auth/jwt-payload.type.js";
import { AccessTokenGuard } from "../auth/guards/access-token.guard.js";
import { CreateBattleDto } from "./dto/create-battle.dto.js";
import { JoinBattleDto } from "./dto/join-battle.dto.js";
import { BattlesService } from "./battles.service.js";

@Controller({ path: "battles", version: "1" })
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Get()
  listLiveBattles() {
    return this.battlesService.listLiveBattles();
  }

  @Get(":battleId/snapshot")
  snapshot(@Param("battleId") battleId: string) {
    return this.battlesService.getBattleSnapshot(battleId);
  }

  @Get(":battleId/events")
  events(@Param("battleId") battleId: string, @Query("afterSequence") afterSequence?: string) {
    const parsed = afterSequence ? Number.parseInt(afterSequence, 10) : 0;
    return this.battlesService.getBattleEvents(battleId, Number.isNaN(parsed) ? 0 : parsed);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateBattleDto) {
    return this.battlesService.createBattle(user.sub, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":battleId/join")
  join(@CurrentUser() user: JwtPayload, @Param("battleId") battleId: string, @Body() _dto: JoinBattleDto) {
    return this.battlesService.joinBattle(user.sub, battleId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":battleId/resolve-round/:roundNumber")
  resolveRound(
    @Param("battleId") battleId: string,
    @Param("roundNumber", ParseIntPipe) roundNumber: number,
  ) {
    return this.battlesService.resolveRound(battleId, roundNumber);
  }
}
