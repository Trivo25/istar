import { Field, FieldClass, createField } from "./finite-field";

export { createPolynomial, Polynomial };

function createPolynomial(FieldClass: ReturnType<typeof createField>) {
  return class Polynomial {
    // x^0*a_0 + x^1*a_1 ... x^n*a_n
    coefficients: Field[];
    static get field() {
      return FieldClass;
    }
    constructor(coeffs: Field[]) {
      // remove trailing zeroes
      while (
        coeffs[coeffs.length - 1] &&
        coeffs[coeffs.length - 1].equals(0n)
      ) {
        coeffs.pop();
      }
      this.coefficients = coeffs;
    }

    static from(coeffs: Field[]) {
      return new Polynomial(coeffs);
    }

    static fromLagrangePoints(ps: Point[]) {
      return ps
        .map(({ x: xj, y: yj }, j) => {
          let exceptXn = [...ps];
          exceptXn.splice(j, 1);

          let dividend = Polynomial.from([FieldClass.from(1n)]);
          let divisor = Polynomial.from([FieldClass.from(1n)]);

          let xPoly = Polynomial.x();

          for (const p of exceptXn) {
            dividend = dividend.mul(xPoly.sub(Polynomial.from([p.x])));
            divisor = divisor.mul(
              Polynomial.from([xj]).sub(Polynomial.from([p.x]))
            );
          }

          return dividend.div(divisor).Q.mul(Polynomial.from([yj]));
        })
        .reduce((a, b) => a.add(b), Polynomial.from([FieldClass.from(0n)]));
    }

    static x() {
      // 0 + 1x
      return new Polynomial([FieldClass.from(0n), FieldClass.from(1n)]);
    }

    div(B: Polynomial) {
      if (B.coefficients.find((c) => !c.equals(0n)) === undefined)
        throw Error("Divisor polynomial cannot be the zero polynomial!");

      let Q = new Polynomial([FieldClass.from(0n)]);
      let R = new Polynomial(this.coefficients);
      let d = B.degree();
      let c = B.lc();

      while (R.degree() >= d) {
        let n = R.degree() - d;
        let e = R.lc().div(c);
        let S_coefficients = new Array<Field>(n + 1).fill(FieldClass.from(0n));

        S_coefficients[n] = e;

        let S = new Polynomial(S_coefficients);

        Q = Q.add(S);
        let sb = S.mul(B);
        R = R.sub(sb);
      }

      if (!Q.mul(B).add(R).equals(this)) throw Error("Something went wrong");

      return {
        Q,
        R,
      };
    }

    mul(p: Polynomial) {
      let m = p.degree() + 1;
      let n = this.degree() + 1;

      let A = m > n ? p : new Polynomial(this.coefficients);
      let B = m > n ? new Polynomial(this.coefficients) : p;

      let prod = new Array<Field>(m + n - 1).fill(FieldClass.from(0n));

      for (let i = 0; i < Math.max(m, n); i++) {
        for (let j = 0; j < Math.min(m, n); j++) {
          let b = B.coefficients[j];
          let a = A.coefficients[i];
          prod[i + j] = prod[i + j].add(b.mul(a));
        }
      }

      return new Polynomial(prod);
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
        let c = b.at(i);
        if (c) {
          coeffs.push(a[i].add(c));
        } else {
          coeffs.push(a[i]);
        }
      }

      return new Polynomial(coeffs);
    }

    sub(p: Polynomial) {
      let a = p.coefficients;
      let b = this.coefficients;

      if (a.length >= b.length) {
        b = b.concat(Array(a.length - b.length).fill(FieldClass.from(0n)));
      } else {
        a = a.concat(Array(b.length - a.length).fill(FieldClass.from(0n)));
      }

      let coeffs = [];
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        coeffs.push(b[i].sub(a.at(i) ?? FieldClass.from(0n)));
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

    lc() {
      return this.coefficients[this.coefficients.length - 1];
    }

    degree() {
      return this.coefficients.length - 1;
    }

    toString() {
      return this.coefficients.map((c) => c.toString());
    }

    toPretty() {
      let s = "";
      let n = this.degree() + 1;
      for (let i = 0; i < n; i++) {
        let c = this.coefficients[i];
        if (c.equals(0n)) continue;
        s += c.toString();
        if (i != 0) s += "x^" + i;
        if (i != n - 1) s += " + ";
      }
      return s;
    }
  };
}

type Polynomial = InstanceType<ReturnType<typeof createPolynomial>>;

type Point = {
  x: InstanceType<FieldClass>;
  y: InstanceType<FieldClass>;
};
