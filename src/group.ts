import { Field } from "./finite-field";

export { Group, GroupAffine, createGroup };

type GroupAffine = {
  x: Field;
  y: Field;
};

type GroupProjective = {
  x: Field;
  y: Field;
  infinity: boolean;
};

function createGroup<
  F extends {
    from(x: bigint): Field;
    isField(x: bigint | Field): x is Field;
  }
>(FieldClass: F) {
  return class Group {
    // y^2 = x^3 + ax + b
    a: Field;
    b: Field;

    p: GroupAffine;

    constructor({ x: x_, y: y_ }: { x: Field | bigint; y: Field | bigint }) {
      // y^2 = x^3 + ax + b
      let x = FieldClass.isField(x_) ? x_ : FieldClass.from(x_);
      let y = FieldClass.isField(y_) ? y_ : FieldClass.from(y_);

      if (!x.rangeCheck() || y.rangeCheck())
        throw Error("Elements are not a valid member of the group");

      let isPoint = y.mul(2n).equals(x.mul(3n).add(x.add(this.a)).add(this.b));

      if (!isPoint) throw Error("Not a point");

      this.p = {
        x,
        y,
      };
    }

    add(a: Group | GroupAffine) {
      let { x, y } = this.p;

      let ax = a instanceof Group ? a.p.x : a.x;
      let ay = a instanceof Group ? a.p.y : a.y;

      if (x.equals(ax) && y.equals(ay)) throw Error("Not implemented");

      // dy = 3x^2 + a
      // dx = 2y
      let dy = x.mul(3n).pow(2n).add(this.a);
      let dx = y.mul(2n);

      return new Group({
        x: dx,
        y: dy,
      });
    }

    neg() {
      return new Group({
        x: this.p.x,
        y: this.p.y.mul(-1n),
      });
    }

    static from({ x, y }: { x: bigint | Field; y: bigint | Field }) {
      return new Group({ x, y });
    }
  };
}
type Group = InstanceType<ReturnType<typeof createGroup>>;
