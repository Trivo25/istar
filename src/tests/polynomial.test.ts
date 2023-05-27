import { Polynomial, Field } from "..";

describe("Polynomial tests", () => {
  const F = Field;

  describe("12 + 2x + x^2", () => {
    let p: Polynomial;

    beforeAll(() => {
      p = Polynomial([F(12n), F(2n), F(1n)]);
    });

    it("should evaluate correctly", () => {
      p.eval(2n).equals(20n % F.modulus);
    });

    it("should evaluate correctly", () => {
      p.eval(712n).equals(508380n % F.modulus);
    });

    it("should evaluate correctly", () => {
      p.eval(0n).equals(12n % F.modulus);
    });
  });

  describe("1x", () => {
    let p: Polynomial;

    beforeAll(() => {
      p = Polynomial([F(0n), F(1n)]);
    });

    it("should evaluate correctly", () => {
      expect(p.eval(0n).value).toEqual(0n % F.modulus);
    });

    it("should evaluate correctly", () => {
      expect(p.eval(5n).value).toEqual(5n % F.modulus);
    });

    it("should evaluate correctly", () => {
      expect(p.eval(F.modulus).value).toEqual(F.modulus % F.modulus);
    });

    it("should evaluate correctly", () => {
      for (let index = 0; index < 100; index++) {
        let x = F.random();
        expect(p.eval(x).value).toEqual(x.value);
      }
    });
  });
});
