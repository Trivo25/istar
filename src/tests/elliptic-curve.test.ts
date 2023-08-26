import { EllipticCurve, createField, createEllipticCurve } from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=17, Group", () => {
    class F_17 extends createField(17n) {}
    let G = createEllipticCurve(F_17, { a: 2n, b: 2n, g: { x: 5n, y: 1n } });

    /*     describe("invalid group elements", () => {
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

      it("infinity", () => {
        expect(() => G.from({ x: 0n, y: 0n })).not.toThrow(Error);
      });
    }); */

    describe("double", () => {
      it("(4, 2) + (4, 2)", () => {
        console.log(F_17.from(2n).inverse());

        console.log(F_17.from(1n).div(2n));
        console.log(G.from({ x: 4n, y: 2n }).double());
      });
    });
  });
});
