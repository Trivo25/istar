import { InferReturn, toFunctionConstructor } from "./lib";
import { randomBytes } from "crypto";

export { Field, isField };

function mod(a: bigint, p: bigint) {
  let x = a % p;
  if (x < 0) return a + p;
  return x;
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

// TODO tonelli shanks
function sqrt() {}

const Field = toFunctionConstructor(
  class Field {
    value: bigint;

    static p: bigint = 251n;

    constructor(x: bigint) {
      this.value = mod(x, Field.p);
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
      return new Field(BigInt("0x" + randomBytes(256).toString("hex")));
    }

    add(x: Field | bigint): Field {
      return new Field(add(this.value, isField(x) ? x.value : x, Field.p));
    }

    sub(x: Field | bigint): Field {
      return new Field(sub(this.value, isField(x) ? x.value : x, Field.p));
    }

    mul(x: Field | bigint): Field {
      return new Field(mul(this.value, isField(x) ? x.value : x, Field.p));
    }

    pow(x: Field | bigint): Field {
      return new Field(pow(this.value, isField(x) ? x.value : x, Field.p));
    }

    inverse() {
      let x = inverse(this.value, Field.p);
      if (x === undefined) return undefined;
      return new Field(x);
    }

    equals(a: Field | bigint) {
      return isField(a) ? a.value === this.value : a === this.value;
    }
  }
);
type Field = InferReturn<typeof Field>;

function isField(x: Field | bigint): x is Field {
  return typeof x !== "bigint";
}
