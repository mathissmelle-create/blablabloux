import { FairnessService } from "./fairness.service.js";

describe("FairnessService", () => {
  const service = new FairnessService();

  it("produces deterministic case tickets", () => {
    const input = {
      serverSeed: "abc123serverseed",
      clientSeed: "user-seed",
      nonce: 42,
      caseVersionId: "case-version-1",
      userId: "user-1",
    };

    const a = service.deriveCaseTicket(input, 10_000);
    const b = service.deriveCaseTicket(input, 10_000);
    expect(a.ticket).toBe(b.ticket);
    expect(a.hash).toBe(b.hash);
  });

  it("keeps roulette segments in range", () => {
    const result = service.deriveRouletteSegment(
      {
        serverSeed: "round-seed",
        clientSeed: "client-seed",
        nonce: 7,
        roundNumber: 7,
      },
      15,
    );
    expect(result.ticket).toBeGreaterThanOrEqual(0);
    expect(result.ticket).toBeLessThan(15);
  });
});
