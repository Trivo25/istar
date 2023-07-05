import { EllipticCurve, createField, createEllipticCurve } from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=251, Group", () => {
    class F_251 extends createField(251n) {}
    let G = createEllipticCurve(F_251, { a: 1n, b: 0n, g: { x: -1n, y: 2n } });

    // it("invalid group elements", () => {
    //   expect(() => G.from({ y: 5n, x: 5n })).toThrow(Error);
    // });

    it("valid group elements", () => {
      expect(() => G.g).not.toThrow(Error);
    });
  });
});
