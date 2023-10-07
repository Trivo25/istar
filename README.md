## istar

--

Istar is a collection of mathematical primitives such as finite fields or elliptic curves and cryptographic protocols.

### Finite Fields

```ts
// Create a new finite field class with modulus p = 251
class F_251 extends createField(251n) {}

// initiate a finite field element

let a = F_251.from(5n);

a.add(5n).toBigint() === 10n; // true

a.add(251n).toBigint() === 5n; // true
```

### Polynomials over Finite Fields

```ts
// Create a new finite field class with modulus p = 251
class F_251 extends createField(251n) {}
// Create a new polynomial class based on F_251
class P_251 extends createPolynomial(F_251) {}

// initiate a polynomial

let p = P_251.from([F_251.from(12n), F_251.from(2n), F_251.from(1n)]);
```

### Elliptic Curves over Finite Fields

```ts
// Create a new finite field class with modulus p = 251
class F_251 extends createField(251n) {}
// Create a new elliptic curve class over a finite field
class G extends createEllipticCurveGroup(F_251, {
  a: 0n,
  b: 3n,
  g: { x: 1n, y: 2n },
}) {}
```

### Extension fields

```ts
// Create a new finite field class with modulus p = 251
class F_251 extends createField(251n) {}
// Extend the field
let ir = P.from([F.from(2n), F.from(0n), F.from(1n)]);

class Fk extends extend(F, ir.coefficients, 2n) {}
```
