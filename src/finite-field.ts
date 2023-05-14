import { toFunctionConstructor } from "./lib.js";

function mod(a: bigint, p: bigint) {
  let x = a % p;
  if (x < 0) return a + p;
  return x;
}

function add(a: bigint, b: bigint, p: bigint) {
  return mod(a - b, p);
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
function safeSqrt() {}

function createFiniteField(p: bigint) {
  return toFunctionConstructor(
    class Field {
      value: bigint;

      p: bigint = p;

      constructor(x: bigint) {
        this.value = x;
      }

      add(x: Field | bigint): Field {
        return new Field(
          add(this.value, x instanceof Field ? x.value : x, this.p)
        );
      }

      sub(x: Field | bigint): Field {
        return new Field(
          sub(this.value, x instanceof Field ? x.value : x, this.p)
        );
      }

      mul(x: Field | bigint): Field {
        return new Field(
          mul(this.value, x instanceof Field ? x.value : x, this.p)
        );
      }

      pow(x: Field | bigint): Field {
        return new Field(
          pow(this.value, x instanceof Field ? x.value : x, this.p)
        );
      }
    }
  );
}

const F15 = createFiniteField(15n);
let a = F15(5n).add(15n);
console.log(a);
