import { Field, createField } from "./finite-field";

export { createPolynomial, Polynomial };

function createPolynomial(FieldClass: ReturnType<typeof createField>) {
  return class Polynomial {
    // x^0*a_0 + x^1*a_1 ... x^n*a_n
    coefficients: Field[];

    constructor(coeffs: Field[]) {
      this.coefficients = coeffs;
    }

    static from(coeffs: Field[]) {
      return new Polynomial(coeffs);
    }

    static x() {
      // 0 + 1x
      return new Polynomial([FieldClass.from(0n), FieldClass.from(1n)]);
    }

    add(p: Polynomial) {
      let a, b;
      if (p.coefficients.length >= this.coefficients.length) {
        a = p.coefficients;
        b = this.coefficients;
      } else {
        b = p.coefficients;
        a = this.coefficients;
      }

      let coeffs = [];
      for (let i = 0; i < a.length; i++) {
        coeffs.push(a[i].add(b[i]));
      }

      return new Polynomial(coeffs);
    }

    eval(x_: Field | bigint) {
      let x = FieldClass.isField(x_) ? x_ : FieldClass.from(x_);
      return this.coefficients.reduce((a, b, i) => {
        let xi = x.pow(BigInt(i));
        let bxi = xi.mul(b);
        return bxi.add(a);
      }, FieldClass.from(0n));
    }

    equals(p: Polynomial) {
      let thisLength = this.coefficients.length;
      let pLength = p.coefficients.length;

      if (pLength !== thisLength) return false;

      for (let i = 0; i < thisLength; i++) {
        if (!this.coefficients[i].equals(p.coefficients[i])) return false;
      }
      return true;
    }

    degree() {
      return this.coefficients.length - 1;
    }
  };
}
type Polynomial = InstanceType<ReturnType<typeof createPolynomial>>;
