import { Field } from "./finite-field";
import { toFunctionConstructor } from "./lib";

export { Polynomial };

const Polynomial = toFunctionConstructor(
  class Polynomial {
    // x^0*a_0 + x^1*a_1 ... x^n*a_n
    coefficients: Field[];

    constructor(coeffs: Field[]) {
      this.coefficients = coeffs;
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

    eval(x: Field) {
      return this.coefficients.reduce((a, b, i) => {
        let xi = x.pow(BigInt(i));
        let bxi = xi.mul(b);
        return bxi.add(a);
      }, Field(0n));
    }
  }
);
