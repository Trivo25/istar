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

      if (!coeffs.every((i) => i.equals(0n))) {
        this.coefficients = super.div(this.modulus).R.coefficients;
      }
    }

    static from(coeffs: Field[]) {
      return new FieldExtension(coeffs);
    }

    div(q: FieldExtension) {
      let p = super.div(q);
      return {
        Q: new FieldExtension(p.Q.coefficients),
        R: new FieldExtension(p.R.coefficients),
      };
    }

    square(): FieldExtension {
      return new FieldExtension(super.square().coefficients);
    }

    mul(q: FieldExtension): FieldExtension {
      return new FieldExtension(super.mul(q).div(this.modulus).R.coefficients);
    }
    add(q: FieldExtension): FieldExtension {
      return new FieldExtension(super.add(q).coefficients);
    }

    sub(q: FieldExtension): FieldExtension {
      return new FieldExtension(super.sub(q).coefficients);
    }

    static zero() {
      // 0
      return new FieldExtension([FieldClass.from(0n)]);
    }

    static one() {
      // 1
      return new FieldExtension([FieldClass.from(1n)]);
    }
  };
};

type FieldExtension = InstanceType<ReturnType<typeof extend>>;
type FieldExtensionClass = ReturnType<typeof extend>;
