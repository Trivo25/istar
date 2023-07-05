import { Field, createField } from "../";

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
        expect(F_251.random().toBigint()).toBeLessThanOrEqual(
          F_251.modulus - 1n
        );
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
});
