import { EllipticCurve, createField, createEllipticCurve } from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=13, Group", () => {
    class F_13 extends createField(13n) {}
    let G = createEllipticCurve(F_13, { a: 1n, b: 0n, g: { x: 4n, y: 2n } });

    describe("invalid group elements", () => {
      it("(2, 2)", () => {
        expect(() => {
          G.from({ y: 2n, x: 2n });
        }).toThrow(Error);
      });

      it("(5, 5)", () => {
        expect(() => {
          G.from({ y: 5n, x: 5n });
        }).toThrow(Error);
      });

      it("(2, 6)", () => {
        expect(() => {
          G.from({ y: 2n, x: 6n });
        }).toThrow(Error);
      });
    });

    describe("valid group elements", () => {
      it("g", () => {
        expect(() => G.g).not.toThrow(Error);
      });

      it("(4, 2)", () => {
        expect(() => G.from({ x: 4n, y: 2n })).not.toThrow(Error);
      });

      it("(7, 8)", () => {
        expect(() => G.from({ x: 7n, y: 8n })).not.toThrow(Error);
      });
    });
  });
});
