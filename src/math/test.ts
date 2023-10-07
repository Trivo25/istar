type PrimitiveType = bigint | Array<bigint>;

interface FieldArithmetic<P extends PrimitiveType> {
  add(a: this | P): this;
  sub(a: this | P): this;
  mul(a: this | P): this;
  square(): this;
}

class Field implements FieldArithmetic<bigint> {
  add(a: bigint | this): this {
    throw new Error("Method not implemented.");
  }
  sub(a: bigint | this): this {
    throw new Error("Method not implemented.");
  }
  mul(a: bigint | this): this {
    throw new Error("Method not implemented.");
  }
  square(): this {
    throw new Error("Method not implemented.");
  }

  static a() {}
}

class FieldExtension implements FieldArithmetic<Array<bigint>> {
  add(a: bigint[] | this): this {
    throw new Error("Method not implemented.");
  }
  sub(a: bigint[] | this): this {
    throw new Error("Method not implemented.");
  }
  mul(a: bigint[] | this): this {
    throw new Error("Method not implemented.");
  }
  square(): this {
    throw new Error("Method not implemented.");
  }

  static b() {}
}

class Group<F extends Field | FieldExtension, P extends PrimitiveType>
  implements FieldArithmetic<P>
{
  add(a: any): this {
    throw new Error("Method not implemented.");
  }
  sub(a: any): this {
    throw new Error("Method not implemented.");
  }
  mul(a: Group<F, P> | P): this {
    if (a instanceof Group) {
    }
    return this;
  }

  square(): this {
    throw new Error("Method not implemented.");
  }
}

let g = new Group<Field, bigint>();
