import {
  ExtensionGroup,
  createField,
  createEllipticCurveGroup,
  createPolynomial,
  createExtensionGroup,
  extend,
} from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=13, Group", () => {
    class F extends createField(101n) {}
    let P = extend(F, [F.from(2n), F.from(0n), F.from(1n)], 2n);

    it("(2, 2)", () => {
      let a = P.from([F.from(0n)]);
      let b = P.from([F.from(3n)]);

      let x = P.from([F.from(36n)]);

      let y = P.from([F.from(0n), F.from(31n)]);

      let Gk = createExtensionGroup(F, P, {
        a,
        b,
        g: {
          x,
          y,
        },
      });
    });
  });
});
