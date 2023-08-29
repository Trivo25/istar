import { randomBytes } from "crypto";

export { Field, createField };

function mod(a: bigint, p: bigint) {
  let x = a % p;
  if (x < 0) return a + p;
  return x;
}

function div(a: bigint, b: bigint, p: bigint) {
  let ainv = inverse(a, p);
  if (ainv === undefined) return; // we assume p is prime, therefor every element should be invertible gcd(a, p) = 1
  return mod(b * ainv, p);
}

function add(a: bigint, b: bigint, p: bigint) {
  return mod(a + b, p);
}

function sub(a: bigint, b: bigint, p: bigint) {
  return mod(a - b, p);
}

function mul(a: bigint, b: bigint, p: bigint) {
  return mod(a * b, p);
}

// a^n mod p
function pow(a: bigint, n: bigint, p: bigint) {
  a = mod(a, p);
  let x = 1n;
  for (; n > 0n; n >>= 1n) {
    if (n & 1n) x = mod(x * a, p);
    a = mod(a * a, p);
  }
  return x;
}

// inv(a) in Fp with EGCD
function inverse(a: bigint, p: bigint) {
  a = mod(a, p);
  if (a === 0n) return undefined;
  let b = p;
  let x = 0n;
  let y = 1n;
  let u = 1n;
  let v = 0n;
  while (a !== 0n) {
    let q = b / a;
    let r = mod(b, a);
    let m = x - u * q;
    let n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }
  if (b !== 1n) return undefined;
  return mod(x, p);
}

function random(p: bigint) {
  let size = Math.floor(p.toString(2).length / 8);
  while (true) {
    let x = BigInt("0x" + randomBytes(size).toString("hex"));
    if (x < p) return x;
  }
}

function isSquare(x: bigint, p: bigint) {
  if (x === 0n) return true;
  return pow(x, (p - 1n) / 2n, p) === 1n;
}

/*
  Tonelli-Shanks algorithm.
  Input: 
    p, a prime 
    n, the n in r^2 = n
  Output:
    r, the r in r^2 = n
  */
function sqrt(n: bigint, p: bigint) {}

// T is the base type, e.g. number or bigint
class Field<T = bigint> {
  value: bigint;
  p: bigint;
  constructor(value: bigint, p: bigint) {
    this.p = p;
    this.value = mod(value, p);
  }

  add(x: Field<T>) {
    return new Field(add(this.value, x.value, this.p), this.p);
  }

  toString() {
    return this.value.toString();
  }

  sub(x: Field<T>): Field {
    return new Field(sub(this.value, x.value, this.p), this.p);
  }

  mul(x: Field<T>): Field {
    return new Field(mul(this.value, x.value, this.p), this.p);
  }

  square(): Field {
    return new Field(pow(this.value, 2n, this.p), this.p);
  }

  pow(x: Field<T>): Field {
    return new Field(pow(this.value, x.value, this.p), this.p);
  }

  div(x: Field<T>): Field {
    return this.mul(x.inverse());
  }

  inverse() {
    let x = inverse(this.value, this.p)!;
    //if (x === undefined) return undefined;
    return new Field(x, this.p);
  }

  equals(a: Field<T>) {
    return a.value === this.value;
  }

  lessThan(a: Field<T>) {
    return a.value > this.value;
  }

  lessThanOrEqual(a: Field<T>) {
    return a.value >= this.value;
  }

  greaterThan(a: Field<T>) {
    return !this.lessThan(a);
  }

  greaterThanOrEqual(a: Field<bigint>) {
    return !this.lessThanOrEqual(a);
  }

  inRange() {
    return this.value <= this.p;
  }

  toBigInt() {
    return this.value;
  }
}

function createField(p: bigint) {
  return class Fp extends Field {
    p = p;
    static modulus = p;
    constructor(value: bigint) {
      super(value, p);
    }

    static from(value: bigint) {
      return new Field(value, p);
    }

    static zero() {
      return new Field(0n, p);
    }

    static one() {
      return new Field(1n, p);
    }

    static random() {
      return new Field(random(p), p);
    }
  };
}
