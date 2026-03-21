import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { JwtPayload } from "../../common/auth/jwt-payload.type.js";
import { RoleKey } from "../../common/auth/role-key.enum.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { RefreshDto } from "./dto/refresh.dto.js";
import { RegisterDto } from "./dto/register.dto.js";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
};

type SessionMeta = {
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, sessionMeta: SessionMeta = {}) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email.toLowerCase() }, { username: dto.username }],
      },
    });

    if (existing) {
      throw new ConflictException("User with provided email or username already exists");
    }

    const passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id });
    const serverSeed = randomBytes(32).toString("hex");
    const serverSeedHash = createHash("sha256").update(serverSeed).digest("hex");

    const userRole = await this.prisma.role.findUnique({ where: { key: RoleKey.USER } });
    if (!userRole) {
      throw new ConflictException("Default user role is not configured");
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          username: dto.username,
          passwordHash,
          wallet: {
            create: {
              availableBalance: new Prisma.Decimal(0),
              lockedBalance: new Prisma.Decimal(0),
            },
          },
          userRoles: {
            create: {
              roleId: userRole.id,
            },
          },
          seedPairs: {
            create: {
              gameType: "case_open",
              clientSeed: dto.clientSeed,
              currentServerSeedHash: serverSeedHash,
              currentServerSeedEncrypted: serverSeed,
              nonce: 0,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          action: "auth.register",
          entityType: "user",
          entityId: createdUser.id,
          metadata: { username: createdUser.username },
        },
      });

      return createdUser;
    });

    const auth = await this.issueSessionAndTokens(user.id, [RoleKey.USER], sessionMeta);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ...auth,
    };
  }

  async login(dto: LoginDto, sessionMeta: SessionMeta = {}) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await argon2.verify(user.passwordHash, dto.password);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const roles = user.userRoles.map((entry) => entry.role.key as RoleKey);
    const auth = await this.issueSessionAndTokens(user.id, roles, sessionMeta);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles,
      },
      ...auth,
    };
  }

  async refresh(dto: RefreshDto) {
    const tokenHash = this.hashToken(dto.refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { userRoles: { include: { role: true } } },
        },
      },
    });

    if (!stored) {
      throw new UnauthorizedException("Refresh token invalid or expired");
    }

    const roles = stored.user.userRoles.map((entry) => entry.role.key as RoleKey);
    const tokens = await this.rotateRefreshToken(stored.id, stored.userId, stored.sessionId, roles);
    return tokens;
  }

  async logoutAll(userId: string) {
    await this.prisma.$transaction([
      this.prisma.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
      this.prisma.session.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: "auth.logout_all",
          entityType: "session",
          entityId: userId,
        },
      }),
    ]);
  }

  private async issueSessionAndTokens(
    userId: string,
    roles: RoleKey[],
    sessionMeta: SessionMeta,
  ) {
    const session = await this.prisma.session.create({
      data: {
        userId,
        ipAddress: sessionMeta.ipAddress,
        userAgent: sessionMeta.userAgent,
      },
    });

    const tokens = await this.createTokens(userId, session.id, roles);
    return tokens;
  }

  private async rotateRefreshToken(
    currentTokenId: string,
    userId: string,
    sessionId: string,
    roles: RoleKey[],
  ) {
    const tokens = await this.createTokens(userId, sessionId, roles);
    await this.prisma.refreshToken.update({
      where: { id: currentTokenId },
      data: {
        revokedAt: new Date(),
      },
    });
    return tokens;
  }

  private async createTokens(userId: string, sessionId: string, roles: RoleKey[]): Promise<AuthTokens> {
    const accessTokenExpiresIn = this.configService.get<string>("JWT_ACCESS_TTL", "15m");
    const refreshTokenExpiresIn = this.configService.get<string>("JWT_REFRESH_TTL", "30d");
    const payload: JwtPayload = { sub: userId, sessionId, roles };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.intervalToSeconds(accessTokenExpiresIn),
    });

    const refreshToken = randomBytes(64).toString("hex");
    const refreshTokenHash = this.hashToken(refreshToken);
    const refreshExpiresAt = this.buildExpiration(refreshTokenExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        jti: randomUUID(),
        userId,
        sessionId,
        tokenHash: refreshTokenHash,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  private hashToken(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }

  private buildExpiration(interval: string): Date {
    const seconds = this.intervalToSeconds(interval);
    return new Date(Date.now() + seconds * 1000);
  }

  private intervalToSeconds(interval: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = regex.exec(interval);
    if (!match) {
      return 30 * 24 * 60 * 60;
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multiplier = unit === "s" ? 1 : unit === "m" ? 60 : unit === "h" ? 3600 : 86400;
    return amount * multiplier;
  }
}
