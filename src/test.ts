class Field<T = bigint> {
  add(x: Field<bigint>) {
    return new Field(5n);
  }
  constructor(a: bigint) {}
  static test() {}
}

class Polynomial {}

class ExtensionField<T = Field[]> {
  add(x: T) {}
  constructor(a: T) {}

  static test() {}
}

type BaseField<BaseType> = ExtensionField<BaseType> | Field<bigint>;

class Group<BaseFieldType extends BaseField<PrimitiveType>, PrimitiveType> {
  a: BaseFieldType;

  constructor(a: BaseFieldType) {
    this.a = a;
  }

  add(
    a: Group<BaseFieldType, PrimitiveType>
  ): Group<BaseFieldType, PrimitiveType> {
    return a;
  }
}

class Field15 extends Field {}
class Field15Extension extends ExtensionField<bigint[]> {}

class Group15 extends Group<Field15, bigint> {}

class Group15Extension extends Group<Field15Extension, bigint[]> {}

let a = new Field15(5n);
let g = new Group15(a);
g.add(g);

let ak = new Field15Extension([5n]);
let gk = new Group15Extension(ak);
