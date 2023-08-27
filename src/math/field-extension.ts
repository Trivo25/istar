import { Field, Polynomial, createField, createPolynomial } from "..";

export { FieldExtensionClass, FieldExtension, extend };

const extend = (
  FieldClass: ReturnType<typeof createField>,
  p: Field[],
  m: bigint
) => {
  let PolynomialClass = createPolynomial(FieldClass);
  let P = PolynomialClass.from(p);

  return class FieldExtension extends PolynomialClass {
    modulus: Polynomial = P;

    constructor(coeffs: Field[]) {
      if (coeffs.length > m)
        throw Error("Degree of the polynomial needs to be less than 2");

      super(coeffs);
      let { R } = this.div(this.modulus); //PolynomialClass.from(coeffs).div(this.modulus);
      this.coefficients = R.coefficients;
    }

    static from(coeffs: Field[]) {
      return new FieldExtension(coeffs);
    }

    mul(q: FieldExtension): FieldExtension {
      return new FieldExtension(this.mul(q).coefficients);
    }
    add(q: FieldExtension): FieldExtension {
      return new FieldExtension(this.add(q).coefficients);
    }
    sub(q: FieldExtension): FieldExtension {
      return new FieldExtension(this.sub(q).coefficients);
    }
  };
};

type FieldExtension = InstanceType<ReturnType<typeof extend>>;
type FieldExtensionClass = ReturnType<typeof extend>;
