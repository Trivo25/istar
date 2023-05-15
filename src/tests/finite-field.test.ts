import { Field } from "../";

describe("FiniteField tests", () => {
  describe("F_251 prime order field", () => {
    let F_251 = Field;
    it("All elements in F_251 should have an inverse", () => {
      for (let i = 1n; i < 251n; i++) {
        expect(F_251(i).inverse()).not.toBeUndefined();
      }
    });
  });
});
