import { Polynomial, createField, createPolynomial } from "..";

describe("Polynomial tests", () => {
  class F extends createField(251n) {}
  let P_251 = createPolynomial(F);

  describe("12 + 2x + x^2", () => {
    let p: Polynomial;

    beforeAll(() => {
      p = P_251.from([new F(12n), new F(2n), new F(1n)]);
    });

    it("deg(12 + 2x + x^2) = 2", () => {
      expect(p.degree()).toEqual(2);
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
      p = P_251.from([F.from(0n), F.from(1n)]);
    });

    it("x polynomial is correct", () => {
      expect(p.equals(P_251.x())).toEqual(true);
    });

    it("deg(x) = 1", () => {
      expect(p.degree()).toEqual(1);
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

  describe("add", () => {
    it("1x + 1x = 2x", () => {
      expect(
        P_251.x()
          .add(P_251.x())
          .equals(P_251.from([F.from(0n), F.from(2n)]))
      ).toEqual(true);
    });
  });
});
