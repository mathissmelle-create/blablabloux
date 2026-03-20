import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { envSchema } from "./config/env.schema.js";
import { AdminModule } from "./modules/admin/admin.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { BattlesModule } from "./modules/battles/battles.module.js";
import { CasesModule } from "./modules/cases/cases.module.js";
import { EosModule } from "./modules/eos/eos.module.js";
import { FairnessModule } from "./modules/fairness/fairness.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { LedgerModule } from "./modules/ledger/ledger.module.js";
import { PrismaModule } from "./modules/prisma/prisma.module.js";
import { RealtimeModule } from "./modules/realtime/realtime.module.js";
import { RouletteModule } from "./modules/roulette/roulette.module.js";
import { RolesModule } from "./modules/roles/roles.module.js";
import { UsersModule } from "./modules/users/users.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 200,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    FairnessModule,
    LedgerModule,
    CasesModule,
    EosModule,
    RealtimeModule,
    BattlesModule,
    RouletteModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
