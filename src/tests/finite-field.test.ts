import { createFiniteField } from "../";

describe("FiniteField tests", () => {
  describe("F_15", () => {
    let F_15: ReturnType<typeof createFiniteField>;

    beforeAll(() => {
      F_15 = createFiniteField(15n);
    });

    it("No inverse of 5 exists in F_15", () => {
      let a = F_15(5n).inverse();
      expect(a).toBeUndefined();
    });

    it("No inverse of 9 exists in F_15", () => {
      let a = F_15(9n).inverse();
      expect(a).toBeUndefined();
    });

    it("No inverse of 10 exists in F_15", () => {
      let a = F_15(10n).inverse();
      expect(a).toBeUndefined();
    });

    it("Inverse of 1 exists in F_15", () => {
      let a = F_15(1n).inverse()!.toBigint();
      expect(a).toEqual(1n);
    });

    it("Inverse of 2 exists in F_15", () => {
      let a = F_15(2n).inverse()!.toBigint();
      expect(a).toEqual(8n);
    });
  });

  describe("F_251 prime order field", () => {
    let F_251: ReturnType<typeof createFiniteField>;

    beforeAll(() => {
      F_251 = createFiniteField(251n);
    });

    it("All elements in F_251 should have an inverse", () => {
      for (let i = 1n; i < 251n; i++) {
        expect(F_251(i).inverse()).not.toBeUndefined();
      }
    });
  });
});
