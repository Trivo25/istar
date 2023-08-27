import { Field, FieldClass, createField } from "./finite-field";

export { createPolynomial, Polynomial, createLagrange, Lagrange };

function createPolynomial(FieldClass: ReturnType<typeof createField>) {
  return class Polynomial {
    // x^0*a_0 + x^1*a_1 ... x^n*a_n
    coefficients: Field[];
    static get field() {
      return FieldClass;
    }
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

function createLagrange(FieldClass: ReturnType<typeof createField>) {
  return class Lagrange {
    ws: Field[] = [];
    xs: Field[] = [];
    ys: Field[] = [];
    k: number = 0;
    /*
    static lagrangeInterpolation(xs: { x: Field; y: Field }[]) {
      let counts: Record<string, bigint> = {};
      xs.forEach((x) => {
        let xString = x.x.value.toString();
        counts[xString] = counts[xString] ? counts[xString] + 1n : 1n;
      });

      Object.keys(counts).forEach((key) => {
        if (counts[key] > 1n)
          throw Error("Multiple elements of x are not allowed");
      });

      let n = xs.length;
      // calculating P(x)=sum_(j=1)^nP_j(x)
      // where  P_j(x)=y_jproduct_(k=1; k!=j)^n(x-x_k)/(x_j-x_k)
      // starting with aggregating all P_j
    }
    */

    constructor(ps: { x: Field; y: Field }[]) {
      if (ps.length > 0) {
        this.k = ps.length;
        ps.forEach(({ x, y }) => {
          this.xs.push(x);
          this.ys.push(y);
        });

        this.updateWeights();
      }
    }

    static fromPoints(ps: { x: Field; y: Field }[]) {
      return new Lagrange(ps);
    }

    eval(x_: Field | bigint) {
      let x = FieldClass.isField(x_) ? x_ : FieldClass.from(x_);

      var a = FieldClass.from(0n);
      var b = FieldClass.from(0n);
      var c = FieldClass.from(0n);

      for (var j = 0; j < this.k; ++j) {
        if (!x.equals(this.xs[j])) {
          a = this.ws[j].div(x.sub(this.xs[j]));
          b = b.add(a.mul(this.ys[j]));
          c = c.add(a);
        } else {
          return this.ys[j];
        }
      }

      return b.div(c);
    }

    updateWeights() {
      let k = this.k;
      let w;

      for (let j = 0; j < k; ++j) {
        w = FieldClass.from(1n);
        for (let i = 0; i < k; ++i) {
          if (i != j) {
            w = w.mul(this.xs[j].sub(this.xs[i]));
          }
        }
        this.ws[j] = w.inverse();
      }
    }
  };
}

type Polynomial = InstanceType<ReturnType<typeof createPolynomial>>;
type Lagrange = InstanceType<ReturnType<typeof createLagrange>>;
