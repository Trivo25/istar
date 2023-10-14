import { Field, FieldClass, createField } from "./finite-field";

export { createPolynomial, Polynomial };

function createPolynomial(FieldClass: FieldClass) {
  return class Polynomial {
    // x^0*a_0 + x^1*a_1 ... x^n*a_n
    coefficients: Field[];

    static get FieldClass() {
      return FieldClass;
    }

    constructor(coefficients: Field[]) {
      // remove trailing zeroes
      //if (!(coefficients.length === 1 && coefficients[0].equals(0n))) {

      // if all coefficients are 0, then the polynomial is 0 [0]
      // if the array is empty, then the polynomial is 0 [0]
      if (
        coefficients.every((c) => c.equals(0n)) ||
        coefficients.length === 0
      ) {
        coefficients = [FieldClass.from(0n)];
      } else {
        // crop the array to remove padded zeroes
        while (
          coefficients[coefficients.length - 1] &&
          coefficients[coefficients.length - 1].equals(0n)
        ) {
          coefficients.pop();
        }
      }

      //}
      this.coefficients = coefficients;
    }

    static from(coefficients: Field[]) {
      return new Polynomial(coefficients);
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

    static zero() {
      // 0
      return new Polynomial([FieldClass.from(0n)]);
    }

    div(B: Polynomial) {
      if (B.isZero())
        throw Error("Divisor polynomial cannot be the zero polynomial!");

      let Q = new Polynomial([FieldClass.from(0n)]);
      let R = new Polynomial(this.coefficients);

      if (this.isZero()) {
        return {
          Q,
          R,
        };
      }

      let d = B.degree();
      let c = B.lc();

      while (R.degree() >= d) {
        if (R.isZero()) break;

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

    add(P: Polynomial) {
      if (this.isZero()) return P;
      if (P.isZero()) return this;

      let xs: Field[] = [];
      let ys: Field[] = [];
      if (P.coefficients.length >= this.coefficients.length) {
        xs = P.coefficients;
        ys = this.coefficients;
      } else {
        ys = P.coefficients;
        xs = this.coefficients;
      }

      let coefficients = [];
      for (let i = 0; i < xs.length; i++) {
        let c = ys.at(i);
        if (c) {
          coefficients.push(xs[i].add(c));
        } else {
          coefficients.push(xs[i]);
        }
      }

      return new Polynomial(coefficients);
    }

    isZero() {
      return this.coefficients.length === 1 && this.coefficients[0].equals(0n);
    }

    sub(P: Polynomial) {
      let xs = P.coefficients;
      let ys = this.coefficients;

      if (xs.length >= ys.length) {
        ys = ys.concat(Array(xs.length - ys.length).fill(FieldClass.from(0n)));
      } else {
        xs = xs.concat(Array(ys.length - xs.length).fill(FieldClass.from(0n)));
      }

      let coefficients = [];
      for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
        coefficients.push(ys[i].sub(xs.at(i) ?? FieldClass.from(0n)));
      }

      return new Polynomial(coefficients);
    }

    square() {
      return this.mul(new Polynomial([...this.coefficients]));
    }

    eval(x: Field | bigint) {
      let x_ = FieldClass.isField(x) ? x : FieldClass.from(x);
      return this.coefficients.reduce((a, b, i) => {
        let xi = x_.pow(BigInt(i));
        let bxi = xi.mul(b);
        return bxi.add(a);
      }, FieldClass.from(0n));
    }

    equals(P: Polynomial) {
      let thisLength = this.coefficients.length;
      let pLength = P.coefficients.length;

      if (pLength !== thisLength) return false;

      for (let i = 0; i < thisLength; i++) {
        if (!this.coefficients[i].equals(P.coefficients[i])) return false;
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
        if (c.equals(0n) && this.coefficients.length !== 1) continue;
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
