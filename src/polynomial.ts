import { createFiniteField, FiniteField } from "./finite-field";
import { toFunctionConstructor } from "./lib";

export { Polynomial };

const Polynomial = toFunctionConstructor(
  class Polynomial<F extends FiniteField> {
    coefficients: F[];

    constructor(coeffs: F[]) {
      this.coefficients = coeffs;
    }

    add(p: Polynomial<F>) {
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

    eval(x_: F) {}
  }
);
