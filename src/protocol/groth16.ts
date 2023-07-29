import { FieldClass } from "..";

export { Groth16 };

class Groth16 {
  fieldClass: FieldClass;

  private constructor(fieldClass: FieldClass) {
    this.fieldClass = fieldClass;
  }

  static create(fieldClass: FieldClass) {
    return new Groth16(fieldClass);
  }

  setup() {}
}
