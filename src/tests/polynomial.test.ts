import {
  Lagrange,
  Polynomial,
  createField,
  createLagrange,
  createPolynomial,
} from "..";

describe("Polynomial tests", () => {
  class F extends createField(251n) {}
  let P_251 = createPolynomial(F);

  describe("12 + 2x + x^2", () => {
    let p: Polynomial;

    beforeAll(() => {
      p = P_251.from([F.from(12n), F.from(2n), F.from(1n)]);
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
      expect(p.equals(P_251.x())).toBeTruthy();
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
      ).toBeTruthy();
    });

    it("x + 2x^2 = x + 2x^2", () => {
      let p1 = P_251.x();
      let p2 = P_251.from([F.from(0n), F.from(0n), F.from(2n)]);

      let target = P_251.from([F.from(0n), F.from(1n), F.from(2n)]);

      expect(p1.add(p2).equals(target)).toBeTruthy();
    });

    it("2x^2 + x = x + 2x^2", () => {
      let p1 = P_251.x();
      let p2 = P_251.from([F.from(0n), F.from(0n), F.from(2n)]);

      let target = P_251.from([F.from(0n), F.from(1n), F.from(2n)]);

      expect(p2.add(p1).equals(target)).toBeTruthy();
    });
  });
});

describe("Lagrange interpolation tests", () => {
  describe("", () => {
    class F extends createField(251n) {}
    let Lagrange = createLagrange(F);

    let L: Lagrange;

    beforeAll(() => {
      L = Lagrange.fromPoints([
        {
          x: F.from(5n),
          y: F.from(3n),
        },
        {
          x: F.from(2n),
          y: F.from(8n),
        },
        {
          x: F.from(3n),
          y: F.from(4n),
        },
      ]);
    });

    it("Evaluation at (2, 8)", () => {
      expect(L.eval(2n).equals(8n)).toBeTruthy();
    });

    it("Evaluation at (5, 3)", () => {
      expect(L.eval(5n).equals(3n)).toBeTruthy();
    });

    it("Evaluation at (3, 4)", () => {
      expect(L.eval(3n).equals(4n)).toBeTruthy();
    });

    it("Evaluation at L(2) = 8", () => {
      expect(L.eval(2n).equals(8n)).toBeTruthy();
    });
  });
});
