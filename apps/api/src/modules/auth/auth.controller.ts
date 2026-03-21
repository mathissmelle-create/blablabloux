import { Body, Controller, Get, Ip, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { JwtPayload } from "../../common/auth/jwt-payload.type.js";
import { UsersService } from "../users/users.service.js";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { RefreshDto } from "./dto/refresh.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { AccessTokenGuard } from "./guards/access-token.guard.js";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post("register")
  register(@Body() dto: RegisterDto, @Ip() ip: string, @Req() req: Request) {
    const userAgent = Array.isArray(req.headers["user-agent"])
      ? req.headers["user-agent"].join(" ")
      : req.headers["user-agent"];
    return this.authService.register(dto, {
      ipAddress: ip,
      userAgent,
    });
  }

  @Post("login")
  login(@Body() dto: LoginDto, @Ip() ip: string, @Req() req: Request) {
    const userAgent = Array.isArray(req.headers["user-agent"])
      ? req.headers["user-agent"].join(" ")
      : req.headers["user-agent"];
    return this.authService.login(dto, {
      ipAddress: ip,
      userAgent,
    });
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post("logout-all")
  logoutAll(@CurrentUser() user: JwtPayload) {
    return this.authService.logoutAll(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Get("me")
  me(@CurrentUser() user: JwtPayload) {
    return this.usersService.getById(user.sub);
  }
}
