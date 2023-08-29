import { Field, createField } from "..";

describe("FiniteField tests", () => {
  describe("F_251 prime order field", () => {
    const F_251 = createField(251n);

    it("All elements in F_251 should have an inverse", () => {
      for (let i = 1n; i < 251n; i++) {
        expect(new F_251(i).inverse()).not.toBeUndefined();
      }
    });

    describe("add", () => {
      it("0 + 0 = 0", () => {
        expect(F_251.from(0n).add(F_251.zero()).toBigInt()).toEqual(0n);
      });

      it("-p + p = 0", () => {
        expect(
          F_251.from(F_251.modulus * -1n)
            .add(F_251.from(F_251.modulus))
            .toBigInt()
        ).toEqual(0n);
      });

      it("p + 0 = 0", () => {
        expect(
          F_251.from(F_251.modulus).add(F_251.from(0n)).toBigInt()
        ).toEqual(0n);
      });

      it("p + 1 = 1", () => {
        expect(
          F_251.from(F_251.modulus).add(F_251.from(1n)).toBigInt()
        ).toEqual(1n);
      });
    });

    describe("sub", () => {
      it("0 - 0 = 0", () => {
        expect(F_251.from(0n).sub(F_251.from(0n)).toBigInt()).toEqual(0n);
      });

      it("p - 0 = 0", () => {
        expect(
          F_251.from(F_251.modulus).sub(F_251.from(0n)).toBigInt()
        ).toEqual(0n);
      });

      it("p - p = 0", () => {
        expect(
          F_251.from(F_251.modulus).sub(F_251.from(F_251.modulus)).toBigInt()
        ).toEqual(0n);
      });
    });

    describe("mul", () => {
      it("p * p = p", () => {
        expect(
          F_251.from(F_251.modulus).mul(F_251.from(F_251.modulus)).toBigInt()
        ).toEqual(0n);
      });

      it("p * 1 =0", () => {
        expect(
          F_251.from(F_251.modulus).mul(F_251.from(1n)).toBigInt()
        ).toEqual(0n);
      });

      it("p * 0 = 0", () => {
        expect(
          F_251.from(F_251.modulus).mul(F_251.from(0n)).toBigInt()
        ).toEqual(0n);
      });

      it("250 * 2 = 249", () => {
        expect(F_251.from(250n).mul(F_251.from(2n)).toBigInt()).toEqual(249n);
      });
    });

    describe("pow", () => {
      it("250 ^ 0 = 1", () => {
        expect(F_251.from(250n).pow(F_251.from(0n)).toBigInt()).toEqual(1n);
      });

      it("p ^ 1 = p", () => {
        expect(F_251.from(250n).pow(F_251.from(1n)).toBigInt()).toEqual(250n);
      });
    });

    describe("lessThan", () => {
      it("243 < 250", () => {
        expect(F_251.from(243n).lessThan(F_251.from(250n))).toBeTruthy();
      });

      it("1 < 250", () => {
        expect(F_251.from(1n).lessThan(F_251.from(250n))).toBeTruthy();
      });

      it("false 250 < 1", () => {
        expect(!F_251.from(250n).lessThan(F_251.from(1n))).toBeTruthy();
      });

      it("false 5 < 5", () => {
        expect(!F_251.from(5n).lessThan(F_251.from(5n))).toBeTruthy();
      });

      it("false 1 < 0", () => {
        expect(!F_251.from(1n).lessThan(F_251.from(0n))).toBeTruthy();
      });
    });

    describe("greaterThan", () => {
      it("241 > 213", () => {
        expect(F_251.from(241n).greaterThan(F_251.from(213n))).toBeTruthy();
      });

      it("250 > 0", () => {
        expect(F_251.from(250n).greaterThan(F_251.from(1n))).toBeTruthy();
      });

      it("false 1 > 250", () => {
        expect(!F_251.from(1n).greaterThan(F_251.from(250n))).toBeTruthy();
      });

      it("false 4 > 5", () => {
        expect(!F_251.from(4n).greaterThan(F_251.from(5n))).toBeTruthy();
      });

      it("false 0 > 1", () => {
        expect(!F_251.from(0n).greaterThan(F_251.from(1n))).toBeTruthy();
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
          expect(F_251.from(F_251.modulus - 1n).toBigInt()).toEqual(250n);
        });
        it("0.toBigInt", () => {
          expect(F_251.from(0n).toBigInt()).toEqual(0n);
        });
      });

      it("zero", () => {
        expect(F_251.zero().toBigInt()).toEqual(0n);
      });

      it("one", () => {
        expect(F_251.one().toBigInt()).toEqual(1n);
      });

      it("random", () => {
        expect(F_251.random().lessThan(F_251.from(F_251.modulus - 1n)));
      });

      it("equals", () => {
        for (let i = 1n; i < 251n; i++) {
          expect(F_251.from(i).equals(F_251.from(i))).toBeTruthy();
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
    const F_large = createField(p);

    it("random element", () => {
      let x = F_large.random();
      expect(x.lessThan(F_large.from(p - 1n))).toBeTruthy();
    });
  });
});
