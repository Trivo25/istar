import { createField } from "..";

describe("FiniteField tests", () => {
  describe("F_251 prime order field", () => {
    class F_251 extends createField(251n) {}
    it("All elements in F_251 should have an inverse", () => {
      for (let i = 1n; i < 251n; i++) {
        expect(F_251.from(i).inverse()).not.toBeUndefined();
      }
    });

    describe("add", () => {
      it("0 + 0 = 0", () => {
        expect(F_251.from(0n).add(0n).toBigint()).toEqual(0n);
      });

      it("-p + p = 0", () => {
        expect(
          F_251.from(F_251.modulus * -1n)
            .add(F_251.modulus)
            .toBigint()
        ).toEqual(0n);
      });

      it("p + 0 = 0", () => {
        expect(F_251.from(F_251.modulus).add(0n).toBigint()).toEqual(0n);
      });

      it("p + 1 = 1", () => {
        expect(F_251.from(F_251.modulus).add(1n).toBigint()).toEqual(1n);
      });
    });

    describe("sub", () => {
      it("0 - 0 = 0", () => {
        expect(F_251.from(0n).sub(0n).toBigint()).toEqual(0n);
      });

      it("p - 0 = 0", () => {
        expect(F_251.from(F_251.modulus).sub(0n).toBigint()).toEqual(0n);
      });

      it("p - p = 0", () => {
        expect(F_251.from(F_251.modulus).sub(F_251.modulus).toBigint()).toEqual(
          0n
        );
      });
    });

    describe("mul", () => {
      it("p * p = p", () => {
        expect(F_251.from(F_251.modulus).mul(F_251.modulus).toBigint()).toEqual(
          0n
        );
      });

      it("p * 1 =0", () => {
        expect(F_251.from(F_251.modulus).mul(1n).toBigint()).toEqual(0n);
      });

      it("p * 0 = 0", () => {
        expect(F_251.from(F_251.modulus).mul(0n).toBigint()).toEqual(0n);
      });

      it("250 * 2 = 249", () => {
        expect(F_251.from(250n).mul(2n).toBigint()).toEqual(249n);
      });
    });

    describe("pow", () => {
      it("250 ^ 0 = 1", () => {
        expect(F_251.from(250n).pow(0n).toBigint()).toEqual(1n);
      });

      it("p ^ 1 = p", () => {
        expect(F_251.from(250n).pow(1n).toBigint()).toEqual(250n);
      });
    });

    describe("lessThan", () => {
      it("243 < 250", () => {
        expect(F_251.from(243n).lessThan(250n)).toBeTruthy();
      });

      it("1 < 250", () => {
        expect(F_251.from(1n).lessThan(251n)).toBeTruthy();
      });

      it("false 250 < 1", () => {
        expect(!F_251.from(250n).lessThan(1n)).toBeTruthy();
      });

      it("false 5 < 5", () => {
        expect(!F_251.from(5n).lessThan(5n)).toBeTruthy();
      });

      it("false 1 < 0", () => {
        expect(!F_251.from(1n).lessThan(0n)).toBeTruthy();
      });
    });

    describe("greaterThan", () => {
      it("241 > 213", () => {
        expect(F_251.from(241n).greaterThan(213n)).toBeTruthy();
      });

      it("250 > 0", () => {
        expect(F_251.from(250n).greaterThan(1n)).toBeTruthy();
      });

      it("false 1 > 250", () => {
        expect(!F_251.from(1n).greaterThan(250n)).toBeTruthy();
      });

      it("false 4 > 5", () => {
        expect(!F_251.from(4n).greaterThan(5n)).toBeTruthy();
      });

      it("false 0 > 1", () => {
        expect(!F_251.from(0n).greaterThan(1n)).toBeTruthy();
      });
    });

    describe("util methods", () => {
      describe("toString", () => {
        it("p-1.toString", () => {
          expect(F_251.from(F_251.modulus - 1n).toString()).toEqual("250");
        });
        it("0.toString", () => {
          expect(F_251.from(0n).toString()).toEqual("0");
        });
      });

      describe("toBigInt", () => {
        it("p-1.toBigInt", () => {
          expect(F_251.from(F_251.modulus - 1n).toBigint()).toEqual(250n);
        });
        it("0.toBigInt", () => {
          expect(F_251.from(0n).toBigint()).toEqual(0n);
        });
      });

      it("zero", () => {
        expect(F_251.zero().toBigint()).toEqual(0n);
      });

      it("one", () => {
        expect(F_251.one().toBigint()).toEqual(1n);
      });

      it("random", () => {
        expect(F_251.random().lessThan(F_251.modulus - 1n));
      });

      it("equals", () => {
        for (let i = 1n; i < 251n; i++) {
          expect(F_251.from(i).equals(i)).toBeTruthy();
        }
      });

      it("inRange", () => {
        for (let i = 1n; i < 251n; i++) {
          expect(F_251.from(i).inRange()).toBeTruthy();
        }
        for (let i = 251n; i < 500; i++) {
          expect(F_251.from(i).inRange()).toBeTruthy();
        }
      });
    });
  });

  describe("Large prime field", () => {
    let p = 16491487749496951349n;
    class F_large extends createField(p) {}

    it("random element", () => {
      let x = F_large.random();
      expect(x.lessThan(p - 1n)).toBeTruthy();
    });
  });
});
