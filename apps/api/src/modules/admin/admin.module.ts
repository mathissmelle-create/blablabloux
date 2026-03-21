import { Module } from "@nestjs/common";
import { RolesGuard } from "../../common/guards/roles.guard.js";
import { AdminController } from "./admin.controller.js";
import { AdminService } from "./admin.service.js";

@Module({
  controllers: [AdminController],
  providers: [AdminService, RolesGuard],
})
export class AdminModule {}
