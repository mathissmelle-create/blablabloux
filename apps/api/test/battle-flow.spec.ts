import { FairnessService } from "../src/modules/fairness/fairness.service.js";

describe("Battle flow deterministic derivation", () => {
  const fairness = new FairnessService();
  const itemWeights = [50, 30, 20];

  const mapTicketToIndex = (ticket: number) => {
    let cumulative = 0;
    for (let i = 0; i < itemWeights.length; i += 1) {
      const weight = itemWeights[i];
      if (typeof weight !== "number") {
        throw new Error("Missing weight");
      }
      cumulative += weight;
      if (ticket < cumulative) {
        return i;
      }
    }
    throw new Error("Ticket out of range");
  };

  it("returns same item index for same battle derivation input", () => {
    const a = fairness.deriveBattleTicket(
      {
        battleId: "battle-1",
        roundNumber: 1,
        seatIndex: 0,
        battleServerSeed: "battle-server-seed",
        eosBlockHash: "0000000011111111222222223333333344444444555555556666666677777777",
      },
      100,
    );

    const b = fairness.deriveBattleTicket(
      {
        battleId: "battle-1",
        roundNumber: 1,
        seatIndex: 0,
        battleServerSeed: "battle-server-seed",
        eosBlockHash: "0000000011111111222222223333333344444444555555556666666677777777",
      },
      100,
    );

    expect(mapTicketToIndex(a.ticket)).toBe(mapTicketToIndex(b.ticket));
  });
});
