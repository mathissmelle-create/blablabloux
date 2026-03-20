import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { JwtPayload } from "../../common/auth/jwt-payload.type.js";
import { AccessTokenGuard } from "../auth/guards/access-token.guard.js";
import { PlaceBetDto } from "./dto/place-bet.dto.js";
import { RouletteService } from "./roulette.service.js";

@Controller({ path: "roulette", version: "1" })
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @Get("current")
  currentRound() {
    return this.rouletteService.getCurrentRound();
  }

  @Get("history")
  history() {
    return this.rouletteService.history();
  }

  @UseGuards(AccessTokenGuard)
  @Post("bet")
  placeBet(@CurrentUser() user: JwtPayload, @Body() dto: PlaceBetDto) {
    return this.rouletteService.placeBet(user.sub, dto);
  }

  @Post("resolve")
  resolveCurrentRound() {
    return this.rouletteService.resolveCurrentRound();
  }
}
