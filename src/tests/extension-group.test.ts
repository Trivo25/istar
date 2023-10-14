import { createField, createExtensionGroup, extend, FieldExtension } from "..";
describe("Extension Group tests", () => {
  describe("small, p=5, extension group", () => {
    const k = 5n;
    class F extends createField(k) {}
    class Fk extends extend(F, [F.from(2n), F.from(0n), F.from(1n)], 2n) {}
    const a = Fk.from([F.from(0n)]);
    const b = Fk.from([F.from(3n)]);

    const generator = {
      x: Fk.from([F.from(1n)]),
      y: Fk.from([F.from(2n)]),
    };
    class Gk extends createExtensionGroup(F, Fk, {
      a,
      b,
      g: generator,
    }) {}

    it("generates all group elements", () => {
      // all elements of Fk_5^2
      let xs: FieldExtension[] = [];
      for (let i = 0n; i < k ** 2n; i++) {
        for (let j = 0n; j < k ** 2n; j++) {
          let q = Fk.from([F.from(i), F.from(j)]);

          if (xs.find((e) => e.equals(q)) === undefined) {
            xs.push(q);
          }
        }
      }

      let group: { x: string; y: string }[] = [];
      for (let i = 0; i < xs.length; i++) {
        let xx = xs[i];
        for (let j = 0; j < xs.length; j++) {
          let yy = xs[j];
          if (Gk.isPoint({ x: xx, y: yy })) {
            group.push({
              x: xx.toPretty(),
              y: yy.toPretty(),
            });
          }
        }
      }

      expect(group.length).toEqual(36);
    });

    it("generate is on curve", () => {
      let x = Fk.from([F.from(1n)]);
      let y = Fk.from([F.from(2n)]);
      expect(Gk.isPoint({ x, y })).toEqual(true);
    });

    it("2g is on curve", () => {
      expect(() => Gk.g.double()).not.toThrow();
    });

    it("double equals scale", () => {
      expect(Gk.g.double().equals(Gk.g.scale(2n))).toEqual(true);
    });
  });
});
