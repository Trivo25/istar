import { randomBytes } from "crypto";

export { Field, FieldClass, createField };

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
  console.log(size);

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

const createField = (p: bigint) =>
  class Field {
    value: bigint;

    static p: bigint = p;

    constructor(x: bigint | Field) {
      this.value = mod(Field.isField(x) ? x.value : x, Field.p);
    }

    static get modulus() {
      return this.p;
    }

    toBigint() {
      return this.value;
    }

    toString() {
      return this.value.toString();
    }

    static zero() {
      return new Field(0n);
    }

    static one() {
      return new Field(1n);
    }

    static random() {
      return new Field(random(Field.p));
    }

    add(x: Field | bigint): Field {
      return new Field(
        add(this.value, Field.isField(x) ? x.value : x, Field.p)
      );
    }

    sub(x: Field | bigint): Field {
      return new Field(
        sub(this.value, Field.isField(x) ? x.value : x, Field.p)
      );
    }

    mul(x: Field | bigint): Field {
      return new Field(
        mul(this.value, Field.isField(x) ? x.value : x, Field.p)
      );
    }

    pow(x: Field | bigint): Field {
      return new Field(
        pow(this.value, Field.isField(x) ? x.value : x, Field.p)
      );
    }

    div(x: Field | bigint) {
      return new Field(
        div(this.value, Field.isField(x) ? x.value : x, Field.p)!
      );
    }

    inverse() {
      let x = inverse(this.value, Field.p)!;
      //if (x === undefined) return undefined;
      return new Field(x);
    }

    equals(a: Field | bigint) {
      return Field.isField(a) ? a.value === this.value : a === this.value;
    }

    lessThan(a: Field | bigint) {
      return Field.isField(a) ? a.value > this.value : a > this.value;
    }

    lessThanOrEqual(a: Field | bigint) {
      return Field.isField(a) ? a.value >= this.value : a >= this.value;
    }

    greaterThan(a: Field | bigint) {
      return !this.lessThan(a);
    }

    greaterThanOrEqual(a: Field | bigint) {
      return !this.lessThanOrEqual(a);
    }

    inRange() {
      return this.value <= Field.p;
    }

    static from(x: bigint | Field) {
      return new Field(x);
    }

    static isField(x: Field | bigint): x is Field {
      return typeof x !== "bigint";
    }
  };

type Field = InstanceType<ReturnType<typeof createField>>;
type FieldClass = ReturnType<typeof createField>;
