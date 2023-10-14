import { createField, extend, FieldExtension } from "..";

describe("field extension", () => {
  describe("small, Fk_5^2", () => {
    const k = 5n;
    const n = 2n;
    class F extends createField(k) {}
    class Fk extends extend(F, [F.from(2n), F.from(0n), F.from(1n)], 2n) {}

    let xs: FieldExtension[] = [];

    it("generates all elements in Fk_k^n", () => {
      // all elements of Fk_5^2
      for (let i = 0n; i < k ** n; i++) {
        for (let j = 0n; j < k ** n; j++) {
          let q = Fk.from([F.from(i), F.from(j)]);

          if (xs.find((e) => e.equals(q)) === undefined) {
            xs.push(q);
          }
        }
      }

      expect(xs.length).toEqual(Number(k ** n));
    });

    it("additive identity", () => {
      let e = Fk.from([F.from(0n)]);
      xs.forEach((a) => {
        expect(a.add(e).equals(a)).toEqual(true);
      });
    });

    it("subtractive identity", () => {
      let e = Fk.from([F.from(0n)]);
      xs.forEach((a) => {
        expect(a.sub(e).equals(a)).toEqual(true);
      });
    });

    it("multiplicative identity", () => {
      let e = Fk.from([F.from(1n)]);
      xs.forEach((a) => {
        expect(a.mul(e).equals(a)).toEqual(true);
      });
    });
  });
});
