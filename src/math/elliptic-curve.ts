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

    static zero: EllipticCurve = EllipticCurve.from({ x: 0n, y: 0n });

    p: GroupAffine;

    constructor({ x: x_, y: y_ }: { x: Field | bigint; y: Field | bigint }) {
      // y^2 = x^3 + ax + b
      let x = FieldClass_.isField(x_) ? x_ : FieldClass_.from(x_);
      let y = FieldClass_.isField(y_) ? y_ : FieldClass_.from(y_);

      if (!EllipticCurve.isPoint({ x, y }))
        throw new Error(`(${x}, ${y}) is not a valid point on this curve.`);

      this.p = {
        x,
        y,
      };
    }

    static isPoint({ x: x_, y: y_ }: { x: Field | bigint; y: Field | bigint }) {
      let x = FieldClass_.isField(x_) ? x_ : FieldClass_.from(x_);
      let y = FieldClass_.isField(y_) ? y_ : FieldClass_.from(y_);

      // point of infinity; the neutral element of the group
      if (x.equals(0n) && y.equals(0n)) return true;

      return y
        .square()
        .equals(x.pow(3n).add(x.mul(EllipticCurve.a)).add(EllipticCurve.b));
    }

    isZero() {
      let { x, y } = this.p;
      return x.equals(0n) && y.equals(0n);
    }

    add(a: EllipticCurve | GroupAffine) {
      let { x, y } = this.p;

      let xq = a instanceof EllipticCurve ? a.p.x : a.x;
      let yq = a instanceof EllipticCurve ? a.p.y : a.y;

      if ((x.equals(xq) && y.equals(yq)) || this.isZero()) return this.double();

      if (this.isZero()) {
        if (xq.equals(0n) && yq.equals(0n)) return this;
        else new EllipticCurve({ x: xq, y: yq });
      }

      let { x: xp, y: yp } = this.p;

      // https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication
      let m = yq.sub(yp).div(xq.sub(xp));

      let xr = m.square().sub(xp).sub(xq);
      let yr = m.mul(xp.sub(xr)).sub(yp);

      return new EllipticCurve({
        x: xr,
        y: yr,
      });
    }

    double() {
      let a = EllipticCurve.a;
      let { x, y } = this.p;

      let m = x.square().mul(3n).add(a).div(y.mul(2n));

      let xr = m.square().sub(x.mul(2n));
      let yr = m.mul(x.sub(xr)).sub(y);

      return new EllipticCurve({
        x: xr,
        y: yr,
      });
    }

    /**
     * Negation of a point P. https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication#Point_negation
     */
    neg() {
      return new EllipticCurve({
        x: this.p.x,
        y: this.p.y.mul(-1n),
      });
    }

    equals(a: EllipticCurve | GroupAffine) {
      let { x, y } = this.p;

      let ax = a instanceof EllipticCurve ? a.p.x : a.x;
      let ay = a instanceof EllipticCurve ? a.p.y : a.y;

      return x.equals(ax) && y.equals(ay);
    }

    static from({ x, y }: { x: bigint | Field; y: bigint | Field }) {
      return new EllipticCurve({ x, y });
    }

    static random() {
      let P = EllipticCurve.from({
        x: FieldClass_.random(),
        y: FieldClass_.random(),
      });

      while (!EllipticCurve.isPoint(P.p)) {
        P = EllipticCurve.from({
          x: FieldClass_.random(),
          y: FieldClass_.random(),
        });
      }

      return P;
    }
  };
}
type EllipticCurve = InstanceType<ReturnType<typeof createEllipticCurve>>;
