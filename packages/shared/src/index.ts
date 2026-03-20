export enum RoleKey {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MODERATOR = "moderator",
  SUPPORT = "support",
  USER = "user",
}

export enum GameType {
  CASE_OPEN = "case_open",
  BATTLE = "battle",
  ROULETTE = "roulette",
}

export type FairnessDerivationInput = {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  context: Record<string, string | number>;
};
