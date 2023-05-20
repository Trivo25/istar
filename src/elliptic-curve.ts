import { Field } from "./finite-field";
import { InferReturn, toFunctionConstructor } from "./lib";

export { EC, GroupAffine };

type GroupAffine = {
  x: Field;
  y: Field;
};

type GroupProjective = {
  x: Field;
  y: Field;
  infinity: boolean;
};

class EllipticCurve {
  // y^2 = x^3 + ax + b
  a: Field;
  b: Field;

  p: GroupAffine;

  constructor({ x: x_, y: y_ }: { x: Field | bigint; y: Field | bigint }) {
    // y^2 = x^3 + ax + b
    let x = x_ instanceof Field ? (x_ as Field) : Field(x_ as bigint);
    let y = y_ instanceof Field ? (y_ as Field) : Field(y_ as bigint);

    let isPoint = y.mul(2n).equals(x.mul(3n).add(x.add(this.a)).add(this.b));

    if (!isPoint) throw Error("Not a point");

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
    let dy = x.mul(3n).pow(2n).add(this.a);
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
}

const EC = toFunctionConstructor(
  class Pallas extends EllipticCurve {
    a = Field(5n);
    b = Field(3n);
  }
);

type EC = InferReturn<typeof EC>;
