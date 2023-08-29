import {
  ExtensionGroup,
  createField,
  createEllipticCurve,
  createPolynomial,
  createExtensionGroup,
} from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=13, Group", () => {
    class F extends createField(101n) {}
    let P = createPolynomial(F);

    let Gk = createExtensionGroup(F, P, {
      a: P.from([F.from(1n)]),
      b: P.from([F.from(1n)]),
      g: {
        x: P.from([F.from(0n)]),
        y: P.from([F.from(4n)]),
      },
      modulus: P.from([F.from(5n), F.from(0n), F.from(1n)]),
    });

    it("(2, 2)", () => {});
  });
});
