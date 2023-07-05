import { Field, FieldClass } from "./finite-field";

export { EllipticCurve, GroupAffine, createEllipticCurve };

type GroupAffine = {
  x: Field;
  y: Field;
};

type GroupProjective = {
  x: Field;
  y: Field;
  infinity: boolean;
};

type CurveParams = {
  a: bigint;
  b: bigint;
  g: { x: bigint; y: bigint };
};

function createEllipticCurve(FieldClass_: FieldClass, params: CurveParams) {
  return class EllipticCurve {
    // y^2 = x^3 + ax + b
    static a: Field = FieldClass_.from(params.a);
    static b: Field = FieldClass_.from(params.b);
    static g: EllipticCurve = EllipticCurve.from(params.g);

    p: GroupAffine;

    constructor({ x: x_, y: y_ }: { x: Field | bigint; y: Field | bigint }) {
      // y^2 = x^3 + ax + b
      let x = FieldClass_.isField(x_) ? x_ : FieldClass_.from(x_);
      let y = FieldClass_.isField(y_) ? y_ : FieldClass_.from(y_);

      let isPoint = y
        .mul(2n)
        .equals(x.mul(3n).add(x.add(EllipticCurve.a)).add(EllipticCurve.b));

      //if (!isPoint) throw new Error("Not a point");

      this.p = {
        x,
        y,
      };
    }

    add(a: EllipticCurve | GroupAffine) {
      let { x, y } = this.p;

      let ax = a instanceof EllipticCurve ? a.p.x : a.x;
      let ay = a instanceof EllipticCurve ? a.p.y : a.y;

      if (x.equals(ax) && y.equals(ay)) throw Error("Not implemented");

      // dy = 3x^2 + a
      // dx = 2y
      let dy = x.mul(3n).pow(2n).add(EllipticCurve.a);
      let dx = y.mul(2n);

      return new EllipticCurve({
        x: dx,
        y: dy,
      });
    }

    neg() {
      return new EllipticCurve({
        x: this.p.x,
        y: this.p.y.mul(-1n),
      });
    }

    static from({ x, y }: { x: bigint | Field; y: bigint | Field }) {
      return new EllipticCurve({ x, y });
    }
  };
}
type EllipticCurve = InstanceType<ReturnType<typeof createEllipticCurve>>;
