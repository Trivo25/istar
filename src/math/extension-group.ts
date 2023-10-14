import { Field, FieldClass, FieldExtensionClass, FieldExtension } from "..";

export { ExtensionGroup, GroupAffine, createExtensionGroup };

type GroupAffine = {
  x: FieldExtension;
  y: FieldExtension;
};

type CurveParams = {
  a: FieldExtension;
  b: FieldExtension;
  g: { x: FieldExtension; y: FieldExtension };
};

function createExtensionGroup(
  FieldClass_: FieldClass,
  PolyClass: FieldExtensionClass,
  params: CurveParams
) {
  return class ExtensionGroup {
    // y^2 = x^3 + ax + b
    static a: FieldExtension = params.a;
    static b: FieldExtension = params.b;
    static g: ExtensionGroup = ExtensionGroup.from(params.g);

    static zero: ExtensionGroup = ExtensionGroup.from({
      x: PolyClass.zero(),
      y: PolyClass.zero(),
    });

    p: GroupAffine;

    constructor({ x, y }: { x: FieldExtension; y: FieldExtension }) {
      // y^2 = x^3 + ax + b
      if (!ExtensionGroup.isPoint({ x, y })) {
        throw new Error(
          `(${x.toPretty()}, ${y.toPretty()}) is not a valid point on this curve.`
        );
      }

      this.p = {
        x,
        y,
      };
    }

    static isPoint({ x, y }: { x: FieldExtension; y: FieldExtension }) {
      // point of infinity; the neutral element of the group
      if (x.equals(PolyClass.zero()) && y.equals(PolyClass.zero())) return true;

      let x3 = x.square().mul(x);
      let y2 = y.square();
      return y2.equals(x3.add(x.mul(ExtensionGroup.a)).add(ExtensionGroup.b));
    }

    isZero() {
      let { x, y } = this.p;
      return x.equals(PolyClass.zero()) && y.equals(PolyClass.zero());
    }

    add(a: ExtensionGroup) {
      let { x, y } = this.p;

      let { x: xq, y: yq } = a.p;

      if (this.isZero()) {
        return new ExtensionGroup({ x: xq, y: yq });
      } else if (xq.equals(PolyClass.zero()) && yq.equals(PolyClass.zero())) {
        return new ExtensionGroup(this.p);
      }

      // two points are the same, special case
      if (x.equals(xq) && y.equals(yq)) return this.double();

      let { x: xp, y: yp } = this.p;

      // https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication
      let m = yq.sub(yp).div(xq.sub(xp)).R;

      let xr = m.square().sub(xp).sub(xq);
      let yr = m.mul(xp.sub(xr)).sub(yp);

      return new ExtensionGroup({
        x: xr,
        y: yr,
      });
    }

    scale(s: bigint): ExtensionGroup {
      let P = new ExtensionGroup(this.p);
      if (s === 0n) return ExtensionGroup.zero;
      else if (s === 1n) return this;
      else if (s % 2n === 1n) {
        return P.add(P.scale(s - 1n));
      } else {
        return P.double().scale(s / 2n);
      }
    }

    double() {
      let a = ExtensionGroup.a;
      let { x, y } = this.p;

      let p2 = PolyClass.from([FieldClass_.from(2n)]);
      let m = x
        .square()
        .mul(PolyClass.from([FieldClass_.from(3n)]))
        .add(a)
        .div(y.mul(p2)).Q;

      let xr = m.square().sub(x.mul(p2));
      let yr = m.mul(x.sub(xr)).sub(y);

      return new ExtensionGroup({
        x: xr,
        y: yr,
      });
    }

    /**
     * Negation of a point P. https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication#Point_negation
     */
    neg() {
      return new ExtensionGroup({
        x: this.p.x,
        y: this.p.y.mul(PolyClass.from([FieldClass_.from(-1n)])),
      });
    }

    equals(a: ExtensionGroup | GroupAffine) {
      let { x, y } = this.p;

      let { x: xa, y: ya } = this.destructAffineOrGroup(a);

      return x.equals(xa) && y.equals(ya);
    }

    static from({ x, y }: { x: FieldExtension; y: FieldExtension }) {
      return new ExtensionGroup({ x, y });
    }

    destructAffineOrGroup(a: ExtensionGroup | GroupAffine) {
      return {
        x: a instanceof ExtensionGroup ? a.p.x : a.x,
        y: a instanceof ExtensionGroup ? a.p.y : a.y,
      };
    }

    toPretty() {
      return `{x: ${this.p.x.toPretty()}, y: ${this.p.y.toPretty()}}`;
    }
  };
}
type ExtensionGroup = InstanceType<ReturnType<typeof createExtensionGroup>>;
