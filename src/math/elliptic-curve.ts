import { Field, FieldClass } from "./finite-field";

export { EllipticCurve, GroupAffine, createEllipticCurveGroup };

type GroupAffine = {
  x: Field;
  y: Field;
};

type CurveParams = {
  a: bigint;
  b: bigint;
  g: { x: bigint; y: bigint };
};

function createEllipticCurveGroup(
  FieldClass_: FieldClass,
  params: CurveParams
) {
  return class EllipticCurve {
    // y^2 = x^3 + ax + b
    static a: Field = FieldClass_.from(params.a);
    static b: Field = FieldClass_.from(params.b);
    static g: EllipticCurve = EllipticCurve.from(params.g);

    static zero: EllipticCurve = EllipticCurve.from({ x: 0n, y: 0n });

    p: GroupAffine;

    constructor({ x, y }: { x: Field | bigint; y: Field | bigint }) {
      // y^2 = x^3 + ax + b
      x = FieldClass_.isField(x) ? x : FieldClass_.from(x);
      y = FieldClass_.isField(y) ? y : FieldClass_.from(y);

      if (!EllipticCurve.isPoint({ x, y }))
        throw new Error(`(${x}, ${y}) is not a valid point on this curve.`);

      this.p = {
        x,
        y,
      };
    }

    static isPoint({ x, y }: { x: Field | bigint; y: Field | bigint }) {
      x = FieldClass_.isField(x) ? x : FieldClass_.from(x);
      y = FieldClass_.isField(y) ? y : FieldClass_.from(y);

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

      let { x: xq, y: yq } = this.destructAffineOrGroup(a);

      if (this.isZero()) {
        return new EllipticCurve({ x: xq, y: yq });
      } else if (xq.equals(0n) && yq.equals(0n)) {
        return new EllipticCurve(this.p);
      }

      // two points are the same, special case
      if (x.equals(xq) && y.equals(yq)) return this.double();

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

    scale(s: bigint): EllipticCurve {
      let P = new EllipticCurve(this.p);
      if (s === 0n) return EllipticCurve.zero;
      else if (s === 1n) return this;
      else if (s % 2n === 1n) {
        return P.add(P.scale(s - 1n));
      } else {
        return P.double().scale(s / 2n);
      }
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

      let { x: xa, y: ya } = this.destructAffineOrGroup(a);

      return x.equals(xa) && y.equals(ya);
    }

    static from({ x, y }: { x: bigint | Field; y: bigint | Field }) {
      return new EllipticCurve({ x, y });
    }

    destructAffineOrGroup(a: EllipticCurve | GroupAffine) {
      return {
        x: a instanceof EllipticCurve ? a.p.x : a.x,
        y: a instanceof EllipticCurve ? a.p.y : a.y,
      };
    }
  };
}
type EllipticCurve = InstanceType<ReturnType<typeof createEllipticCurveGroup>>;
