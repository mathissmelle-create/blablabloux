import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  { key: "super_admin", name: "Super Admin" },
  { key: "admin", name: "Admin" },
  { key: "moderator", name: "Moderator" },
  { key: "support", name: "Support" },
  { key: "user", name: "User" },
];

const permissions = [
  "users.read",
  "users.write",
  "roles.manage",
  "cases.manage",
  "battles.manage",
  "roulette.manage",
  "finance.adjust",
  "fairness.inspect",
  "logs.read",
  "feature_flags.manage",
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name },
      create: role,
    });
  }

  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key },
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { key: "admin" } });
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { key: "super_admin" } });
  const allPermissionRows = await prisma.permission.findMany();

  for (const permission of allPermissionRows) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  for (const permission of allPermissionRows.filter((p) => p.key !== "roles.manage")) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
