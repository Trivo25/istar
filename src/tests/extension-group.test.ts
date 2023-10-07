import { createField, createExtensionGroup, extend } from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=13, Group", () => {
    class F extends createField(101n) {}
    class Pk extends extend(F, [F.from(2n), F.from(0n), F.from(1n)], 2n) {}

    it("(2, 2)", () => {
      let a = Pk.from([F.from(0n)]);
      let b = Pk.from([F.from(3n)]);

      let x = Pk.from([F.from(36n)]);

      let y = Pk.from([F.from(0n), F.from(31n)]);

      class Gk extends createExtensionGroup(F, Pk, {
        a,
        b,
        g: {
          x,
          y,
        },
      }) {}

      console.log(
        Gk.from({
          x,
          y,
        })
      );
    });
  });
});
