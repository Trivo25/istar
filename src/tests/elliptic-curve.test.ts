import { EllipticCurve, createField, createEllipticCurve } from "..";
describe("Elliptic Curve (Group) tests", () => {
  describe("p=13, Group", () => {
    class F extends createField(101n) {}
    let G = createEllipticCurve(F, {
      a: 0n,
      b: 3n,
      g: { x: 1n, y: 2n },
    });

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

    describe("valid group elements construction", () => {
      it("g", () => {
        expect(() => G.g).not.toThrow(Error);
      });

      it("(1, 99)", () => {
        expect(() => G.from({ x: 1n, y: 99n })).not.toThrow(Error);
      });

      it("(26, 45)", () => {
        expect(() => G.from({ x: 26n, y: 45n })).not.toThrow(Error);
      });

      it("infinity", () => {
        expect(() => G.from({ x: 0n, y: 0n })).not.toThrow(Error);
      });
    });

    describe("double", () => {
      it("2(1, 2)", () => {
        expect(
          G.g.double().equals({
            x: F.from(68n),
            y: F.from(74n),
          })
        ).toBeTruthy();
      });

      it("4(1, 2)", () => {
        expect(
          G.g
            .double()
            .double()
            .equals({
              x: F.from(65n),
              y: F.from(98n),
            })
        ).toBeTruthy();
      });

      it("8(1, 2)", () => {
        expect(
          G.g
            .double()
            .double()
            .double()
            .equals({
              x: F.from(18n),
              y: F.from(49n),
            })
        ).toBeTruthy();
      });

      it("3(1, 2)", () => {
        expect(
          G.g
            .double()
            .add(G.g)
            .equals({
              x: F.from(26n),
              y: F.from(45n),
            })
        ).toBeTruthy();
      });
    });

    describe("scale", () => {
      it("3(1, 2)", () => {
        expect(G.g.double().add(G.g).equals(G.g.scale(3n))).toBeTruthy();
      });

      it("5*(1, 2)", () => {
        expect(
          G.g.scale(5n).equals({
            x: F.from(12n),
            y: F.from(32n),
          })
        ).toBeTruthy();
      });

      it("87*(1, 2)", () => {
        expect(
          G.g.scale(87n).equals({
            x: F.from(68n),
            y: F.from(74n),
          })
        ).toBeTruthy();
      });

      it("0*(1, 2)", () => {
        expect(G.g.scale(0n).equals(G.zero)).toBeTruthy();
      });

      it("1*(1, 2)", () => {
        expect(G.g.scale(1n).equals(G.g)).toBeTruthy();
      });
    });
  });
});
